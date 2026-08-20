---
inclusion: always
---

# Nymbus Joy Design System — Steering Reference

> Condensed from PDF review. Details marked [UNVERIFIED] have not been confirmed
> against source PDFs and must be validated before use in production.
> Do not invent Joy standards not listed here.

---

## Color Tokens

### Primary
| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#EEF2FF` | Hover backgrounds, light tints |
| `primary-100` | `#E0E7FF` | Subtle tints |
| `primary-500` | `#6366F1` | Primary interactive, CTA buttons |
| `primary-600` | `#4F46E5` | Button hover |
| `primary-700` | `#4338CA` | Pressed / active |

### Neutral
| Token | Hex | Usage |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Card / page background |
| `neutral-50` | `#F8FAFC` | App background |
| `neutral-100` | `#F1F5F9` | Subtle fills |
| `neutral-200` | `#E2E8F0` | Borders, dividers |
| `neutral-400` | `#94A3B8` | Placeholder, disabled text |
| `neutral-600` | `#475569` | Secondary body text |
| `neutral-700` | `#334155` | Primary body text |
| `neutral-900` | `#0F172A` | Headings, high-contrast |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `success-50` | `#F0FDF4` | Success alert background |
| `success-500` | `#22C55E` | Positive amounts, success states |
| `warning-50` | `#FFFBEB` | Warning alert background |
| `warning-500` | `#F59E0B` | Warning states |
| `error-50` | `#FEF2F2` | Error alert background |
| `error-500` | `#EF4444` | Errors, negative amounts, destructive |
| `info-50` | `#EFF6FF` | Info alert background |
| `info-500` | `#3B82F6` | Informational |

---

## Typography

- **Font family**: Inter (sans-serif)

| Role | Size | Weight | Line Height |
|---|---|---|---|
| `heading-2xl` | 30px / 1.875rem | 700 | 1.2 |
| `heading-xl` | 24px / 1.5rem | 700 | 1.2 |
| `heading-lg` | 20px / 1.25rem | 600 | 1.3 |
| `heading-md` | 16px / 1rem | 600 | 1.4 |
| `body-lg` | 16px / 1rem | 400 | 1.5 |
| `body-md` | 14px / 0.875rem | 400 | 1.5 |
| `body-sm` | 12px / 0.75rem | 400 | 1.5 |
| `label-md` | 14px / 0.875rem | 500 | 1.4 |
| `label-sm` | 12px / 0.75rem | 500 | 1.4 |

**Rules**
- Left-align body copy; center only for modal titles and empty states
- No more than 2 type weights per screen
- Currency amounts: `heading-xl` or larger; negative → `error-500`, neutral → `neutral-700`

---

## Spacing (4px base grid)

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

---

## Layout Grid

| Breakpoint | Columns | Gutters | Margins | Max-width |
|---|---|---|---|---|
| Mobile (<768px) | 4 | 16px | 16px | — |
| Tablet (768–1279px) | 8 | 20px | — | — |
| Desktop (≥1280px) | 12 | 24px | 24px | 1280px |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Inputs, tags |
| `radius-md` | 8px | Cards, modals, buttons |
| `radius-lg` | 12px | Large cards, panels |
| `radius-xl` | 16px | Sheets, bottom drawers |
| `radius-full` | 9999px | Badges, avatars, pills |

---

## Elevation / Shadow

| Token | Usage |
|---|---|
| `shadow-sm` | Subtle card lift |
| `shadow-md` | Modals, dropdowns |
| `shadow-lg` | Overlays, drawers |

> Exact shadow values [UNVERIFIED] — confirm from `foundations.pdf` before finalizing.

---

## Buttons

### Variants
| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `primary` | `primary-500` | white | none | Primary CTA |
| `secondary` | white | `primary-500` | `primary-500` 1px | Secondary action |
| `ghost` | transparent | `primary-500` | none | Tertiary / inline |
| `danger` | `error-500` | white | none | Destructive |
| `link` | none | `primary-500` | none | Inline text actions |

### Sizes
| Size | Height | Horizontal padding | Font |
|---|---|---|---|
| `sm` | 32px | 12px | `label-sm` |
| `md` | 40px | 16px | `label-md` |
| `lg` | 48px | 20px | `label-md` |

### States
- Hover: darken 10% on solid; lighten background on ghost/secondary
- Focus: 2px `primary-500` outline, 2px offset
- Disabled: `neutral-200` bg, `neutral-400` text, `not-allowed` cursor
- Loading: spinner visible, interaction disabled, button width preserved

**Rules**: one primary button per view; icon + label → icon left, 8px gap; full-width on mobile forms.

---

## Form Inputs

- Label: `label-md`, `neutral-700`, above field, 4px gap
- Field height: 40px; border: `neutral-200` 1px; radius: `radius-sm`; text: `body-md` `neutral-900`
- Placeholder: `neutral-400`
- Helper text: `body-sm` `neutral-600`
- Error text: `body-sm` `error-500` (replaces helper)

