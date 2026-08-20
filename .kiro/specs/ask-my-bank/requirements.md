# Requirements Document

## Introduction

AskMyBank is an AI-powered conversational digital banking prototype. The system lets customers interact with their banking data through a natural-language chat interface, supporting three core workflows: knowing their balance (KNOW), understanding their spending (UNDERSTAND), and moving money between accounts (ACT). The MVP is intentionally scoped for a three-hour build: a polished, trustworthy experience that demonstrates customer workflows, digital banking UX, API/tool behavior, and documentation quality. All banking data is mocked; no real banking core or authentication is required.

---

## Glossary

- **Chat_Interface**: The conversational UI through which the customer sends messages and receives responses.
- **AI_Layer**: The component responsible for interpreting customer intent and composing responses from verified banking data.
- **Banking_Service**: The mocked tool boundary that exposes `getAccounts`, `getBalance`, `getTransactions`, and `transferBetweenAccounts`. Designed to be replaceable by authenticated MCP-compatible banking capabilities without changing the customer experience.
- **Customer**: The end user of the AskMyBank prototype.
- **Transfer_Flow**: The three-step process (intent → confirmation → result) for moving funds between accounts.
- **Confirmation_Dialog**: The modal or inline UI element that presents transfer details and requires explicit customer action before execution.
- **Seed_Data**: The static, deterministic mocked dataset of accounts, balances, and transactions loaded at application start.
- **Spending_Summary**: An AI-derived, human-readable explanation of a customer's transactions for a given time period, based solely on verified transaction data from the Banking_Service.
- **Insufficient_Funds**: The state where the transfer amount exceeds the available balance of the source account.

---

## Requirements

---

### REQ-001: Session Initialization

**User Story:** As a Customer, I want the application to load with my accounts and a ready chat interface, so that I can immediately ask questions about my finances.

#### Acceptance Criteria

1. WHEN the application loads, THE Banking_Service SHALL initialize Seed_Data containing exactly two accounts: one Checking account and one Savings account, each with a distinct non-zero balance and enough transactions to demonstrate the KNOW, UNDERSTAND, and ACT workflows — specifically: at least one transaction per account to support a balance inquiry, at least three categorized debit transactions in the Checking account within the current calendar month to support a meaningful spending summary, and a Checking account balance sufficient to support a $200 transfer to Savings.
2. WHEN the application loads, THE Chat_Interface SHALL display a welcome message of no more than 160 characters and at least two suggested prompt chips (e.g., "What's my balance?" and "Where did my money go this month?"), each chip rendered as a secondary small button with a label of no more than 60 characters.
3. WHEN the application loads, THE Chat_Interface SHALL be in a ready state within 2 seconds, where "ready state" means the welcome message is visible, suggested prompt chips are interactive, and the text input field accepts keyboard input.
4. IF the Banking_Service fails to initialize Seed_Data within 2 seconds of application load, THEN THE Chat_Interface SHALL display an error alert indicating data is unavailable, disable the text input field and all suggested prompt chips, and re-enable them automatically once Seed_Data becomes available.

---

### REQ-002: Chat Interaction Model

**User Story:** As a Customer, I want to send natural-language messages and receive clear, grounded responses, so that I can understand and manage my finances conversationally.

#### Acceptance Criteria

1. WHEN the Customer submits a message, THE Chat_Interface SHALL display the Customer's message right-aligned in a user bubble styled with `bg-primary-500` and white text, and the AI_Layer's response left-aligned in an assistant bubble styled with `bg-neutral-100` and `neutral-700` text, both using `radius-md` corners and `body-md` font size.
2. WHEN the AI_Layer is processing a Customer message, THE Chat_Interface SHALL display an animated loading indicator within the assistant bubble area, disable the send button, and preserve the send button's dimensions during the disabled state.
3. WHEN the AI_Layer composes a response, THE AI_Layer SHALL base all financial facts (balances, transactions, transfer outcomes) exclusively on data returned by the Banking_Service within the same session.
4. THE AI_Layer SHALL NOT fabricate, estimate, or invent account balances, transaction records, or transfer outcomes; IF the Banking_Service returns no data or an error for a requested financial fact, THEN THE AI_Layer SHALL respond with a message indicating the information is unavailable rather than generating an estimated or placeholder value.
5. WHEN the Customer submits a message containing only whitespace or zero non-whitespace characters, THE Chat_Interface SHALL NOT send the message, SHALL NOT trigger the loading state, and SHALL return focus to the input field.
6. WHEN the Customer selects a suggested prompt chip, THE Chat_Interface SHALL populate the input field with that chip's prompt text, immediately submit it as a Customer message, and display it in the conversation as a standard user bubble per criterion 1.
7. WHEN the AI_Layer fails to receive a response from the Banking_Service within 30 seconds, THE Chat_Interface SHALL dismiss the loading indicator and display an error alert with `error-50` background and `error-500` left border indicating the request could not be completed, and SHALL re-enable the send button.
8. THE Chat_Interface SHALL apply `aria-live="polite"` to the message list container so that new assistant bubbles and loading state changes are announced to assistive technologies.

