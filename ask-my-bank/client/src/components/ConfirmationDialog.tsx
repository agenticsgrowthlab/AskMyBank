import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

/** Mask account ID to last 4 characters: "chk-001" -> "****001" */
function maskAccountId(id: string): string {
  const last4 = id.slice(-4);
  return `****${last4}`;
}

export default function ConfirmationDialog() {
  const pendingTransfer = useChatStore((s) => s.pendingTransfer);
  const confirmTransfer = useChatStore((s) => s.confirmTransfer);
  const cancelTransfer = useChatStore((s) => s.cancelTransfer);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);

  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    setTimeout(() => confirmRef.current?.focus(), 0);
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelTransfer();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [cancelTransfer],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!pendingTransfer) return null;

  const formattedAmount = `$${pendingTransfer.amount.toFixed(2)}`;
  const description = `Transfer ${formattedAmount} from ${pendingTransfer.fromAccountName} ${maskAccountId(pendingTransfer.fromAccountId)} to ${pendingTransfer.toAccountName} ${maskAccountId(pendingTransfer.toAccountId)}`;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-neutral-900/50 z-40"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
      >
        {/* Card — matches Nymbus AlertDialog: rounded-lg, tight padding */}
        <div className="w-full max-w-[420px] bg-neutral-0 rounded-lg shadow-lg">
          {/* Content */}
          <div className="p-6 pb-4">
            <p id="dialog-title" className="text-lg font-semibold text-neutral-900">
              Confirm Transfer
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              {description}
            </p>

            {/* Error state */}
            {error && (
              <div role="alert" className="mt-3 bg-error-50 border-l-4 border-error-500 rounded-md px-3 py-2">
                <p className="text-label-md text-error-500">Transfer failed</p>
                <p className="text-body-sm text-neutral-700 mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* Footer — compact, right-aligned, matching Nymbus AlertDialog button row */}
          <div className="flex justify-end gap-3 px-6 pb-6 pt-2">
            <button
              ref={cancelRef}
              onClick={cancelTransfer}
              disabled={isLoading}
              className={[
                'h-10 px-4 rounded-md text-sm font-medium',
                'text-primary-500 border border-primary-500 bg-neutral-0',
                'hover:bg-primary-50',
                'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
              ].join(' ')}
            >
              Cancel
            </button>
            <button
              ref={confirmRef}
              onClick={confirmTransfer}
              disabled={isLoading}
              aria-busy={isLoading}
              className={[
                'h-10 px-4 rounded-md text-sm font-medium',
                'bg-primary-500 text-white',
                'hover:bg-primary-600 active:bg-primary-700',
                'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2',
                'disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
                'transition-colors',
              ].join(' ')}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 motion-safe:animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-neutral-400 motion-safe:animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-neutral-400 motion-safe:animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                'Confirm Transfer'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}