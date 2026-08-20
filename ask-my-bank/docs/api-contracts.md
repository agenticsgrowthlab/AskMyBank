# API & Tool Contracts

## HTTP Endpoint

### POST /api/chat

Single endpoint for the money movement conversation.

**Request — Transfer Intent:**
```json
{
  "messages": [
    { "id": "msg-1", "role": "user", "content": "Move $200 from checking to savings", "timestamp": "2026-08-19T14:30:00Z" }
  ]
}
```

**Response — Transfer Pending:**
```json
{
  "message": { "id": "msg-2", "role": "assistant", "content": "I've confirmed the details...", "timestamp": "..." },
  "transferPending": {
    "fromAccountId": "chk-001",
    "fromAccountName": "Checking",
    "toAccountId": "sav-001",
    "toAccountName": "Savings",
    "amount": 200.00
  }
}
```

**Request — Confirm Transfer:**
```json
{
  "messages": [...],
  "confirmTransfer": { "fromAccountId": "chk-001", "fromAccountName": "Checking", "toAccountId": "sav-001", "toAccountName": "Savings", "amount": 200.00 }
}
```

**Response — Success:**
```json
{
  "message": { "id": "msg-3", "role": "assistant", "content": "✓ Transfer complete! $200.00 has been moved from Checking to Savings.\nReference: REF-20260819-A3K7\nNew balances: Checking $2,250.00, Savings $8,400.00.", "timestamp": "..." }
}
```

## Banking Service Operations (Internal)

### getAccounts()
- Returns: `[{ accountId, name, type, balance, currency }]`

### getBalance({ accountId })
- Returns: `{ accountId, name, balance, currency }`
- Error: `{ error: "ACCOUNT_NOT_FOUND", message: "..." }`

### transferBetweenAccounts({ fromAccountId, toAccountId, amount })
- Success: `{ transactionId, referenceNumber, fromAccountId, toAccountId, amount, fromNewBalance, toNewBalance, timestamp }`
- Error: `{ error: "INSUFFICIENT_FUNDS" | "SAME_ACCOUNT" | "ACCOUNT_NOT_FOUND", message: "..." }`

## Error Codes

| Code | Meaning |
|---|---|
| `ACCOUNT_NOT_FOUND` | Invalid account ID |
| `INSUFFICIENT_FUNDS` | Amount exceeds available balance |
| `SAME_ACCOUNT` | Cannot transfer to the same account |
| `INVALID_AMOUNT` | Amount ≤ 0 |
| `TIMEOUT` | Request exceeded 30-second limit |