---

### REQ-003: Balance Inquiry (KNOW)

**User Story:** As a Customer, I want to ask about my account balances in natural language, so that I can quickly understand my financial position.

#### Acceptance Criteria

1. WHEN the Customer asks for an account balance (e.g., "What is my checking balance?"), THE AI_Layer SHALL call `getBalance` on the Banking_Service and present the returned balance amount and account name in the Chat_Interface response within 3 seconds of the request.
2. WHEN the Banking_Service returns a balance, THE Chat_Interface SHALL render the amount using `heading-xl` typography in `neutral-900` for positive or zero balances, and in `error-500` for negative balances, preceded by the account name in `label-md` `neutral-600`.
3. WHEN the Customer asks for balances without specifying an account, THE AI_Layer SHALL call `getAccounts` on the Banking_Service and present balances for all returned accounts, each displayed as a separate balance entry in the response.
4. IF the Banking_Service returns an error for a balance request, THEN THE Chat_Interface SHALL display an error message within the assistant bubble indicating the balance could not be retrieved, and the assistant bubble SHALL remain visible until the Customer sends a new message.
5. IF the Banking_Service does not return a response to a `getBalance` or `getAccounts` call within 10 seconds, THEN THE AI_Layer SHALL treat the request as failed and THE Chat_Interface SHALL display an error message within the assistant bubble indicating the service is unavailable.
6. IF the `getAccounts` call returns zero accounts, THEN THE Chat_Interface SHALL display a message within the assistant bubble indicating no accounts were found for the Customer.

---

### REQ-004: Spending Summary (UNDERSTAND)

**User Story:** As a Customer, I want to ask where my money went this month, so that I can understand my spending patterns.

#### Acceptance Criteria

1. WHEN the Customer asks a spending question (e.g., "Where did my money go this month?"), THE AI_Layer SHALL call `getTransactions` on the Banking_Service for the relevant account and the current calendar month (1st of the month to the current date) as the default time range.
2. WHEN the Banking_Service returns transactions, THE AI_Layer SHALL derive a Spending_Summary by grouping all debit transactions by category or merchant and presenting totals, without inventing, modifying, or omitting any transaction record returned by the Banking_Service.
3. WHEN presenting the Spending_Summary, THE Chat_Interface SHALL render each line item as a transaction-style row with description in `body-md` `neutral-700`, amount in `error-500` for debits, and a `neutral-100` 1px bottom divider between rows.
4. WHEN the Banking_Service returns zero transactions for the requested period, THE AI_Layer SHALL display a message within the assistant bubble informing the Customer that no transactions were found for that period.
5. IF the Banking_Service returns an error for a transaction request, THEN THE AI_Layer SHALL surface the error to THE Chat_Interface and THE Chat_Interface SHALL display an error alert with `error-50` background and `error-500` left border within the assistant bubble, without removing any previously displayed Spending_Summary.
6. IF the Customer holds more than one account and does not specify an account in their spending question, THEN THE AI_Layer SHALL ask the Customer which account to summarize before calling `getTransactions`.

---

### REQ-005: Transfer — Intent Recognition

**User Story:** As a Customer, I want to describe a transfer in natural language, so that the system can identify the accounts and amount without requiring a form.

#### Acceptance Criteria

