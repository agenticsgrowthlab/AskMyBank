import type { Account, Transaction } from '../types/index.js';

// Compute current year-month prefix dynamically so transactions
// always fall in the current calendar month (supports UNDERSTAND workflow)
const ym = new Date().toISOString().slice(0, 7); // e.g. "2026-08"

/**
 * Seed accounts — exactly two per REQ-001:
 * - Checking: $2,450.00 (sufficient for $200 transfer demo)
 * - Savings:  $8,200.00
 */
export const seedAccounts: Account[] = [
  {
    accountId: 'chk-001',
    name: 'Checking',
    type: 'checking',
    balance: 2450.00,
    currency: 'USD',
  },
  {
    accountId: 'sav-001',
    name: 'Savings',
    type: 'savings',
    balance: 8200.00,
    currency: 'USD',
  },
];

/**
 * Seed transactions — enough to demonstrate all three workflows per REQ-001:
 * - 3 categorized debits in Checking this month  → supports UNDERSTAND (REQ-004)
 * - 1 credit in Checking (payroll)               → shows mixed transaction types
 * - 1 credit in Savings (interest)               → supports KNOW on savings (REQ-003)
 */
export const seedTransactions: Transaction[] = [
  // Checking — current-month debits (UNDERSTAND workflow)
  {
    transactionId: 'txn-001',
    accountId: 'chk-001',
    date: `${ym}-03`,
    description: 'Whole Foods Market',
    amount: 67.42,
    direction: 'debit',
    category: 'Groceries',
  },
  {
    transactionId: 'txn-002',
    accountId: 'chk-001',
    date: `${ym}-08`,
    description: 'Netflix',
    amount: 15.99,
    direction: 'debit',
    category: 'Subscriptions',
  },
  {
    transactionId: 'txn-003',
    accountId: 'chk-001',
    date: `${ym}-12`,
    description: 'Shell Gas Station',
    amount: 52.10,
    direction: 'debit',
    category: 'Gas',
  },
  // Checking — credit (payroll)
  {
    transactionId: 'txn-004',
    accountId: 'chk-001',
    date: `${ym}-01`,
    description: 'Direct Deposit Payroll',
    amount: 3200.00,
    direction: 'credit',
    category: 'Income',
  },
  // Savings — credit (interest, supports KNOW workflow on savings)
  {
    transactionId: 'txn-005',
    accountId: 'sav-001',
    date: `${ym}-05`,
    description: 'Interest Credit',
    amount: 12.50,
    direction: 'credit',
    category: 'Interest',
  },
];
