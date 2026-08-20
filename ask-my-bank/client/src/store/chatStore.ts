import { create } from 'zustand';
import type { ChatMessage, ChatResponse, PendingTransfer } from '../types/index';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  pendingTransfer: PendingTransfer | null;
  error: string | null;

  sendMessage: (content: string) => Promise<void>;
  confirmTransfer: () => Promise<void>;
  cancelTransfer: () => void;
  clearError: () => void;
}

const makeId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  pendingTransfer: null,
  error: null,

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content,
      timestamp: now(),
    };

    set((s) => ({
      messages: [...s.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...get().messages] }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as ChatResponse;

      set((s) => ({
        messages: [...s.messages, data.message],
        isLoading: false,
        pendingTransfer: data.transferPending ?? null,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      set({ isLoading: false, error: message });
    }
  },

  confirmTransfer: async () => {
    const { pendingTransfer, messages } = get();
    if (!pendingTransfer) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, confirmTransfer: pendingTransfer }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as ChatResponse;

      set((s) => ({
        messages: [...s.messages, data.message],
        isLoading: false,
        pendingTransfer: null,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Transfer failed. Please try again.';
      set({ isLoading: false, error: message });
    }
  },

  cancelTransfer: () => {
    const cancelMsg: ChatMessage = {
      id: makeId(),
      role: 'assistant',
      content: 'Transfer cancelled.',
      timestamp: now(),
    };
    set((s) => ({
      pendingTransfer: null,
      messages: [...s.messages, cancelMsg],
    }));
  },

  clearError: () => set({ error: null }),
}));
