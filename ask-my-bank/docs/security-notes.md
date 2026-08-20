# Security Notes

## Prototype Disclaimer

This is a demonstration prototype, not production software. The security measures below are appropriate for the prototype context.

## API Key Handling

- The Anthropic API key is stored in `.env` (git-ignored)
- `.env.example` contains placeholder values only — no real keys
- The key is never sent to the frontend or exposed in client code

## No PII in Mocked Data

- All account data is fictional
- No real customer information is present
- Account numbers, balances, and transactions are hardcoded seed data

## CORS Configuration

- The server allows requests from the Vite dev server origin only
- No wildcard origins

## Trust Model

- Financial data is always sourced from the Banking Service, never from AI memory
- The AI cannot execute transfers — only signal intent
- Transfer execution requires explicit customer confirmation through the UI
- Error messages never expose internal server details or stack traces

## What This Does NOT Cover (Production Requirements)

- Authentication / identity verification
- Authorization / role-based access
- TLS / HTTPS enforcement
- Rate limiting
- Input sanitization beyond what Express provides
- Session management
- Audit logging
- Data encryption at rest
