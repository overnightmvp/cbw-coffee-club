# 🎨 Design System & Visual Grammar

A simple guide to the styling and components that define the TBR brand.

---

## 1. Brand Tokens

### Colors
| Name | Hex | Usage |
|---|---|---|
| **Gold (Primary)** | `#F5C842` | Hero CTAs, icons, progress bars, status badges. |
| **Mocha (Deep)** | `#3B2A1A` | Headings, secondary buttons, active selection states. |
| **Linen (BG)** | `#FAFAF8` | Global page background, soft contrast. |
| **Sand (Paper)** | `#FAF5F0` | Review cards, secondary containers. |

### Typography
- **Headings:** Bold tracking-tight (Next.js default font).
- **Body:** Neutral-600 (Text-sm/base).
- **Labels:** Uppercase tracking-wider (Neutral-500).

---

## 2. Shared Components

### Header (`/components/navigation/Header`)
- **Variant "Landing":** Transparent/Glassmorphic for home page.
- **Variant "App":** White/Sticky for marketplace and dashboard.

### Step Indicator (`/components/shared/StepIndicator`)
- Used in `/vendors/register` and `/jobs/create`.
- Visual progress bar using Brand Gold.

### Cards
- **Vendor Card:** Interactive hover state, pricing badge, specialty text.
- **Tab Button:** Pill-shaped, semi-bold, brand mocha for active state.

---

## 3. Styling Rules
- **Rounding:** Large (`rounded-xl` or `rounded-lg`) for a premium, friendly feel.
- **Shadows:** Subtle or `none` with border-neutral-200. We prefer a "flat/organic" look.
- **Spacing:** Generous padding (`py-16` for sections, `p-5` for cards).

---

## 4. Auth & Gating Patterns

### Passwordless Login
- **Flow:** Centralized `AuthGate` component that wraps protected routes.
- **Visuals:** Minimalist centered card with Brand Gold accent on the icon and primary button.
- **Feedback:** Error states use `bg-red-50` with `text-red-600` for high visibility on the Linen background.

### Gated Admin UI
- **Tabs:** Pill-shaped navigation handles major administrative contexts (Inquiries, Applications, Jobs, Docs).
- **Security Feedback:** 401/403 states automatically trigger the AuthGate, ensuring zero "ghost states" for unauthenticated users.
