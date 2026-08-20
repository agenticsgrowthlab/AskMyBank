# AskMyBank

An AI-powered conversational money movement prototype that demonstrates a single end-to-end ACT workflow: transferring funds between accounts using natural language.

## Workflow: Money Movement

| Step | What happens |
|---|---|
| Request | Customer says "Move $200 from checking to savings" |
| Intent | AI identifies source, destination, and amount |
| Validation | System verifies sufficient funds |
| Confirmation | Nymbus-style confirmation dialog with masked account IDs |
| Execution | Transfer executes only after explicit confirmation |
| Success | Transaction reference, updated balances displayed |

## Scope Decision

This prototype intentionally focuses on one high-confidence Money Movement workflow rather than multiple broader workflows. This decision was made after design review to deliver a polished, complete, and demonstrable transfer experience within the exercise time constraint.

## Prerequisites

- Node.js 20+
- npm 9+
- An Anthropic API key (Claude Sonnet access required)

## Setup

```bash
cd ask-my-bank
npm install --workspaces

# Configure environment
cp .env.example .env
# Edit server/.env and add your ANTHROPIC_API_KEY
```

## Running

```bash
# Start the backend (port 3001)
cd server && npm run dev

# In a separate terminal, start the frontend (port 5173)
cd client && npm run dev
```

Open http://localhost:5173

## Testing

```bash
cd server && npx vitest run
```

## Documentation

- [Product Overview](docs/product-overview.md)
- [Architecture](docs/architecture.md)
- [API & Tool Contracts](docs/api-contracts.md)
- [AI Usage](docs/ai-usage.md)
- [Design System](docs/design-system.md)
- [Security Notes](docs/security-notes.md)
- [Known Limitations](docs/limitations.md)
- [Next Steps](docs/next-steps.md)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS v3, Zustand, Phosphor Icons |
| Backend | Node.js, Express, TypeScript, Anthropic Claude |
| Data | In-memory mocked banking data |
| Build | Vite (client), tsx (server) |
