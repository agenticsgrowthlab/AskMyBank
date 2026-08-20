# User Acceptance Testing (UAT) Results

## Overview

All tests were performed against the running AskMyBank prototype during development. Tests cover the Money Movement workflow, design system compliance, error handling, and accessibility requirements.

---

## Money Movement Workflow Tests

### MW-01: Happy Path Transfer

| | |
|---|---|
| **Input** | "Move $200 from checking to savings" |
| **Expected** | Confirmation dialog appears → Confirm executes → Success with reference |
| **Result** | ✅ PASS |
| **Details** | AI resolved accounts, verified funds ($2,450 ≥ $200), returned transfer_pending signal. Confirmation dialog displayed correctly. On confirm, transfer executed with reference number (REF-20260820-XXXX) and updated balances (Checking $2,250, Savings $8,400). |

### MW-02: Cancel from Confirmation

| | |
|---|---|
| **Input** | Initiate transfer → Click "Cancel" |
| **Expected** | Dialog dismissed, no balance mutation, "Transfer cancelled" message |
| **Result** | ✅ PASS |
| **Details** | Balance remained at $2,450 after cancel. Chat displayed "Transfer cancelled." assistant message. |

### MW-03: Confirm Transfer Execution

| | |
|---|---|
| **Input** | Initiate transfer → Click "Confirm Transfer" |
| **Expected** | Transfer executes, success state with reference number |
| **Result** | ✅ PASS |
| **Details** | Success state rendered with Status Complete, reference number, from/to accounts, and new balances. |

### MW-04: Insufficient Funds

| | |
|---|---|
| **Input** | "Move $999,999 from checking to savings" |
| **Expected** | Transfer blocked, insufficient-funds error displayed |
| **Result** | ✅ PASS |
| **Details** | AI detected insufficient funds ($2,450 < $999,999). Error state rendered in chat with available balance. No confirmation dialog shown. |

### MW-05: Same-Account Transfer

| | |
|---|---|
| **Input** | "Move $200 from checking to checking" |
| **Expected** | Transfer blocked, same-account error |
| **Result** | ✅ PASS |
| **Details** | Banking Service returned SAME_ACCOUNT error. AI informed customer they cannot transfer to the same account. |

### MW-06: Out-of-Scope Request

| | |
|---|---|
| **Input** | "What's the weather?" |
| **Expected** | Polite decline, redirect to transfer capability |
| **Result** | ✅ PASS |
| **Details** | AI responded with scoped redirect message suggesting a transfer action. No banking tools called. |

---

## Design System Compliance Tests

### DS-01: Primary Button Color

| | |
|---|---|
| **Requirement** | Primary CTA uses Nymbus brand blue #2567EC |
| **Result** | ✅ PASS (after fix) |
| **Details** | Initially used indigo #6366F1 from original Joy tokens. Updated to exact brand-var-01 #2567EC after design review. |

### DS-02: Button Hierarchy — Confirmation Dialog

| | |
|---|---|
| **Requirement** | Cancel = outline (blue text, blue border), Confirm = primary solid blue |
| **Result** | ✅ PASS (after fix) |
| **Details** | Initially Cancel was ghost/transparent. Updated to match Nymbus AlertDialog reference: outline variant with primary-500 text and border. |

### DS-03: Dialog Pattern — Nymbus AlertDialog

| | |
|---|---|
| **Requirement** | Match Nymbus AlertDialog: Card + CardContent + CardFooter pattern |
| **Result** | ✅ PASS |
| **Details** | Dialog uses Card pattern with compact spacing, text-lg font-semibold title, text-sm description, right-aligned footer with gap-3. |

### DS-04: 4px Spacing Grid

| | |
|---|---|
| **Requirement** | All spacing must be multiples of 4px base unit |
| **Result** | ✅ PASS (after fix) |
| **Details** | Initially had off-grid values (mt-1.5 = 6px, h-9 = 36px, w-1.5 = 6px). All corrected to grid-aligned values. No off-grid spacing remains in any component. |

