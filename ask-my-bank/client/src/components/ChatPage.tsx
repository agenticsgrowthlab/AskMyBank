import MessageList from './MessageList';
import InputBar from './InputBar';
import ConfirmationDialog from './ConfirmationDialog';
import { useChatStore } from '../store/chatStore';

export default function ChatPage() {
  const pendingTransfer = useChatStore((s) => s.pendingTransfer);

  return (
    <div className="flex flex-col h-screen max-w-[1280px] mx-auto px-4 md:px-6">
      {/* Header */}
      <header className="flex items-center h-16 border-b border-neutral-200 bg-neutral-0 shrink-0">
        <span className="text-heading-md font-semibold" style={{ color: "#0C214C" }}>AskMyBank</span>
      </header>

      {/* Message area — grows to fill available space */}
      <div className="flex-1 overflow-hidden relative">
        <MessageList />
      </div>

      {/* Fixed input bar */}
      <div className="shrink-0 border-t border-neutral-200 bg-neutral-0 pb-safe">
        <InputBar />
      </div>

      {/* Transfer confirmation dialog — portal-like overlay */}
      {pendingTransfer && <ConfirmationDialog />}
    </div>
  );
}
