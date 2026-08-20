# Known Limitations

## Scope

- **Single workflow only** — Only money movement (transfers) is supported
- **Two accounts only** — Checking and Savings (mocked)
- **No balance inquiry UI** — Balances are only visible in transfer context
- **No spending summary** — Transaction history is not exposed in the UI

## Data

- **In-memory only** — Resets on server restart
- **Single-user** — No multi-user support
- **No persistence** — Transfer results are lost on restart

## AI / NLP

- **English only**
- **Claude dependency** — Requires active Anthropic API key
- **Non-deterministic phrasing** — AI response wording varies

## UX

- **No message history persistence** — Chat clears on refresh
- **No streaming** — Responses appear all at once
