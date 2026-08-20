import type { ChatMessage } from '../types/index';
import { Check } from '@phosphor-icons/react';

interface Props {
  message: ChatMessage;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-space-3 py-space-2" aria-label="Thinking…" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-neutral-400 motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function isTransferSuccess(content: string): boolean {
  return content.startsWith('✓ Transfer complete');
}

function isInsufficientFunds(content: string): boolean {
  return content.toLowerCase().includes('insufficient funds');
}

function TransferSuccessContent({ content }: { content: string }) {
  const refMatch = content.match(/Reference:\s*(REF-[\w-]+)/);
  const amountMatch = content.match(/\$([\d,]+\.\d{2})\s+has been moved/);
  const fromMatch = content.match(/from\s+(\w+)\s+to/);
  const toMatch = content.match(/to\s+(\w+)\./);
  const balancesMatch = content.match(/New balances:\s*(.+)/);

  const reference = refMatch?.[1] ?? '';
  const amount = amountMatch ? `$${amountMatch[1]}` : '';
  const fromName = fromMatch?.[1] ?? '';
  const toName = toMatch?.[1] ?? '';

  return (
    <div className="py-space-2">
      <div className="flex flex-col items-center text-center mb-space-4">
        <Check size={24} weight="bold" className="text-neutral-700 mb-2" aria-label="Status complete" />
        <p className="text-body-sm text-neutral-600">Status</p>
        <p className="text-body-md font-medium text-neutral-900">Complete</p>
      </div>

      <div className="bg-neutral-50 rounded-md px-space-3 py-space-3 space-y-2 border border-neutral-200">
        {amount && (
          <div className="flex justify-between items-center">
            <span className="text-body-sm text-neutral-600">Amount</span>
            <span className="text-heading-xl text-neutral-900">{amount}</span>
          </div>
        )}
        {fromName && (
          <div className="flex justify-between items-center">
            <span className="text-body-sm text-neutral-600">From</span>
            <span className="text-body-md text-neutral-900">{fromName}</span>
          </div>
        )}
        {toName && (
          <div className="flex justify-between items-center">
            <span className="text-body-sm text-neutral-600">To</span>
            <span className="text-body-md text-neutral-900">{toName}</span>
          </div>
        )}
        {reference && (
          <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
            <span className="text-body-sm text-neutral-600">Reference</span>
            <span className="text-label-sm text-neutral-700 font-mono">{reference}</span>
          </div>
        )}
        {balancesMatch && (
          <div className="pt-2 border-t border-neutral-100">
            <p className="text-body-sm text-neutral-600">{balancesMatch[1]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InsufficientFundsContent({ content }: { content: string }) {
  // Strip markdown bold
  const cleaned = content.replace(/\*\*(.+?)\*\*/g, '$1');
  return (
    <div role="alert" className="bg-error-50 border-l-2 border-error-500 rounded-md px-space-3 py-space-2">
      <p className="text-label-md text-error-500 mb-1">Insufficient funds</p>
      <p className="text-body-sm text-neutral-700">{cleaned}</p>
    </div>
  );
}

/** Renders plain assistant text with markdown bold stripped */
function PlainContent({ content }: { content: string }) {
  const cleaned = content.replace(/\*\*(.+?)\*\*/g, '$1');
  return <span className="whitespace-pre-wrap">{cleaned}</span>;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%] bg-primary-500 text-white text-body-md rounded-md px-space-3 py-space-2 leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  const content = message.content;

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[85%] bg-neutral-100 text-neutral-700 text-body-md rounded-md px-space-3 py-space-2 leading-relaxed">
        {isTransferSuccess(content) ? (
          <TransferSuccessContent content={content} />
        ) : isInsufficientFunds(content) ? (
          <InsufficientFundsContent content={content} />
        ) : (
          <PlainContent content={content} />
        )}
      </div>
    </div>
  );
}

export function LoadingBubble() {
  return (
    <div className="flex justify-start mb-3" aria-busy="true">
      <div className="bg-neutral-100 rounded-md">
        <LoadingDots />
      </div>
    </div>
  );
}