1. WHEN the Customer expresses a transfer intent (e.g., "Move $200 from checking to savings"), THE AI_Layer SHALL extract the source account, destination account, and amount from the message, where the amount must be a positive value between 0.01 and 999,999,999.99.
2. WHEN the AI_Layer extracts transfer parameters, THE AI_Layer SHALL call `getBalance` on the Banking_Service to verify the source account balance is greater than or equal to the extracted amount before presenting the Confirmation_Dialog.
3. WHEN the extracted transfer parameters are ambiguous or incomplete (e.g., no destination account specified), THE AI_Layer SHALL ask the Customer a single targeted clarifying question within the chat before proceeding, addressing one missing or ambiguous parameter at a time.
4. IF the extracted amount is not a positive number between 0.01 and 999,999,999.99, THEN THE AI_Layer SHALL display an inline error message within the chat indicating the amount is invalid and prompt the Customer to provide a valid amount, without discarding previously extracted parameters.
5. IF the Banking_Service does not return a balance response within 5 seconds of the `getBalance` call, THEN THE AI_Layer SHALL display an error message within the chat indicating the balance check could not be completed and prompt the Customer to try again.

---

### REQ-006: Transfer — Confirmation

**User Story:** As a Customer, I want to see a clear summary of my transfer before it executes, so that I can verify the details and prevent mistakes.

#### Acceptance Criteria

1. WHEN the source account, destination account, and amount are all resolved and funds are sufficient, THE Chat_Interface SHALL present a Confirmation_Dialog showing: source account name, destination account name, and transfer amount before calling `transferBetweenAccounts`.
2. THE Confirmation_Dialog SHALL contain a "Confirm Transfer" primary button and a "Cancel" secondary button.
3. WHEN the Customer activates "Cancel", THE Transfer_Flow SHALL be abandoned, THE Banking_Service SHALL NOT be called, and THE Chat_Interface SHALL display an assistant message in the chat indicating the transfer was cancelled.
4. THE Banking_Service `transferBetweenAccounts` tool SHALL NOT be called until the Customer activates "Confirm Transfer".
5. WHEN the Customer activates "Confirm Transfer", THE Chat_Interface SHALL disable the "Confirm Transfer" button and display a loading indicator on it until a response is received from the Banking_Service.
6. IF the Banking_Service returns an error after the Customer confirms, THEN THE Chat_Interface SHALL display an error alert within the dialog and preserve the transfer parameters so the Customer can retry without re-entering details.

---

### REQ-007: Transfer — Execution and Result

**User Story:** As a Customer, I want immediate, unambiguous feedback after confirming a transfer, so that I know whether it succeeded or failed.

#### Acceptance Criteria

1. WHEN the Customer confirms a transfer, THE AI_Layer SHALL call `transferBetweenAccounts` on the Banking_Service with the resolved source account, destination account, and amount.
2. WHEN the Banking_Service returns a success response, THE Chat_Interface SHALL display a success state containing a `CheckCircle` icon at 48px in `success-500`, a confirmation message including the transferred amount and destination account name, and a "Back to Accounts" button that dismisses the Transfer_Flow.
3. WHEN the Banking_Service returns a success response, THE Banking_Service Seed_Data SHALL reflect updated balances for both the source account (decreased by the transferred amount) and the destination account (increased by the transferred amount).
4. IF the Banking_Service returns an error during transfer execution, THEN THE Chat_Interface SHALL display an inline error alert with `error-50` background and 4px `error-500` left border containing a message indicating the transfer failed, and SHALL offer the Customer a retry button and a cancel button.
5. IF the Banking_Service does not return a response within 10 seconds of the `transferBetweenAccounts` call, THEN THE AI_Layer SHALL treat the absence of response as an error and THE Chat_Interface SHALL display an error alert indicating the transfer could not be completed, with a retry button and a cancel button.
6. IF the Customer selects retry from the error state, THEN THE Chat_Interface SHALL re-submit the same transfer parameters to the Banking_Service without requiring the Customer to re-enter any details, and SHALL display a loading state on the retry button until a response is received.

---

### REQ-008: Insufficient Funds

**User Story:** As a Customer, I want to be clearly informed when a transfer cannot proceed due to insufficient funds, so that I can adjust the amount or choose a different account.

#### Acceptance Criteria

1. WHEN the source account balance is less than the requested transfer amount, THE Chat_Interface SHALL display an inline alert with `error-50` background and `error-500` 2px left border, containing the label "Insufficient funds" in `label-md` `error-500` and a body message in `body-sm` `neutral-700` stating the available balance, before any Confirmation_Dialog is presented.
2. WHEN an Insufficient_Funds state is detected, THE Transfer_Flow SHALL NOT proceed to the Confirmation_Dialog.
3. WHEN an Insufficient_Funds state is presented, THE AI_Layer SHALL inform the Customer of the available balance in the source account expressed as a currency amount formatted with a leading `$` and two decimal places, and SHALL suggest either reducing the requested transfer amount or selecting a different source account.
4. IF the Customer submits a transfer amount less than 0.01, THEN THE Transfer_Flow SHALL treat the input as invalid and display an inline error message indicating a valid transfer must be at least $0.01, before evaluating the source account balance.
5. IF the source account balance cannot be retrieved at the time of transfer submission, THEN THE Chat_Interface SHALL display an info alert with `info-50` background and `info-500` 2px left border indicating that the balance is temporarily unavailable, and THE Transfer_Flow SHALL NOT proceed to the Confirmation_Dialog.

