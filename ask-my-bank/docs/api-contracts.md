# API & Tool Contracts

## Overview

AskMyBank exposes a single HTTP endpoint (`POST /api/chat`) for all frontend interactions. Behind that endpoint, the backend uses an internal Banking Service interface with four operations. This document describes every API contract in the system.

---

## HTTP API

### POST /api/chat

**Base URL:** `http://localhost:3001`

Single endpoint for the money movement conversation. Handles transfer initiation, confirmation, and general conversation.

---

#### Request Schema

```typescript
interface ChatRequest {
  messages: ChatMessage[];            // Conversation history
  confirmTransfer?: PendingTransfer;  // Present only when confirming a transfer
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;  // ISO 8601
}

interface PendingTransfer {
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
}
```

---

#### Response Schema

```typescript
interface ChatResponse {
  message: ChatMessage;
  transferPending?: PendingTransfer;  // Present when AI confirms transfer is ready
}
```

---

#### Example: Transfer Intent

**Request:**
```json
{
  "messages": [
    { "id": "msg-1", "role": "user", "content": "Move $200 from checking to savings", "timestamp": "2026-08-19T14:30:00Z" }
  ]
}
```

**Response (200):**
```json
{
  "message": {
    "id": "msg-2",
    "role": "assistant",
    "content": "I've confirmed the details for your transfer.",
    "timestamp": "2026-08-19T14:31:00.000Z"
  },
  "transferPending": {
    "fromAccountId": "chk-001",
    "fromAccountName": "Checking",
    "toAccountId": "sav-001",
    "toAccountName": "Savings",
    "amount": 200.00
  }
}
```

---

#### Example: Confirm Transfer

**Request:**
```json
{
  "messages": [...],
  "confirmTransfer": {
    "fromAccountId": "chk-001",
    "fromAccountName": "Checking",
    "toAccountId": "sav-001",
    "toAccountName": "Savings",
    "amount": 200.00
  }
}
```

**Response (200) — Success:**
```json
{
  "message": {
    "id": "msg-3",
    "role": "assistant",
    "content": "✓ Transfer complete! $200.00 has been moved from Checking to Savings.\nReference: REF-20260819-A3K7\nNew balances: Checking $2,250.00, Savings $8,400.00.",
    "timestamp": "2026-08-19T14:32:00.000Z"
  }
}
```

**Response (200) — Insufficient Funds:**
```json
{
  "message": {
    "id": "msg-4",
    "role": "assistant",
    "content": "Transfer failed: insufficient funds. Available balance is $2,450.00.",
    "timestamp": "2026-08-19T14:33:00.000Z"
  }
}
```

---

#### Example: Out-of-Scope

**Request:**
```json
{
  "messages": [
    { "id": "msg-1", "role": "user", "content": "What's the weather?", "timestamp": "2026-08-19T14:34:00Z" }
  ]
}
```

**Response (200):**
```json
{
  "message": {
    "id": "msg-5",
    "role": "assistant",
    "content": "I can help you move money between your accounts. Try saying something like 'Move $200 from checking to savings'.",
    "timestamp": "2026-08-19T14:34:01.000Z"
  }
}
```

---

#### Error Responses

**400 — Invalid Request:**
```json
{ "error": "INVALID_REQUEST", "message": "messages must be a non-empty array" }
```

**500 — Internal Error:**
```json
{ "error": "INTERNAL_ERROR", "message": "Something went wrong." }
```

**504 — Timeout:**
```json
{ "error": "TIMEOUT", "message": "I'm sorry, I couldn't complete your request in time. Please try again." }
```

---

## Internal Banking Service API

These operations are NOT exposed as HTTP endpoints. They are called internally by the AI Layer. The interface is `IBankingService`.

---

### getAccounts()

Returns all accounts for the customer.

**Parameters:** None

**Returns:** `Account[]`

```json
[
  { "accountId": "chk-001", "name": "Checking", "type": "checking", "balance": 2450.00, "currency": "USD" },
  { "accountId": "sav-001", "name": "Savings", "type": "savings", "balance": 8200.00, "currency": "USD" }
]
```

---

### getBalance(accountId)

Returns the balance for a specific account.

