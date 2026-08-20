import type Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic tool definitions for the Money Movement workflow.
 * Only getAccounts and getBalance are needed — they resolve account IDs
 * and verify sufficient funds before the transfer confirmation step.
 *
 * transferBetweenAccounts is intentionally NOT a tool — the AI signals
 * intent via transfer_pending JSON; the backend executes only after
 * explicit customer confirmation.
 */
export const tools: Anthropic.Tool[] = [
  {
    name: 'getAccounts',
    description:
      'Returns all accounts for the customer. Use to resolve account IDs and names when the customer requests a transfer.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'getBalance',
    description:
      'Returns the current balance for a specific account. Use to verify sufficient funds before presenting a transfer for confirmation.',
    input_schema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: "The account ID (e.g. 'chk-001' for Checking, 'sav-001' for Savings).",
        },
      },
      required: ['accountId'],
    },
  },
];