---

### REQ-009: Mocked Data and Tool Boundary

**User Story:** As a developer, I want all banking operations to pass through a defined Banking_Service interface with inspectable request/response contracts, so that the mocked implementation can be demonstrated, documented, and later replaced with a real MCP-compatible service without changing the customer experience.

#### Acceptance Criteria

1. THE Banking_Service SHALL expose exactly four operations: `getAccounts`, `getBalance`, `getTransactions`, and `transferBetweenAccounts`.

2. THE AI_Layer SHALL interact with banking data exclusively through the Banking_Service interface and SHALL NOT access Seed_Data directly.

3. THE Banking_Service `getAccounts` operation SHALL accept no parameters and SHALL return a list of accounts each containing: `accountId` (string), `name` (string), `type` ("checking" | "savings"), `balance` (number, two decimal places), `currency` (ISO 4217 string). Representative contract:
   - Request: `getAccounts()`
   - Response: `[{ accountId: "chk-001", name: "Checking", type: "checking", balance: 2450.00, currency: "USD" }, { accountId: "sav-001", name: "Savings", type: "savings", balance: 8200.00, currency: "USD" }]`

4. THE Banking_Service `getBalance` operation SHALL accept `accountId` (string, required) and SHALL return: `accountId` (string), `name` (string), `balance` (number, two decimal places), `currency` (ISO 4217 string). Representative contract:
   - Request: `getBalance({ accountId: "chk-001" })`
   - Response: `{ accountId: "chk-001", name: "Checking", balance: 2450.00, currency: "USD" }`
   - Error response: `{ error: "ACCOUNT_NOT_FOUND", message: "No account found for id: chk-001" }`

5. THE Banking_Service `getTransactions` operation SHALL accept `accountId` (string, required), `startDate` (ISO 8601 string, optional), `endDate` (ISO 8601 string, optional) and SHALL return a list of transactions each containing: `transactionId` (string), `date` (ISO 8601 string), `description` (string, max 255 chars), `amount` (number, two decimal places), `direction` ("credit" | "debit"), `category` (string). Representative contract:
   - Request: `getTransactions({ accountId: "chk-001", startDate: "2026-08-01", endDate: "2026-08-19" })`
   - Response: `[{ transactionId: "txn-001", date: "2026-08-15", description: "Whole Foods Market", amount: 67.42, direction: "debit", category: "Groceries" }, ...]`
   - Error response: `{ error: "ACCOUNT_NOT_FOUND", message: "No account found for id: chk-001" }`

6. THE Banking_Service `transferBetweenAccounts` operation SHALL accept `fromAccountId` (string, required), `toAccountId` (string, required), `amount` (number, required, 0.01–999999999.99) and SHALL return on success: `transactionId` (string), `fromAccountId`, `toAccountId`, `amount`, `fromNewBalance` (number), `toNewBalance` (number), `timestamp` (ISO 8601 string). Representative contract:
   - Request: `transferBetweenAccounts({ fromAccountId: "chk-001", toAccountId: "sav-001", amount: 200.00 })`
   - Success response: `{ transactionId: "txn-042", fromAccountId: "chk-001", toAccountId: "sav-001", amount: 200.00, fromNewBalance: 2250.00, toNewBalance: 8400.00, timestamp: "2026-08-19T14:32:00Z" }`
   - Error response (insufficient funds): `{ error: "INSUFFICIENT_FUNDS", message: "Insufficient funds: available $2450.00, requested $200.00" }`
   - Error response (account not found): `{ error: "ACCOUNT_NOT_FOUND", message: "No account found for id: chk-001" }`

7. WHEN `transferBetweenAccounts` is called successfully, THE Banking_Service SHALL update the in-memory balances of both accounts within the Seed_Data so that subsequent `getBalance` calls reflect the transferred amount.

