import type {
  Account,
  Transaction,
  TransferResult,
  BankingServiceError,
} from '../types/index.js';

/**
 * The MCP-ready Banking Service interface.
 * MockBankingService implements this for the prototype.
 * Replace with an authenticated MCP client implementation
 * to connect to a real banking core — no AI Layer changes required.
 */
export interface IBankingService {
  /** Returns all accounts for the customer. */
  getAccounts(): Promise<Account[]>;

  /** Returns the current balance for a specific account, or an error if not found. */
  getBalance(accountId: string): Promise<Account | BankingServiceError>;

  /**
   * Returns transactions for an account, optionally filtered by date range.
   * Dates are ISO 8601 strings (e.g. "2026-08-01").
   */
  getTransactions(
    accountId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Transaction[] | BankingServiceError>;

  /**
   * Transfers funds between two accounts.
   * Returns updated balances on success, or a typed error on failure.
   * Never throws — always returns a result or BankingServiceError.
   */
  transferBetweenAccounts(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<TransferResult | BankingServiceError>;
}
