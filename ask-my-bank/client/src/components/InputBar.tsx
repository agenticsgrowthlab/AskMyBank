import { useState, useRef } from 'react';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useChatStore } from '../store/chatStore';

export default function InputBar() {
  const [value, setValue] = useState('');
  const isLoading = useChatStore((s) => s.isLoading);
  const pendingTransfer = useChatStore((s) => s.pendingTransfer);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = isLoading || pendingTransfer !== null;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue('');
    sendMessage(trimmed);
    // Return focus to input after submit
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {/* Visually hidden label for accessibility */}
      <label htmlFor="chat-input" className="sr-only">
        Message AskMyBank
      </label>

      <input
        ref={inputRef}
        id="chat-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask to move $200 from checking to savings"
        autoComplete="off"
        className={[
          'flex-1 h-10 px-space-3 rounded-sm text-body-md bg-neutral-0 text-neutral-900',
          'placeholder:text-neutral-400',
          'border border-neutral-200',
          'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
          'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
          'transition-colors',
        ].join(' ')}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className={[
          'flex items-center justify-center w-10 h-10 rounded-md shrink-0',
          'bg-primary-500 text-white',
          'hover:bg-primary-600 active:bg-primary-700',
          'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2',
          'disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
          'transition-colors',
        ].join(' ')}
      >
        <PaperPlaneTilt size={20} weight="regular" />
      </button>
    </div>
  );
}
