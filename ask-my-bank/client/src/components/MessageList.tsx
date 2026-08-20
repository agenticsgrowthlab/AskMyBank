import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import MessageBubble, { LoadingBubble } from './MessageBubble';
import SuggestedChips from './SuggestedChips';

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="h-full overflow-y-auto px-4 pt-4 pb-2">
      {/* Welcome + suggested chips — shown before first user message */}
      {!hasUserMessages && (
        <div className="flex justify-start mb-3">
          <div className="max-w-[85%] bg-neutral-100 text-neutral-700 text-body-md rounded-md px-space-3 py-space-2">
            <p className="mb-3">
              Hi! I'm AskMyBank. I can help you move money between your accounts.
            </p>
            <SuggestedChips />
          </div>
        </div>
      )}

      {/* Unified message list — aria-live wraps the whole list so new assistant
          bubbles are announced. User bubbles are aria-hidden from screen readers
          because the user authored them and doesn't need them re-announced. */}
      <div aria-live="polite" aria-label="Conversation" aria-atomic="false">
        {messages.map((msg) => (
          <div key={msg.id} aria-hidden={msg.role === 'user' ? 'true' : undefined}>
            <MessageBubble message={msg} />
          </div>
        ))}

        {isLoading && <LoadingBubble />}
      </div>

      {/* Error alert */}
      {error && (
        <div role="alert" className="flex justify-start mb-3">
          <div className="max-w-[85%] bg-error-50 border-l-4 border-error-500 rounded-md px-space-3 py-space-2">
            <p className="text-label-md text-error-500 mb-1">Something went wrong</p>
            <p className="text-body-sm text-neutral-700">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-body-sm text-primary-500 underline focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
