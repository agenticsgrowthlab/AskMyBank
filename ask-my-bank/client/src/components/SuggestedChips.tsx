import { useChatStore } from '../store/chatStore';

const CHIPS = [
  "Move $200 from checking to savings",
];

export default function SuggestedChips() {
  const sendMessage = useChatStore((s) => s.sendMessage);
  const isLoading = useChatStore((s) => s.isLoading);

  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((chip) => (
        <button
          key={chip}
          onClick={() => sendMessage(chip)}
          disabled={isLoading}
          className={[
            'px-space-3 min-h-[44px] rounded-md text-label-sm',
            'bg-neutral-0 text-primary-500 border border-primary-500',
            'hover:bg-primary-50',
            'focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
          ].join(' ')}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
