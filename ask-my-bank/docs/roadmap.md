# Product Roadmap

## Context

This roadmap extends the AskMyBank prototype beyond the single Money Movement workflow delivered in the initial exercise. Estimates assume an AI-first builder team (1–2 engineers using AI-assisted development) working 8-hour days with rigorous testing including unit tests, integration tests, UAT, and design system compliance verification.

---

## Delivered (Day 0)

| Feature | Status |
|---|---|
| Money Movement — natural-language transfer | ✅ Complete |
| Confirmation dialog (Nymbus AlertDialog pattern) | ✅ Complete |
| Balance validation before execution | ✅ Complete |
| Same-account and insufficient-funds guards | ✅ Complete |
| Success state with transaction reference | ✅ Complete |
| Out-of-scope guardrail | ✅ Complete |
| Nymbus Joy design system compliance | ✅ Complete |
| WCAG 2.1 AA accessibility | ✅ Complete |
| Responsive layout (mobile + desktop) | ✅ Complete |
| MCP-ready service boundary | ✅ Complete |

---

## Phase 1 — KNOW Workflow (Balance Inquiry)

**Estimate: 1 day**

| Task | Hours |
|---|---|
| Structured balance_result signal (system prompt + AI Layer detection) | 1.5 |
| Nymbus Account Tile component (account name, balance, type badge) | 1.5 |
| Multi-account display (all balances when account not specified) | 1 |
| Error handling (account not found, timeout) | 1 |
| UAT + design system compliance testing | 1.5 |
| Documentation update | 0.5 |

**Deliverable:** Customer asks "What's my checking balance?" or "What are my balances?" and sees a structured Nymbus account tile — not raw text.

---

## Phase 2 — UNDERSTAND Workflow (Spending Summary)

**Estimate: 1.5 days**

| Task | Hours |
|---|---|
| Re-enable getTransactions tool with current-month date injection | 1 |
| Spending summary grouping logic (AI prompt + structured signal) | 2 |
| Nymbus transaction row component (category, amount, dividers) | 2 |
| Category totals and overall total display | 1.5 |
| Empty-state handling (no transactions this month) | 0.5 |
| Multi-account disambiguation ("which account?") | 1 |
| UAT + testing (date edge cases, category grouping accuracy) | 2.5 |
| Documentation update | 1 |

**Deliverable:** Customer asks "Where did my money go this month?" and sees a categorized spending breakdown rendered as Nymbus transaction rows.

---

## Phase 3 — Expanded Money Movement

**Estimate: 2 days**

| Task | Hours |
|---|---|
| Variable amount transfers (not just $200) via natural language | 1 |
| Reverse transfers (savings → checking) | 0.5 |
| Transfer history (list of recent transfers in session) | 2 |
| Recurring transfer intent recognition ("every Friday") | 2 |
| Amount suggestions based on available balance | 1.5 |
| Nymbus transaction history list component | 2 |
| Edge cases (decimal amounts, large amounts, currency formatting) | 2 |
| UAT + regression testing on existing transfer flow | 3 |
| Documentation update | 1.5 |

**Deliverable:** Richer transfer experience supporting varied amounts, directions, and session-level transfer history.

---

## Phase 4 — MCP Integration

**Estimate: 2 days**

| Task | Hours |
|---|---|
| MCP client implementation of IBankingService | 3 |
| Authentication layer (OAuth 2.0 token management) | 3 |
| Connection configuration and health checks | 1.5 |
| Error mapping (MCP errors → BankingServiceError) | 2 |
| Latency handling and timeout adjustments | 1 |
| Integration testing against MCP sandbox | 3 |
| Fallback behavior when MCP is unavailable | 1.5 |
| Documentation (MCP setup, auth flow, error mapping) | 1 |

**Deliverable:** MockBankingService replaced by authenticated MCP client. Same customer experience, real banking data.

---

## Phase 5 — Authentication & Multi-User

**Estimate: 2 days**

| Task | Hours |
|---|---|
| Login screen (Nymbus form components) | 2 |
| JWT session management | 2 |
| Per-user banking context (user ID → accounts) | 1.5 |
| Protected route middleware | 1 |
| Session persistence (chat history survives refresh) | 2 |
| Logout flow | 0.5 |
| Security testing (token expiry, unauthorized access) | 2.5 |
| UAT + accessibility testing on login flow | 2.5 |
| Documentation update | 1.5 |

**Deliverable:** Multiple users can log in with their own accounts and chat history.

---

## Phase 6 — Production Readiness

**Estimate: 3 days**

| Task | Hours |
|---|---|
| HTTPS / TLS configuration | 1 |
| Rate limiting (per-user, per-IP) | 2 |
| Input sanitization and validation hardening | 2 |
| Structured logging (request IDs, latency, errors) | 2 |
| Response streaming (Server-Sent Events for AI responses) | 3 |
| Database persistence (PostgreSQL for accounts, transactions, chat) | 4 |
| CI/CD pipeline (lint, type-check, test, deploy) | 2 |
| Error tracking integration (Sentry or equivalent) | 1 |
| Load testing (concurrent users) | 2 |
| Accessibility audit with screen reader | 2 |
| Security audit and penetration testing | 2 |
| Documentation (ops runbook, deployment guide) | 1 |

**Deliverable:** Production-grade deployment with persistence, monitoring, and security hardening.

---

## Summary Timeline

| Phase | Effort | Cumulative |
|---|---|---|
| Phase 1 — KNOW (Balance Inquiry) | 1 day | Day 1 |
| Phase 2 — UNDERSTAND (Spending Summary) | 1.5 days | Day 2.5 |
| Phase 3 — Expanded Money Movement | 2 days | Day 4.5 |
| Phase 4 — MCP Integration | 2 days | Day 6.5 |
| Phase 5 — Authentication & Multi-User | 2 days | Day 8.5 |
| Phase 6 — Production Readiness | 3 days | Day 11.5 |

**Total estimate: ~12 working days** from prototype to production-ready conversational banking experience with three workflows, real banking integration, and multi-user support.

---

## Assumptions

- AI-first builder team (1–2 engineers using Kiro or equivalent)
- 8-hour days with rigorous testing at each phase
- Nymbus design system components available for reference
- MCP sandbox available for Phase 4 integration testing
- No regulatory/compliance review time included (would add 2–5 days depending on institution)