**Parameters:**

| Name | Type | Required |
|---|---|---|
| `accountId` | string | Yes |

**Success:** `Account`
```json
{ "accountId": "chk-001", "name": "Checking", "type": "checking", "balance": 2450.00, "currency": "USD" }
```

**Error:**
```json
{ "error": "ACCOUNT_NOT_FOUND", "message": "No account found for id: xyz-999" }
```

---

### getTransactions(accountId, startDate?, endDate?)

Returns transactions for an account, optionally filtered by date range.

**Parameters:**

| Name | Type | Required |
|---|---|---|
| `accountId` | string | Yes |
| `startDate` | string (ISO 8601) | No |
| `endDate` | string (ISO 8601) | No |

**Success:** `Transaction[]`
```json
[
  { "transactionId": "txn-001", "accountId": "chk-001", "date": "2026-08-03", "description": "Whole Foods Market", "amount": 67.42, "direction": "debit", "category": "Groceries" }
]
```

**Error:**
```json
{ "error": "ACCOUNT_NOT_FOUND", "message": "No account found for id: xyz-999" }
```

---

### transferBetweenAccounts(fromAccountId, toAccountId, amount)

Transfers funds between two accounts. Mutates in-memory balances on success.

**Parameters:**

| Name | Type | Required |
|---|---|---|
| `fromAccountId` | string | Yes |
| `toAccountId` | string | Yes |
| `amount` | number (> 0) | Yes |

**Validation Order:**

1. Source account exists → else `ACCOUNT_NOT_FOUND`
2. Destination account exists → else `ACCOUNT_NOT_FOUND`
3. Source ≠ destination → else `SAME_ACCOUNT`
4. Amount > 0 → else `INVALID_AMOUNT`
5. Source balance ≥ amount → else `INSUFFICIENT_FUNDS`

**Success:** `TransferResult`
```json
{
  "transactionId": "txn-1787190648473",
  "referenceNumber": "REF-20260819-A3K7",
  "fromAccountId": "chk-001",
  "toAccountId": "sav-001",
  "amount": 200.00,
  "fromNewBalance": 2250.00,
  "toNewBalance": 8400.00,
  "timestamp": "2026-08-19T14:32:00.473Z"
}
```

**Error — Insufficient Funds:**
```json
{ "error": "INSUFFICIENT_FUNDS", "message": "Insufficient funds: available $2,450.00, requested $999,999.00" }
```

**Error — Same Account:**
```json
{ "error": "SAME_ACCOUNT", "message": "Cannot transfer to the same account." }
```

**Error — Account Not Found:**
```json
{ "error": "ACCOUNT_NOT_FOUND", "message": "No account found for id: xyz-999" }
```

**Error — Invalid Amount:**
```json
{ "error": "INVALID_AMOUNT", "message": "Transfer amount must be greater than 0. Received: -50" }
```

---

## AI Tool Exposure

| Operation | Exposed to AI | Reason |
|---|---|---|
| `getAccounts` | Yes | Resolves account IDs/names for transfer |
| `getBalance` | Yes | Verifies sufficient funds before confirmation |
| `getTransactions` | No | Not used in Money Movement workflow |
| `transferBetweenAccounts` | No | Requires explicit customer confirmation |

The AI signals transfer intent via a `transfer_pending` JSON signal. The backend only calls `transferBetweenAccounts` when the frontend sends a `confirmTransfer` payload — guaranteeing the customer, not the AI, triggers fund movement.

---

## Error Code Reference

| Code | HTTP Status | Meaning |
|---|---|---|
| `ACCOUNT_NOT_FOUND` | 200 (in message) | Account ID does not exist |
| `INSUFFICIENT_FUNDS` | 200 (in message) | Transfer amount exceeds available balance |
| `SAME_ACCOUNT` | 200 (in message) | Source and destination are the same |
| `INVALID_AMOUNT` | 200 (in message) | Amount is zero or negative |
| `INVALID_REQUEST` | 400 | Missing or malformed request body |
| `INTERNAL_ERROR` | 500 | Unhandled server exception |
| `TIMEOUT` | 504 | AI/tool loop exceeded 30 seconds |