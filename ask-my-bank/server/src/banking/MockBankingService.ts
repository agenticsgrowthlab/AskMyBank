import type { IBankingService } from './IBankingService.js';
import type {
  Account,
  Transaction,
  TransferResult,
  BankingServiceError,
} from '../types/index.js';
import { seedAccounts, seedTransactions } from './seedData.js';

/**
 * MockBankingService — in-memory implementation of IBankingService.
 *
 * Holds accounts in a Map for O(1) lookup.
 * transferBetweenAccounts mutates balances in-place so subsequent
 * getBalance calls reflect the transfer within the same session.
 *
 * MCP-ready: replace this class with an authenticated MCP client
 * that implements IBankingService without changing any other code.
 */
export class MockBankingService implements IBankingService {
  private readonly accounts: Map<string, Account>;
  private readonly transactions: Transaction[];

  constructor() {
    // Deep-copy seed accounts so each instance is independent (important for tests)
    this.accounts = new Map(
      seedAccounts.map((a) => [a.accountId, { ...a }]),
    );
    this.transactions = [...seedTransactions];
  }

  async getAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getBalance(accountId: string): Promise<Account | BankingServiceError> {
    const account = this.accounts.get(accountId);
    if (!account) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        message: `No account found for id: ${accountId}`,
      };
    }
    return account;
  }

  async getTransactions(
    accountId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Transaction[] | BankingServiceError> {
    if (!this.accounts.has(accountId)) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        message: `No account found for id: ${accountId}`,
      };
    }

    return this.transactions.filter((t) => {
      if (t.accountId !== accountId) return false;
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });
  }

  async transferBetweenAccounts(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<TransferResult | BankingServiceError> {
    const from = this.accounts.get(fromAccountId);
    if (!from) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        message: `No account found for id: ${fromAccountId}`,
      };
    }

    const to = this.accounts.get(toAccountId);
    if (!to) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        message: `No account found for id: ${toAccountId}`,
      };
    }

    if (fromAccountId === toAccountId) {
      return {
        error: 'SAME_ACCOUNT',
        message: 'Cannot transfer to the same account.',
      };
    }

    if (amount <= 0) {
      return {
        error: 'INVALID_AMOUNT',
        message: `Transfer amount must be greater than 0. Received: ${amount}`,
      };
    }

    if (from.balance < amount) {
      return {
        error: 'INSUFFICIENT_FUNDS',
        message: `Insufficient funds: available $${from.balance.toFixed(2)}, requested $${amount.toFixed(2)}`,
      };
    }

    // Mutate balances in-place — float-safe rounding
    from.balance = parseFloat((from.balance - amount).toFixed(2));
    to.balance = parseFloat((to.balance + amount).toFixed(2));

    // Generate a deterministic reference number
    const refDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const refSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const referenceNumber = `REF-${refDate}-${refSuffix}`;

    return {
      transactionId: `txn-${Date.now()}`,
      referenceNumber,
      fromAccountId,
      toAccountId,
      amount,
      fromNewBalance: from.balance,
      toNewBalance: to.balance,
      timestamp: new Date().toISOString(),
    };
  }
}
