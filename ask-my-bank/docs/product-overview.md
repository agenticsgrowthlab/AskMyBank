# Product Overview

## What is AskMyBank?

AskMyBank is an AI-powered conversational money movement prototype. A customer uses natural language to request a transfer between accounts, and the system handles the full workflow: intent recognition, validation, explicit confirmation, execution, and success feedback.

## Scope Decision

After design review, this prototype was intentionally narrowed to a single high-confidence workflow: **Money Movement (ACT)**. Rather than demonstrating three broad workflows at shallow depth, the prototype delivers one complete, polished, end-to-end transfer experience.

The original design explored three workflows (KNOW, UNDERSTAND, ACT). The implementation focuses exclusively on ACT to demonstrate:

- Natural-language intent recognition
- Banking API/tool invocation
- Deterministic financial execution
- Explicit confirmation before transactional action
- Nymbus-style UX for the complete money movement flow

## The Workflow

> "Move $200 from checking to savings"

1. **Intent** — AI identifies source account, destination account, and amount
2. **Resolution** — AI calls `getAccounts` to resolve names to IDs
3. **Validation** — AI calls `getBalance` to verify sufficient funds
4. **Confirmation** — Frontend presents a Nymbus-style confirmation dialog
5. **Execution** — Transfer executes only after explicit customer confirmation
6. **Success** — Displays amount, accounts, reference number, and updated balances

## Design Principles

1. **Explicit confirmation** — Never auto-submit a financial transaction
2. **Trust** — Financial facts from the banking service, never AI-invented
3. **Clarity** — Clear Nymbus-style UI for confirmation and success states
4. **Accessibility** — WCAG 2.1 AA, keyboard navigation, focus management
5. **Responsive** — Mobile-first, 44px touch targets