### States
| State | Border |
|---|---|
| Default | `neutral-200` 1px |
| Focus | `primary-500` 2px |
| Error | `error-500` 2px |
| Disabled | `neutral-100` bg, `neutral-400` text |

### Currency Input
- Leading `$`, `neutral-600`; amount text `heading-xl`; value right-aligned

---

## Cards

### Standard Card
- bg `neutral-0`; border 1px `neutral-200` OR `shadow-sm` (not both)
- radius `radius-md` or `radius-lg`; padding `space-6` (compact: `space-4`)

### Account Card
- Name: `heading-md` `neutral-700`
- Masked number: `body-sm` `neutral-400`
- Balance label: `label-sm` `neutral-600`
- Balance amount: `heading-xl` / `heading-2xl` `neutral-900`
- Primary account may use `primary-50` tint background

### Transaction List Item
- Layout: icon | description + date | amount
- Description: `body-md` `neutral-700`; Date: `body-sm` `neutral-400`
- Credit: `success-500`; Debit: `error-500`
- Row divider: 1px `neutral-100`

---

## Navigation

### Mobile Bottom Nav
- 4–5 items max
- Active: `primary-500` icon + label; Inactive: `neutral-400`
- bg `neutral-0`, top border `neutral-200`
- Icon 24px; label `label-sm`; respects iOS safe area

### Desktop Top Bar
- Height 64px; bg `neutral-0`
- Logo left; user avatar/menu right
- Active link: `primary-500` left border (4px) or filled pill [UNVERIFIED — exact pattern]

---

## Alerts & Status

### Alert / Banner
| Type | Background | Icon color | Left border |
|---|---|---|---|
| Success | `success-50` | `success-500` | 4px `success-500` |
| Warning | `warning-50` | `warning-500` | 4px `warning-500` |
| Error | `error-50` | `error-500` | 4px `error-500` |
| Info | `info-50` | `info-500` | 4px `info-500` |

- Padding `space-4`; radius `radius-md`
- Title: `label-md` in semantic color; Body: `body-sm` `neutral-700`
- Dismiss: `×` icon button, right-aligned

### Toast / Snackbar
- Position: bottom-center mobile; top-right desktop
- Auto-dismiss: 4–5 seconds; max-width 380px

---

## Modal / Dialog

- Overlay: `neutral-900` 50% opacity
- Container: `neutral-0`, `radius-lg`, `shadow-lg`
- Header: `heading-lg` title + close button top-right
- Body: `body-md` `neutral-700`, `space-6` padding
- Footer: secondary button left, primary button right
- Max-width: 480px (small), 640px (standard)
- Mobile: full-width bottom sheet, `radius-xl` top corners

### Confirmation Pattern
- Shows: from/to, amount, date
- Footer: "Cancel" (secondary/ghost) + "Confirm" (primary)
- Success state: success icon + message + single "Done" button

---

## Icons

- Library: **Phosphor Icons** (`@phosphor-icons/react`)
- Weight: `Regular` for UI; `Bold` for emphasis
- Sizes: 16px inline, 20px buttons, 24px nav/actions, 32px feature
- Color: `currentColor`
- Standalone icons require `aria-label`

---

## Accessibility (WCAG 2.1 AA)

- Contrast: 4.5:1 body text; 3:1 large text / UI components
- All interactive elements keyboard-reachable
- Focus ring: 2px `primary-500` outline, 2px offset — never remove without replacement
- Focus trap inside open modals; Escape closes; focus returns to trigger
- Skip-to-content link on desktop
- Semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`, `<h1>`–`<h3>`
- Form inputs require associated `<label>`
- `aria-live` for dynamic content (chat messages, balance updates, alerts)
- `aria-expanded` / `aria-controls` on accordion/dropdown triggers
- Respect `prefers-reduced-motion`

---

## Responsive Breakpoints

| Name | Range |
|---|---|
| mobile | < 768px |
| tablet | 768px – 1279px |
| desktop | ≥ 1280px |

**Key adaptations**
- Nav: bottom tab bar (mobile) → top bar / side nav (desktop)
- Cards: single column (mobile) → 2–3 column grid (desktop)
- Modals: centered overlay (desktop) → bottom sheet (mobile)
- Buttons: full-width on mobile forms → auto-width on desktop

---

## Component Quick Reference (Prototype)

### Conversational Banking Chat
- User bubble: right-aligned, `bg-primary-500 text-white rounded-lg`
- Assistant bubble: left-aligned, `bg-neutral-100 text-neutral-700 rounded-lg`
- Input bar: full-width text input + icon-only send button (`aria-label="Send message"`)
- `aria-live="polite"` on message list
- Suggested prompt chips: `secondary sm` buttons

### Transfer Flow (3 steps)
1. Form: account selects + currency input + optional memo
2. Confirm: summary card + Cancel + Confirm Transfer
3. Success: `CheckCircle` icon `success-500` 48px + message + "Back to Accounts"
- Insufficient funds: `error-50` inline alert before submission

---

*Mark any deviation from these tokens as a design debt item for review.*
