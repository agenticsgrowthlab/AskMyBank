# Architecture

## System Overview

```
Customer (Browser)
    │
    ▼
Chat Interface (React + Zustand)
    │  POST /api/chat
    ▼
Express Server
    │
    ▼
AI Layer (Claude + Tool Calling)
    │  getAccounts / getBalance
    ▼
Banking Service (IBankingService)
    │  reads / mutates
    ▼
Seed Data (In-Memory)
```

## Money Movement Data Flow

1. Customer sends "Move $200 from checking to savings"
2. Frontend POSTs to `/api/chat`
3. AI Layer calls `getAccounts` → resolves account IDs
4. AI Layer calls `getBalance` → verifies sufficient funds
5. AI Layer returns `transferPending` signal (does NOT execute)
6. Frontend renders ConfirmationDialog
7. Customer clicks "Confirm Transfer"
8. Frontend POSTs with `confirmTransfer` payload
9. Backend calls `transferBetweenAccounts` directly (bypasses AI)
10. Returns success message with reference number

## MCP-Ready Boundary

`IBankingService` is the only interface the AI Layer touches. The current `MockBankingService` can be replaced by an authenticated MCP client — no changes needed to the AI Layer or frontend.

## Transfer Safety

`transferBetweenAccounts` is intentionally NOT exposed as an AI tool. The AI can only signal intent. Execution requires the customer's explicit confirmation button click.

## Tools Exposed to AI

| Tool | Purpose |
|---|---|
| `getAccounts` | Resolve account IDs and names |
| `getBalance` | Verify sufficient funds before confirmation |