8. IF any operation is called with an `accountId` that does not exist in the Seed_Data, THEN THE Banking_Service SHALL return `{ error: "ACCOUNT_NOT_FOUND", message: "..." }` without modifying any data.

9. IF `transferBetweenAccounts` is called with an amount exceeding the source account's current balance, THEN THE Banking_Service SHALL return `{ error: "INSUFFICIENT_FUNDS", message: "..." }` and SHALL NOT modify either account's balance.

10. THE Banking_Service interface SHALL be implemented as a module with a stable function signature for each operation so that the mock implementation can be replaced by an authenticated MCP-compatible implementation by swapping the module without modifying the AI_Layer or Chat_Interface.

---

### REQ-010: Loading and Error States

**User Story:** As a Customer, I want clear visual feedback during loading and when errors occur, so that I always understand the state of the application.

#### Acceptance Criteria

1. WHILE the AI_Layer awaits a Banking_Service response, THE Chat_Interface SHALL display an animated loading indicator (three pulsing dots in `neutral-400`) in the assistant bubble area.
2. WHILE any Banking_Service call is in progress, THE Chat_Interface SHALL disable the message input and send button, styled with `neutral-200` background and `neutral-400` text per Joy disabled state tokens, to prevent duplicate submissions.
3. IF a Banking_Service call does not return within 10 seconds, THEN THE Chat_Interface SHALL remove the loading indicator, display a timeout error message within the assistant bubble, and re-enable the message input and send button.
4. IF an unhandled error occurs in the AI_Layer, THEN THE Chat_Interface SHALL display a generic error message within the assistant bubble without exposing internal error details to the Customer.
5. IF a Banking_Service call fails with a non-timeout error (e.g., network error or server error) before the 10-second threshold, THEN THE Chat_Interface SHALL remove the loading indicator, display an error message within the assistant bubble, and re-enable the message input and send button.

---

### REQ-011: Accessibility

**User Story:** As a Customer using assistive technology, I want the chat interface to be fully accessible, so that I can complete all banking workflows with a keyboard or screen reader.

#### Acceptance Criteria

1. THE Chat_Interface message list SHALL include `aria-live="polite"` so that screen readers announce new assistant messages, and SHALL NOT announce messages authored by the Customer.
2. IF the Chat_Interface send button contains only an icon and no visible text label, THEN THE Chat_Interface SHALL set `aria-label="Send message"` on that button.
3. WHEN the Confirmation_Dialog is open, THE Chat_Interface SHALL trap keyboard focus within the dialog and SHALL return focus to the element that triggered the dialog when the dialog closes.
4. WHEN the Confirmation_Dialog is open and the Customer presses the Escape key, THE Chat_Interface SHALL close the dialog without submitting any transfer action and SHALL return focus to the element that triggered the dialog.
5. THE Chat_Interface input field SHALL have an associated `<label>` element that is programmatically linked to the input via a matching `for`/`id` attribute pair.
6. ALL interactive elements in THE Chat_Interface SHALL be reachable via Tab and Shift+Tab keyboard navigation in a logical sequence, and SHALL be activatable using the Enter or Space key without requiring a pointer device.
7. THE Chat_Interface SHALL meet WCAG 2.1 AA color contrast ratios: 4.5:1 for body text and 3:1 for large text and UI components.
8. WHERE the Customer has `prefers-reduced-motion` enabled, THE Chat_Interface SHALL not play decorative animations.

---

### REQ-012: Responsive Layout

**User Story:** As a Customer using a mobile device or desktop browser, I want the interface to adapt to my screen size, so that the experience is usable and legible on any device.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768px, THE Chat_Interface SHALL render in a single-column full-width layout with the input bar fixed to the bottom of the viewport and all interactive touch targets at a minimum height of 40px.
2. WHILE the viewport width is less than 768px, THE Chat_Interface primary action buttons SHALL render at 100% of the available content width.
3. WHILE the viewport width is between 768px and 1279px inclusive, THE Chat_Interface SHALL render in a single-column layout with 8-column grid, 20px gutters, following the Joy tablet breakpoint.
4. WHILE the viewport width is 1280px or greater, THE Chat_Interface SHALL constrain content to a maximum width of 1280px, centered horizontally, using a 12-column grid with 24px gutters and 24px margins.
5. THE Chat_Interface SHALL use exclusively the Nymbus Joy Design System token set for spacing, color, typography, border radius, and elevation, and SHALL NOT use any hardcoded values outside the defined token set.
