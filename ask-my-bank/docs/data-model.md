# Data Model

## Overview

AskMyBank uses a simple in-memory data model with two accounts. The Money Movement workflow uses `Account` for balance verification and `TransferResult` for execution outcomes. All amounts are stored as numbers with two decimal places. Data resets on server restart.

---

## Entities

### Account

| Field | Type | Description | Example |
|---|---|---|---|
| `accountId` | string | Unique identifier | `"chk-001"` |
| `name` | string | Display name | `"Checking"` |
| `type` | `"checking"` \| `"savings"` | Account type | `"checking"` |
| `balance` | number | Current balance (2 decimal places) | `2450.00` |
| `currency` | string | ISO 4217 currency code | `"USD"` |

### TransferResult

Returned on successful transfer execution. Fields marked with ★ are surfaced to the customer in the success state.

| Field | Type | Surfaced | Description | Example |
|---|---|---|---|---|
| `referenceNumber` ★ | string | Yes | Customer-facing reference | `"REF-20260819-A3K7"` |
| `amount` ★ | number | Yes | Transfer amount | `200.00` |
| `fromNewBalance` ★ | number | Yes | Updated source balance | `2250.00` |
| `toNewBalance` ★ | number | Yes | Updated destination balance | `8400.00` |
| `transactionId` | string | No | Internal transaction ID (not displayed) | `"txn-1787190648473"` |
| `fromAccountId` | string | No | Source account ID (name used instead) | `"chk-001"` |
| `toAccountId` | string | No | Destination account ID (name used instead) | `"sav-001"` |
| `timestamp` | string | No | Execution timestamp (not displayed) | `"2026-08-19T14:32:00Z"` |

### BankingServiceError

Returned when a transfer operation fails validation.

| Field | Type | Description |
|---|---|---|
| `error` | `"ACCOUNT_NOT_FOUND"` \| `"INSUFFICIENT_FUNDS"` \| `"INVALID_AMOUNT"` \| `"SAME_ACCOUNT"` | Error code |
| `message` | string | Human-readable explanation |

---

## Seed Data

### Accounts

| Account ID | Name | Type | Starting Balance |
|---|---|---|---|
| `chk-001` | Checking | checking | $2,450.00 |
| `sav-001` | Savings | savings | $8,200.00 |

These two accounts support the Money Movement demo: Checking has sufficient balance for a $200 transfer to Savings.

---

## State Mutation

The only operation that mutates state is `transferBetweenAccounts`:

1. Validates source ≠ destination
2. Validates amount > 0
3. Validates source balance ≥ amount
4. Decreases `from.balance` by `amount`
5. Increases `to.balance` by `amount`
6. Returns a `TransferResult` with reference number and new balances

All read operations (`getAccounts`, `getBalance`) are idempotent and never modify state.

---

## Notes

- Balances use `parseFloat((value).toFixed(2))` to prevent floating-point drift
- Data is held in-memory only — resets on server restart
- No database or persistence layer
- `transactionId`, `fromAccountId`, `toAccountId`, and `timestamp` exist in the result for MCP-readiness but are not displayed in the current UI