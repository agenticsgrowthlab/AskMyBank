// Shared data model — source of truth for client
// These types match the REQ-009 Banking_Service contracts exactly

export type AccountType = 'checking' | 'savings';
export type TransactionDirection = 'credit' | 'debit';

export interface Account {
  accountId: string;     // e.g. "chk-001"
  name: string;          // e.g. "Checking"
  type: AccountType;
  balance: number;       // two decimal places, e.g. 2450.00
  currency: string;      // ISO 4217, e.g. "USD"
}

export interface Transaction {
  transactionId: string; // e.g. "txn-001"
  accountId: string;     // owning account
  date: string;          // ISO 8601 date string, e.g. "2026-08-15"
  description: string;   // max 255 chars
  amount: number;        // two decimal places, always positive
  direction: TransactionDirection;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;     // ISO 8601
}

export interface TransferResult {
  transactionId: string;
  referenceNumber: string;  // e.g. "REF-20260819-A3K7"
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  fromNewBalance: number;
  toNewBalance: number;
  timestamp: string;     // ISO 8601
}

export interface BankingServiceError {
  error: 'ACCOUNT_NOT_FOUND' | 'INSUFFICIENT_FUNDS' | 'INVALID_AMOUNT' | 'SAME_ACCOUNT';
  message: string;
}

/** Frontend-only: drives the ConfirmationDialog */
export interface PendingTransfer {
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
}

/** POST /api/chat — request body */
export interface ChatRequest {
  messages: ChatMessage[];
  confirmTransfer?: PendingTransfer | null;
}

/** POST /api/chat — response body */
export interface ChatResponse {
  message: ChatMessage;
  transferPending?: PendingTransfer;
}
