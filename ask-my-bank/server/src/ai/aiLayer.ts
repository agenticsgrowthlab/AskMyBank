import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt } from './systemPrompt.js';
import { tools } from './toolDefinitions.js';
import type { IBankingService } from '../banking/IBankingService.js';
import type { ChatMessage, ChatResponse, PendingTransfer } from '../types/index.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_TOOL_ITERATIONS = 5;
const TIMEOUT_MS = 30_000;

/** Execute a named banking tool and return a JSON-serialisable result. */
async function executeTool(
  name: string,
  args: Record<string, unknown>,
  service: IBankingService,
): Promise<unknown> {
  switch (name) {
    case 'getAccounts':
      return service.getAccounts();
    case 'getBalance':
      return service.getBalance(args.accountId as string);
    default:
      return { error: 'UNKNOWN_TOOL', message: `Unknown tool: ${name}` };
  }
}

/**
 * Runs one AI turn using Anthropic Claude.
 *
 * - If confirmTransfer is present: executes the transfer directly (bypasses AI).
 * - Otherwise: runs the Claude tool-calling loop (max 5 iterations).
 */
export async function runAITurn(
  messages: ChatMessage[],
  service: IBankingService,
  confirmTransfer?: PendingTransfer | null,
): Promise<ChatResponse> {
  const messageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = () => new Date().toISOString();

  // ── Confirmation path ───────────────────────────────────────────────────────
  if (confirmTransfer) {
    const result = await service.transferBetweenAccounts(
      confirmTransfer.fromAccountId,
      confirmTransfer.toAccountId,
      confirmTransfer.amount,
    );

    if ('error' in result) {
      const errMsg =
        result.error === 'INSUFFICIENT_FUNDS'
          ? `Transfer failed: insufficient funds. Available balance is $${
              ((await service.getBalance(confirmTransfer.fromAccountId)) as { balance: number }).balance?.toFixed(2) ?? '—'
            }.`
          : `Transfer failed: ${result.message}`;
      return {
        message: { id: messageId(), role: 'assistant', content: errMsg, timestamp: now() },
      };
    }

    const successMsg =
      `✓ Transfer complete! $${result.amount.toFixed(2)} has been moved from ${
        confirmTransfer.fromAccountName
      } to ${confirmTransfer.toAccountName}.\n` +
      `Reference: ${result.referenceNumber}\n` +
      `New balances: ${confirmTransfer.fromAccountName} $${result.fromNewBalance.toFixed(2)}, ` +
      `${confirmTransfer.toAccountName} $${result.toNewBalance.toFixed(2)}.`;

    return {
      message: { id: messageId(), role: 'assistant', content: successMsg, timestamp: now() },
    };
  }

  // ── AI tool-calling loop (Anthropic) ────────────────────────────────────────
  // Build messages array for Anthropic (user/assistant alternating)
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS),
  );

  let iterations = 0;

  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations++;

    const response = await Promise.race([
      anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: getSystemPrompt(),
        messages: anthropicMessages,
        tools,
      }),
      timeoutPromise,
    ]);

    // ── Tool use ──────────────────────────────────────────────────────────────
    if (response.stop_reason === 'tool_use') {
      // Add assistant's response (contains tool_use blocks)
      anthropicMessages.push({
        role: 'assistant',
        content: response.content,
      });

      // Execute each tool call and build tool_result blocks
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const result = await executeTool(
            block.name,
            block.input as Record<string, unknown>,
            service,
          );
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }

      // Send tool results back as a user message
      anthropicMessages.push({
        role: 'user',
        content: toolResults,
      });

      continue; // re-submit with tool results
    }

    // ── Final response (end_turn or no more tool calls) ───────────────────────
    // Extract text content from the response
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === 'text',
    );
    const content = textBlocks.map((b) => b.text).join('\n');

    // Detect transfer_pending signal — try JSON extraction first
    const pendingMatch = content.match(/\{[^{}]*"action"\s*:\s*"transfer_pending"[^{}]*\}/);
    if (pendingMatch) {
      try {
        const pending = JSON.parse(pendingMatch[0]) as {
          action: string;
          fromAccountId: string;
          fromAccountName: string;
          toAccountId: string;
          toAccountName: string;
          amount: number;
        };
        const displayMsg =
          "I've confirmed the details for your transfer.";
        return {
          message: { id: messageId(), role: 'assistant', content: displayMsg, timestamp: now() },
          transferPending: {
            fromAccountId: pending.fromAccountId,
            fromAccountName: pending.fromAccountName,
            toAccountId: pending.toAccountId,
            toAccountName: pending.toAccountName,
            amount: pending.amount,
          },
        };
      } catch {
        // Fall through to fallback detection
      }
    }

    // Fallback: detect conversational transfer confirmation pattern
    // Claude sometimes describes the transfer instead of emitting pure JSON
    const hasTransferIntent =
      content.toLowerCase().includes('from') &&
      content.toLowerCase().includes('to') &&
      content.match(/\$[\d,]+\.?\d*/);
    const fromIdMatch = content.match(/chk-001|sav-001/g);
    const amountMatch = content.match(/\$([\d,]+\.?\d*)/);

    if (hasTransferIntent && fromIdMatch && fromIdMatch.length >= 1 && amountMatch) {
      // Try to reconstruct from the conversation context — check what the AI was asked
      const lastUserMsg = messages[messages.length - 1];
      const transferMatch = lastUserMsg?.content?.match(
        /(?:move|transfer|send)\s+\$?([\d,]+(?:\.\d{2})?)\s+from\s+(\w+)\s+to\s+(\w+)/i
      );
      if (transferMatch) {
        const amount = parseFloat(transferMatch[1].replace(',', ''));
        const fromName = transferMatch[2].charAt(0).toUpperCase() + transferMatch[2].slice(1).toLowerCase();
        const toName = transferMatch[3].charAt(0).toUpperCase() + transferMatch[3].slice(1).toLowerCase();
        const fromId = fromName.toLowerCase() === 'checking' ? 'chk-001' : 'sav-001';
        const toId = toName.toLowerCase() === 'savings' ? 'sav-001' : 'chk-001';

        return {
          message: { id: messageId(), role: 'assistant', content: "I've confirmed the details for your transfer.", timestamp: now() },
          transferPending: {
            fromAccountId: fromId,
            fromAccountName: fromName,
            toAccountId: toId,
            toAccountName: toName,
            amount,
          },
        };
      }
    }

    return {
      message: { id: messageId(), role: 'assistant', content, timestamp: now() },
    };
  }

  throw new Error('MAX_ITERATIONS_EXCEEDED');
}
