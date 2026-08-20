# Design System Usage

AskMyBank uses the **Nymbus Joy Design System** for all visual styling decisions.

## Token Mapping

### Colors
| Token | Value | Used For |
|---|---|---|
| `primary-500` | #6366F1 | User message bubbles, CTA buttons, focus rings |
| `neutral-100` | #F1F5F9 | Assistant message bubbles |
| `neutral-700` | #334155 | Primary body text |
| `neutral-900` | #0F172A | Headings, balance amounts |
| `success-500` | #22C55E | Transfer success icon |
| `error-500` | #EF4444 | Debit amounts, insufficient funds, error states |
| `error-50` | #FEF2F2 | Error alert backgrounds |

### Typography
| Role | Usage |
|---|---|
| `heading-xl` | Account balance amounts |
| `heading-lg` | Dialog titles |
| `heading-md` | App header |
| `body-md` | Message content, descriptions |
| `body-sm` | Helper text, error messages |
| `label-md` | Account name labels, alert titles |
| `label-sm` | Suggested chip buttons |

### Components
| Component | Joy Pattern |
|---|---|
| User bubble | `bg-primary-500`, white text, `radius-md` |
| Assistant bubble | `bg-neutral-100`, `neutral-700` text, `radius-md` |
| Primary button | `bg-primary-500`, hover `bg-primary-600`, `radius-md` |
| Secondary button | white bg, `primary-500` border/text |
| Input field | 40px height, `neutral-200` border, `primary-500` focus border |
| Error alert | `bg-error-50`, `error-500` left border, `role="alert"` |
| Dialog overlay | `bg-neutral-900/50` |
| Dialog container | `bg-neutral-0`, `radius-lg`, `shadow-lg` |

### ARIA Annotations
| Element | Attribute |
|---|---|
| Message list | `aria-live="polite"` |
| Send button (icon-only) | `aria-label="Send message"` |
| Confirmation dialog | `role="dialog"`, `aria-modal="true"` |
| Transfer success icon | `aria-label="Transfer successful"` |
| Error alerts | `role="alert"` |
| Loading indicators | `aria-busy="true"` |

### Responsive
- Mobile (<768px): full-width layout, fixed bottom input bar, 40px touch targets
- Desktop (≥1280px): max-width 1280px centered, 24px margins