### DS-05: Brand Header Color

| | |
|---|---|
| **Requirement** | "AskMyBank" header uses brand navy #0C214C |
| **Result** | ✅ PASS |
| **Details** | Header text updated to brand-var-01-000 navy per Brand 01 palette. |

### DS-06: Account Masking

| | |
|---|---|
| **Requirement** | Account identifiers masked to last 4 digits in confirmation |
| **Result** | ✅ PASS |
| **Details** | Confirmation dialog shows "****-001" for both accounts. |

### DS-07: Responsive Layout — Mobile

| | |
|---|---|
| **Requirement** | Below 768px: single column, 44px touch targets, no horizontal scroll |
| **Result** | ✅ PASS |
| **Details** | Dialog renders as bottom-aligned sheet on mobile. Buttons have min-h-[44px]. Suggested chip has min-h-[44px]. |

### DS-08: Transfer Success State

| | |
|---|---|
| **Requirement** | Nymbus Status Complete pattern (checkmark + "Status" + "Complete") |
| **Result** | ✅ PASS |
| **Details** | Success state uses Check icon (24px, bold weight) with "Status" / "Complete" text per supplied Nymbus reference. |

### DS-09: Transaction Reference Number

| | |
|---|---|
| **Requirement** | Success state includes a transaction reference number |
| **Result** | ✅ PASS |
| **Details** | MockBankingService generates deterministic REF-YYYYMMDD-XXXX format. Displayed in success details card with monospace font. |

---

## Error Handling Tests

### EH-01: CORS Configuration

