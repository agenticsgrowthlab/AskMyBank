import { describe, it, expect, beforeEach } from 'vitest';
import { MockBankingService } from './MockBankingService.js';

describe('MockBankingService', () => {
  let service: MockBankingService;

  beforeEach(() => {
    service = new MockBankingService();
  });

  describe('Balance mutation after transfer', () => {
    it('updates both account balances after a successful transfer', async () => {
      const result = await service.transferBetweenAccounts('chk-001', 'sav-001', 200);

      // Should be a success result
      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('fromNewBalance', 2250.00);
      expect(result).toHaveProperty('toNewBalance', 8400.00);

      // Subsequent getBalance calls reflect the transfer
      const checking = await service.getBalance('chk-001');
      expect(checking).toHaveProperty('balance', 2250.00);

      const savings = await service.getBalance('sav-001');
      expect(savings).toHaveProperty('balance', 8400.00);
    });
  });

  describe('Insufficient funds rejection', () => {
    it('returns INSUFFICIENT_FUNDS error when amount exceeds balance', async () => {
      const result = await service.transferBetweenAccounts('chk-001', 'sav-001', 999999);

      expect(result).toHaveProperty('error', 'INSUFFICIENT_FUNDS');
      expect(result).toHaveProperty('message');

      // Balances unchanged
      const checking = await service.getBalance('chk-001');
      expect(checking).toHaveProperty('balance', 2450.00);

      const savings = await service.getBalance('sav-001');
      expect(savings).toHaveProperty('balance', 8200.00);
    });
  });

  describe('Account-not-found errors', () => {
    it('getBalance returns ACCOUNT_NOT_FOUND for invalid ID', async () => {
      const result = await service.getBalance('nonexistent');
      expect(result).toHaveProperty('error', 'ACCOUNT_NOT_FOUND');
    });

    it('getTransactions returns ACCOUNT_NOT_FOUND for invalid ID', async () => {
      const result = await service.getTransactions('nonexistent');
      expect(result).toHaveProperty('error', 'ACCOUNT_NOT_FOUND');
    });

    it('transferBetweenAccounts returns ACCOUNT_NOT_FOUND for invalid source', async () => {
      const result = await service.transferBetweenAccounts('nonexistent', 'sav-001', 100);
      expect(result).toHaveProperty('error', 'ACCOUNT_NOT_FOUND');
    });

    it('transferBetweenAccounts returns ACCOUNT_NOT_FOUND for invalid destination', async () => {
      const result = await service.transferBetweenAccounts('chk-001', 'nonexistent', 100);
      expect(result).toHaveProperty('error', 'ACCOUNT_NOT_FOUND');
    });
  });

  describe('Read idempotency', () => {
    it('getAccounts does not modify state across multiple calls', async () => {
      const first = await service.getAccounts();
      const second = await service.getAccounts();

      expect(first).toEqual(second);

      // Balances are still at seed values
      const checking = await service.getBalance('chk-001');
      expect(checking).toHaveProperty('balance', 2450.00);
    });

    it('getTransactions does not modify state across multiple calls', async () => {
      const first = await service.getTransactions('chk-001');
      const second = await service.getTransactions('chk-001');

      expect(first).toEqual(second);

      // Balances unchanged
      const checking = await service.getBalance('chk-001');
      expect(checking).toHaveProperty('balance', 2450.00);
    });
  });
});
