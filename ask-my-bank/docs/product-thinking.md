# Product Thinking

## 1. Customer Persona

### Sarah — The Mobile-First Banking Customer

**Demographics:** 28 years old, marketing coordinator, lives in Austin, TX

**Banking behavior:**
- Checks her accounts 2–3 times per week, almost exclusively on her phone
- Moves money between checking and savings regularly (payday savings, covering expenses)
- Dislikes navigating multi-step bank forms for simple actions
- Expects instant feedback — grew up with Venmo, Zelle, Cash App

**Frustrations with traditional digital banking:**
- "Why do I need 4 taps and a dropdown to move $200 between my own accounts?"
- "I know what I want to do — I just want to say it"
- "I'm always worried I'll accidentally confirm the wrong amount"

**What she values:**
- Speed — complete the task in the fewest steps possible
- Clarity — see exactly what will happen before it happens
- Trust — explicit confirmation before any money moves
- Simplicity — no cognitive overhead for routine actions

**Technology comfort:** High. Uses AI assistants daily (Siri, ChatGPT). Comfortable with conversational interfaces but expects them to be grounded in real data, not hallucinated.

---

## 2. Customer Journey

### Transfer $200 from Checking to Savings

```
Stage           │ Customer Action            │ System Response                    │ Emotion
────────────────┼────────────────────────────┼────────────────────────────────────┼──────────────
Awareness       │ Opens AskMyBank            │ Welcome message + prompt chip      │ Curious
                │                            │                                    │
Intent          │ Types or taps:             │ AI interprets intent               │ Expectant
                │ "Move $200 from checking   │                                    │
                │  to savings"               │                                    │
                │                            │                                    │
Validation      │ (passive — system working) │ AI resolves accounts, checks       │ Waiting
                │                            │ balance ($2,450 ≥ $200 ✓)          │
                │                            │                                    │
Confirmation    │ Reviews dialog:            │ Shows source, destination,         │ Deliberate
                │ From: Checking ****-001    │ amount in structured card          │
                │ To: Savings ****-001       │                                    │
                │ Amount: $200.00            │                                    │
                │                            │                                    │
Decision        │ Clicks "Confirm Transfer"  │ Executes transfer                  │ Committed
                │  — or "Cancel"             │  — or abandons cleanly             │
                │                            │                                    │
Outcome         │ Sees success state:        │ Status: Complete                   │ Satisfied
                │ Reference, new balances    │ REF-20260819-A3K7                  │
                │                            │                                    │
Continuation    │ Can ask another question   │ Chat input remains active          │ Confident
```

### Key Moments of Truth

1. **Intent → Confirmation gap** — The time between the customer expressing intent and seeing the confirmation card. Must be fast (< 5 seconds) and must not auto-execute.

2. **Confirmation card clarity** — The customer must understand exactly what will happen. No ambiguity about source, destination, or amount.

3. **Post-execution trust** — The success state must include a reference number and updated balances so the customer can verify the action completed correctly.

---

## 3. Jobs to Be Done

### Primary JTBD (demonstrated in this prototype)

> **When I** want to move money between my own accounts,
> **I want to** describe what I need in plain language,
> **So that** I can complete the transfer without navigating forms or menus.

### Supporting JTBDs

| Job | How AskMyBank Addresses It |
|---|---|
| Verify the transfer before it executes | Explicit confirmation dialog with full details |
| Know that it actually worked | Success state with reference number and new balances |
| Cancel without consequence | Cancel button and Escape key; no balance mutation |
| Be protected from mistakes | Insufficient-funds check before confirmation is shown |
| Recover from errors | Clear error messaging; ability to retry |
| Complete the action quickly on mobile | Single-column responsive layout, 44px touch targets |

### Anti-Jobs (what the customer does NOT want)

- To fill out a form with dropdowns
- To wonder whether the transfer actually executed
- To see a generic "success" with no proof
- To have the AI move money without asking first
- To navigate away from the conversation to complete an action

---

## 4. Use Cases Covered in This Demo

### UC-1: Happy Path Transfer

**Trigger:** "Move $200 from checking to savings"

| Step | Actor | Action |
|---|---|---|
| 1 | Customer | Sends natural-language transfer request |
| 2 | AI | Calls `getAccounts` → resolves Checking (chk-001), Savings (sav-001) |
| 3 | AI | Calls `getBalance(chk-001)` → verifies $2,450 ≥ $200 |
| 4 | System | Returns `transferPending` signal to frontend |
| 5 | Frontend | Renders confirmation dialog |
| 6 | Customer | Clicks "Confirm Transfer" |
| 7 | Backend | Calls `transferBetweenAccounts` → mutates balances |
| 8 | Frontend | Renders success: Status Complete, reference, new balances |

**Outcome:** Checking $2,250 / Savings $8,400 / Reference REF-XXXXXXXX-XXXX

---

### UC-2: Cancel Before Execution

**Trigger:** Customer clicks "Cancel" or presses Escape on the confirmation dialog

| Step | Actor | Action |
|---|---|---|
| 1–5 | (same as UC-1) | Confirmation dialog appears |
| 6 | Customer | Clicks "Cancel" or presses Escape |
| 7 | Frontend | Dismisses dialog, appends "Transfer cancelled" message |
| 8 | System | No balance mutation occurs |

**Outcome:** Balances unchanged, conversation continues

---

### UC-3: Insufficient Funds

**Trigger:** "Move $999,999 from checking to savings"

| Step | Actor | Action |
|---|---|---|
| 1 | Customer | Sends transfer request exceeding balance |
| 2 | AI | Calls `getAccounts` → resolves accounts |
| 3 | AI | Calls `getBalance(chk-001)` → $2,450 < $999,999 |
| 4 | AI | Returns insufficient-funds message with available balance |
| 5 | Frontend | Renders error state (no confirmation dialog shown) |

**Outcome:** Transfer blocked, customer informed of available balance

---

### UC-4: Same-Account Transfer Blocked

**Trigger:** "Move $200 from checking to checking"

| Step | Actor | Action |
|---|---|---|
| 1 | Customer | Sends same-account transfer request |
| 2 | AI | Resolves both accounts to chk-001 |
| 3 | AI | Detects same source and destination |
| 4 | AI | Returns error message |

**Outcome:** Transfer blocked, customer informed they cannot transfer to the same account

---

### UC-5: Out-of-Scope Request

**Trigger:** "What's the weather?" or any non-transfer question

| Step | Actor | Action |
|---|---|---|
| 1 | Customer | Sends unrelated message |
| 2 | AI | Detects out-of-scope intent |
| 3 | AI | Returns scoped redirect message |

**Outcome:** Polite decline with suggestion to try a transfer

---

### UC-6: Ambiguous Request

**Trigger:** "Move some money" (no amount, no accounts specified)

| Step | Actor | Action |
|---|---|---|
| 1 | Customer | Sends incomplete transfer request |
| 2 | AI | Detects missing parameters |
| 3 | AI | Asks one clarifying question |
| 4 | Customer | Provides the missing detail |
| 5 | (continues as UC-1) | |

**Outcome:** AI resolves ambiguity conversationally before proceeding

---

## Summary

This prototype demonstrates that a single, well-executed Money Movement workflow — when designed with trust, clarity, and explicit confirmation — can serve as the foundation for a broader conversational banking experience. The architecture (MCP-ready service boundary, AI tool-calling pattern, confirmation-before-execution model) is designed to scale to additional workflows without redesigning the customer experience.