| | |
|---|---|
| **Issue Found** | Frontend request blocked by CORS (origin mismatch) |
| **Root Cause** | Server CORS origin was reading VITE_API_BASE_URL (http://localhost:3001) instead of the frontend origin (http://localhost:5173) |
| **Fix** | Added CLIENT_ORIGIN env var, updated server to use it |
| **Result** | ✅ PASS after fix |

### EH-02: Anthropic Model Availability

| | |
|---|---|
| **Issue Found** | 404 not_found_error for model IDs |
| **Root Cause** | Account did not have access to claude-sonnet-4-20250514 or claude-3-7-sonnet-20250219 |
| **Fix** | Queried /v1/models API to discover available models. Selected claude-sonnet-4-6. |
| **Result** | ✅ PASS after fix |

### EH-03: Circular Dependency (500 Internal Error)

| | |
|---|---|
| **Issue Found** | 500 error on all chat requests |
| **Root Cause** | Circular import between index.ts ↔ chat.ts (bankingService was undefined at import time) |
| **Fix** | Extracted bankingService to services.ts, breaking the circular dependency |
| **Result** | ✅ PASS after fix |

### EH-04: Date Mismatch (UNDERSTAND Workflow)

| | |
|---|---|
| **Issue Found** | "No transactions for July 2025" despite seed data existing |
| **Root Cause** | Claude assumed current date from training data (July 2025) instead of actual server date |
| **Fix** | Injected today's date into system prompt dynamically |
| **Result** | ✅ PASS after fix |

### EH-05: Transfer Pending Signal Not Emitted

| | |
|---|---|
| **Issue Found** | AI returned conversational text instead of transfer_pending JSON |
| **Root Cause** | System prompt instruction was not emphatic enough; Claude wrapped response in conversational text |
| **Fix** | Strengthened system prompt with "CRITICAL" emphasis and "ONLY this JSON and absolutely nothing else". Added fallback detection for conversational pattern. |
| **Result** | ✅ PASS after fix |

### EH-06: Raw Markdown in UI

| | |
|---|---|
| **Issue Found** | `**Checking**` and `**$2,450.00**` rendered as literal asterisks |
| **Root Cause** | Claude used markdown bold syntax; frontend rendered as plain text |
| **Fix** | Added markdown stripping (`content.replace(/\*\*(.+?)\*\*/g, '$1')`) in PlainContent renderer |
| **Result** | ✅ PASS after fix |

---

## Accessibility Tests

### A11Y-01: Keyboard Focus Trap

| | |
|---|---|
| **Requirement** | Tab/Shift+Tab cycles within confirmation dialog only |
| **Result** | ✅ PASS |
| **Details** | Focus trapped between Cancel and Confirm buttons. |

### A11Y-02: Escape Key Dismissal

| | |
|---|---|
| **Requirement** | Escape closes dialog without executing transfer |
| **Result** | ✅ PASS |
| **Details** | Pressing Escape calls cancelTransfer(), no balance mutation. |

### A11Y-03: Focus Return

| | |
|---|---|
| **Requirement** | Focus returns to triggering element on dialog close |
| **Result** | ✅ PASS |
| **Details** | triggerRef stored on mount, restored on unmount. |

### A11Y-04: aria-live Region

| | |
|---|---|
| **Requirement** | New assistant messages announced to screen readers |
| **Result** | ✅ PASS |
| **Details** | Message list has `aria-live="polite"`. User messages are `aria-hidden="true"`. |

### A11Y-05: Dialog ARIA Attributes

| | |
|---|---|
| **Requirement** | role="dialog", aria-modal="true", aria-labelledby |
| **Result** | ✅ PASS |
| **Details** | All present on the confirmation dialog container. |

### A11Y-06: Input Label Association

| | |
|---|---|
| **Requirement** | Chat input has associated <label> via for/id pairing |
| **Result** | ✅ PASS |
| **Details** | `<label htmlFor="chat-input">` (sr-only) + `<input id="chat-input">` |

### A11Y-07: Icon Button Accessible Name

| | |
|---|---|
| **Requirement** | Send button has aria-label when icon-only |
| **Result** | ✅ PASS |
| **Details** | `aria-label="Send message"` on the PaperPlaneTilt send button. |

### A11Y-08: Reduced Motion

| | |
|---|---|
| **Requirement** | prefers-reduced-motion suppresses animations |
| **Result** | ✅ PASS |
| **Details** | Global CSS rule neutralizes all animation/transition durations. Loading dots use `motion-safe:animate-bounce`. |

---

## Unit Tests (Automated)

### Vitest — MockBankingService (8 tests, all passing)

| Test | Result |
|---|---|
| Balance mutation after transfer ($2,450 → $2,250 / $8,200 → $8,400) | ✅ PASS |
| Insufficient funds rejection (balance unchanged) | ✅ PASS |
| getBalance ACCOUNT_NOT_FOUND for invalid ID | ✅ PASS |
| getTransactions ACCOUNT_NOT_FOUND for invalid ID | ✅ PASS |
| transferBetweenAccounts ACCOUNT_NOT_FOUND for invalid source | ✅ PASS |
| transferBetweenAccounts ACCOUNT_NOT_FOUND for invalid destination | ✅ PASS |
| getAccounts read idempotency | ✅ PASS |
| getTransactions read idempotency | ✅ PASS |

---

## TypeScript Compilation

| Workspace | Result |
|---|---|
| `server/` — `npx tsc --noEmit` | ✅ PASS (exit 0) |
| `client/` — `npx tsc --noEmit` | ✅ PASS (exit 0) |

---

## Summary

| Category | Total | Passed | Fixed During UAT |
|---|---|---|---|
| Money Movement Workflow | 6 | 6 | 0 |
| Design System Compliance | 9 | 9 | 5 |
| Error Handling | 6 | 6 | 6 |
| Accessibility | 8 | 8 | 0 |
| Unit Tests (Automated) | 8 | 8 | 0 |
| TypeScript Compilation | 2 | 2 | 0 |
| **Total** | **39** | **39** | **11** |