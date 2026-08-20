# AI Usage

## Development

This prototype was designed and built using AI-assisted development (Kiro). After design review, the scope was narrowed from three workflows to one Money Movement workflow.

## Runtime: Claude Sonnet with Tool Calling

### System Prompt

The AI is scoped exclusively to money movement. It:
- Calls `getAccounts` to resolve account names to IDs
- Calls `getBalance` to verify sufficient funds
- Returns a structured `transfer_pending` JSON signal when ready for confirmation
- Declines out-of-scope requests

### Why transferBetweenAccounts Is NOT an AI Tool

The AI cannot execute transfers. It can only signal intent. The backend executes the transfer only after:
1. The frontend renders a confirmation dialog
2. The customer clicks "Confirm Transfer"
3. The frontend sends `confirmTransfer` in the next request

### Tool Call Loop

```
Customer message → AI calls getAccounts → AI calls getBalance
  → If sufficient: AI returns transfer_pending JSON
  → If insufficient: AI explains available balance
  → If ambiguous: AI asks clarifying question
```
