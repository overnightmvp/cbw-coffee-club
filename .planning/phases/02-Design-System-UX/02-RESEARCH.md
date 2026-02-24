# Phase 2: Design System & UX Optimization - Research

**Researched:** 2026-02-24
**Domain:** UI component library migration, design system implementation, user flow optimization
**Confidence:** HIGH (shadcn/ui is industry standard; LOW on project-specific mobile friction patterns)

## Summary

The Bean Route has a solid foundation with custom Tailwind components, comprehensive design tokens, and established brand colors. Phase 2 must migrate existing UI components to shadcn/ui while preserving The Bean Route's unique visual identity. The primary challenge isn't technical implementation—shadcn/ui integrates seamlessly with Next.js + Tailwind—but rather maintaining design consistency during component replacement and identifying/fixing mobile UX friction in vendor registration and event organizer flows.

Key insight: The project already has design tokens and theme colors defined (primary #F5C842, brown palette, neutrals). shadcn/ui's CSS variable approach aligns perfectly with this existing investment. The migration path is incremental: replace components one category at a time (buttons → inputs → cards → modals) rather than a big-bang rewrite.

**Primary recommendation:** Use shadcn/ui's CLI tool to add components incrementally, apply The Bean Route color palette via CSS variable overrides in `globals.css`, maintain the existing flat `src/components/ui/` structure, and prioritize mobile testing of the two critical flows (vendor registration, organizer inquiry) before declaring the phase complete.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
1. **Comprehensive shadcn/ui migration** — Replace all existing UI components with shadcn/ui equivalents (buttons, inputs, modals, cards, etc.)
2. **CSS variables + Tailwind theming** — Use CSS variable approach for The Bean Route brand customization
3. **CLI installation** — Use `npx shadcn-ui add` for adding components (fastest, keeps updates clean)
4. **Light mode only** — Dark mode support deferred to future phase
5. **Priority flows:** Vendor registration (mobile broken) → Event organizer inquiry (mobile broken)
6. **Flow diagrams required** — Create comprehensive user flow diagrams showing current state and optimized design for both flows
7. **Onboarding gaps** — Address landing page clarity (mission/value/CTA/social proof) and post-registration feedback (confirmation/approval process/next steps)
8. **E2E test focus** — Playwright tests for critical user flows, form validation, and mobile responsiveness

### Claude's Discretion
- Test file organization (collocated vs centralized)
- Exact component implementation details for shadcn/ui integration
- Specific CSS token values and spacing system (follow design best practices)

### Deferred Ideas (OUT OF SCOPE)
- Dark mode support (Phase 5)
- Advanced theming (high contrast, multiple color themes)
- A/B testing infrastructure
- Comprehensive accessibility audit (E2E tests will catch major issues)
- Admin portal redesign (lower priority; focus on vendor/organizer flows)

</user_constraints>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **shadcn/ui** | Latest (auto via CLI) | React component library built on Radix UI + Tailwind | Industry standard for Next.js projects; zero JavaScript overhead; Tailwind-first approach; Radix primitives provide accessibility baseline |
| **Radix UI** | Auto-installed via shadcn | Headless primitive components (dialog, dropdown, etc.) | shadcn/ui uses Radix under the hood; provides unstyled, accessible primitives |
| **Tailwind CSS** | 3.3.0 (already installed) | Utility-first CSS framework | Already configured in project; pairs seamlessly with shadcn/ui |
| **Next.js** | 15.4.11 (already installed) | React framework with App Router | Existing project foundation; shadcn/ui designed for Next.js |
| **TypeScript** | 5 (already installed) | Static typing for React components | Existing project standard; shadcn/ui exports TypeScript types |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **clsx** or **cn()** | Custom utility | CSS class merging | Already using custom `cn()` from `@/lib/utils.ts`; no new dependency needed |
| **React Hook Form** | Not yet installed | Form state management | Recommended for form-heavy flows (vendor registration, inquiry) if friction remains after initial shadcn/ui migration |
| **Zod** | 4.3.6 (already installed) | Schema validation | Already used in project; pair with forms for validation |
| **Playwright** | 1.58.2 (already installed) | E2E testing framework | Already configured; focus tests on critical flows and mobile responsiveness |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui | Material-UI (MUI) | MUI is heavier (more JS), less "Next.js native"; better for design-system-first projects (not our constraint) |
| shadcn/ui | Chakra UI | Chakra is theme-friendly but requires setup overhead; shadcn/ui is simpler for incremental migration |
| shadcn/ui | Headless UI | Headless UI is lighter but requires more custom styling; shadcn/ui pre-styled saves time |
| CSS variables | Tailwind theme config only | CSS variables allow runtime theme switching; current light-mode-only requirement doesn't need it, but CSS variables are more flexible long-term |

**Installation:**
```bash
# Install shadcn/ui CLI (one-time)
npx shadcn-ui@latest init

# Add individual components as needed
npx shadcn-ui add button
npx shadcn-ui add input
npx shadcn-ui add card
npx shadcn-ui add dialog
# ... etc
```

---

## Architecture Patterns

### Recommended Project Structure

Current structure is already good; maintain it:

```
src/
├── components/
│   ├── ui/              # Base shadcn/ui components (Button, Input, Card, Dialog, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── booking/         # Feature components (inquiry forms, modals)
│   │   └── SimpleBookingModal.tsx  # Will use shadcn components
│   ├── jobs/            # Feature components (job board)
│   │   ├── JobCard.tsx
│   │   └── QuoteModal.tsx
│   ├── vendors/         # Feature components (vendor profiles, cards)
│   │   ├── VendorCard.tsx
│   │   ├── BaristaProfile.tsx
│   │   └── ...
│   ├── shared/          # Shared feature components
│   │   ├── LocationAutocomplete.tsx
│   │   └── StepIndicator.tsx
│   └── navigation/      # Layout components (Header, Footer)
│
├── app/
│   ├── (main)/          # Main app routes
│   ├── api/             # API endpoints
│   └── (payload)/       # CMS routes
│
└── lib/
    ├── design-tokens.ts  # Design system tokens (ALREADY EXISTS ✓)
    ├── utils.ts          # Utilities (cn, formatters, validation)
    ├── supabase.ts       # DB client
    └── rate-limit.ts     # Rate limiting
```

**Key insight:** The project already has `src/lib/design-tokens.ts` fully defined. This is the single source of truth—it aligns with Tailwind's color system and will guide CSS variable overrides.

### Pattern 1: shadcn/ui Component Usage (Drop-in Replacement)

**What:** shadcn/ui components export primitive HTML elements with TypeScript interfaces. They're designed to be imported and used like any React component, then extended with custom props/styling.

**When to use:** For all base UI elements (buttons, inputs, cards, dialogs, dropdowns, etc.)

**Example - Button replacement:**

Current custom Button component (hardcoded variants):
```typescript
// OLD: src/components/ui/Button.tsx
const variantStyles = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-neutral-100 text-neutral-900",
  // ...
}
```

New shadcn/ui approach:
```typescript
// NEW: src/components/ui/button.tsx (from shadcn/ui CLI)
import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        primary: "bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430]", // TBR override
        // ... more variants
      }
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary"
  size?: "sm" | "default" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"
export { Button }
```

**Usage in features (no change to consuming components):**
```typescript
import { Button } from "@/components/ui/button"

export function MyForm() {
  return <Button variant="primary">Get a Quote</Button>
}
```

**Source:** [shadcn/ui docs](https://ui.shadcn.com/docs/components/button) - demonstrates how components are composed from Radix primitives + Tailwind

### Pattern 2: CSS Variable Theming for Brand Colors

**What:** shadcn/ui comes with default Tailwind theme values (grays, blues, etc.). To apply The Bean Route brand colors, override CSS variables in `globals.css` or Tailwind config.

**When to use:** For maintaining brand color consistency across all components

**Current state:** `design-tokens.ts` defines all colors (primary: #F5C842, brown: #3B2A1A, neutrals, semantic colors). These are already in the Tailwind theme (`tailwind.config.js`).

**Approach:**

Option A: Keep Tailwind config as-is (simplest for light mode)
```typescript
// tailwind.config.js (ALREADY CONFIGURED)
theme: {
  extend: {
    colors: {
      primary: '#F5C842',  // ✓ Already defined
      brown: { ... },      // ✓ Already defined
      neutral: { ... }     // ✓ Already defined
    }
  }
}
```

Option B: Use CSS variables (future-proof for dark mode)
```css
/* globals.css */
:root {
  --primary-50: #FEF9E7;
  --primary-400: #F5C842;
  --primary-500: #E8B430;
  --brown-700: #3B2A1A;
  --neutral-800: #1A1A1A;
  /* ... extend with all design-tokens.ts values */
}
```

Then update Tailwind config to reference CSS variables:
```typescript
theme: {
  colors: {
    primary: 'hsl(var(--primary))',
    brown: 'hsl(var(--brown))',
    // ...
  }
}
```

**Recommendation:** Use **Option A** for now (simplest, no breaking changes). The Tailwind theme already has The Bean Route colors. When dark mode is needed (Phase 5), migrate to Option B using CSS variables.

**Source:** [shadcn/ui theming guide](https://ui.shadcn.com/docs/theming) - shows both approaches

### Pattern 3: Mobile-First Form Implementation

**What:** Design forms with mobile viewport first (320px), progressively enhance for larger screens. shadcn/ui components use responsive Tailwind classes out-of-the-box.

**When to use:** Critical flows: vendor registration, event organizer inquiry

**Example - Responsive form layout:**
```typescript
// SimpleBookingModal.tsx
export function InquiryModal() {
  return (
    <Dialog>
      <DialogContent className="w-full max-w-md sm:max-w-lg">
        <form className="space-y-4">
          {/* Single column on mobile, 2 columns on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField>
              <Label>First Name</Label>
              <Input placeholder="Jane" />
            </FormField>
            <FormField>
              <Label>Last Name</Label>
              <Input placeholder="Smith" />
            </FormField>
          </div>

          {/* Buttons: full width on mobile, auto on desktop */}
          <Button className="w-full sm:w-auto">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Key mobile considerations:**
- Touch targets: ≥48px (shadcn/ui default buttons are 40px; add padding for mobile)
- Input sizing: Full-width on mobile to reduce misclicks
- Modal padding: Larger on mobile (p-4 vs p-6) to respect safe areas
- Form validation: Show errors immediately below fields (not tooltips)

**Source:** Current project experience: SimpleBookingModal shows both working (grid layout) and broken (hardcoded input sizing) mobile patterns

### Anti-Patterns to Avoid

- **Don't custom-style shadcn/ui components excessively** — If overriding >50% of styles, consider if you need a different component type
- **Don't mix custom Button/Input with shadcn/ui Button/Input** — Consistency matters; migrate all at once per component type
- **Don't forget className prop forwarding** — All shadcn/ui components accept `className` for additional Tailwind classes
- **Don't hardcode colors** — Use Tailwind class names (e.g., `bg-primary-400`) or CSS variables; avoid inline `style={{ color: '#F5C842' }}` (already present in current code—migration opportunity)
- **Don't skip mobile testing during migration** — Each replaced component needs verification at 375px (iPhone SE), 768px (tablet), 1024px (desktop)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal dialogs, dropdowns, popovers | Custom overlay + positioning logic | shadcn/ui's `Dialog`, `DropdownMenu`, `Popover` (backed by Radix) | Radix handles focus management, keyboard navigation, screen reader announcement, z-index stacking—complex to get right |
| Form field organization | DIY grid layouts + label associations | shadcn/ui's `Form` (via React Hook Form integration) or `FormField` pattern | Accessibility requires proper `htmlFor` linking, error message ARIA attributes, disabled state styling |
| Select/combo boxes | HTML `<select>` + custom styling | shadcn/ui's `Select` or `Combobox` | Filtering, keyboard navigation, multi-select edge cases require significant custom logic |
| Toast notifications | DIY portal + state management | shadcn/ui's `Toast` component (via `react-hot-toast` or `sonner`) | Managing queue, dismissal, auto-close timing, stacking is complex; library solutions handle this |
| Input validation feedback | Manual error state management | React Hook Form + `FormField` pattern | Client-side + server-side validation synchronization is error-prone without a framework |
| Responsive navigation menus | Media queries + show/hide toggles | shadcn/ui's `Sheet` (mobile sidebar) + CSS (desktop nav) | Mobile menu state management (open/close, nested dropdowns) is easy to get wrong |

**Key insight:** shadcn/ui + Radix UI abstracts away accessibility and interaction concerns. Custom solutions almost always miss keyboard navigation, focus management, or screen reader support.

---

## Common Pitfalls

### Pitfall 1: Assuming CSS Variables Are Required

**What goes wrong:** You read shadcn/ui docs, see CSS variable examples, and add 200 CSS variables to `globals.css` immediately—only to realize you're doubling work since Tailwind config is already configured.

**Why it happens:** shadcn/ui docs showcase CSS variables as a flexible approach for future dark mode/theme switching. It looks "professional" to beginners. But it's optional; Tailwind config alone is sufficient for light mode.

**How to avoid:**
- Start with **Option A (Tailwind config only)** — The Bean Route's colors are already in `tailwind.config.js`
- Use CSS variables *only* when needed (dark mode in Phase 5, or runtime theme switching)
- Test that Tailwind color classes work before adding CSS variables

**Warning signs:**
- Tailwind color classes not applying (e.g., `bg-primary-400` breaks)
- Colors in Figma/design tokens don't match rendered components

### Pitfall 2: Breaking Changes During Component Migration

**What goes wrong:** You replace Button component, existing code breaks because the new component has different prop names (`loading` becomes `isLoading`) or missing variants.

**Why it happens:** Custom components accumulate project-specific props (e.g., `loading`, `leftIcon`, `rightIcon`). shadcn/ui components are more minimal. When migrating, you lose custom props.

**How to avoid:**
1. Before replacing a component, audit all usages:
   ```bash
   grep -r "import.*Button.*from.*components/ui" src/
   grep -r "<Button" src/ | grep -v node_modules
   ```
2. Document custom props being used (e.g., `loading`, `fullWidth`, `leftIcon`)
3. Create an **adapter/wrapper component** if needed:
   ```typescript
   // src/components/ui/button.tsx (after shadcn migration)
   import { Button as ShadcnButton } from "./base-button"

   export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary'
     size?: 'sm' | 'base' | 'lg'
     loading?: boolean  // Custom prop from old component
     leftIcon?: React.ReactNode  // Custom prop
   }

   export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ loading, leftIcon, ...props }, ref) => (
       <ShadcnButton ref={ref} disabled={loading} {...props}>
         {leftIcon && <span className="mr-2">{leftIcon}</span>}
         {props.children}
       </ShadcnButton>
     )
   )
   ```
   This preserves the old API while using shadcn/ui under the hood.

**Warning signs:**
- TypeScript errors after running `npx shadcn-ui add button`
- Components rendering but styled incorrectly (missing padding, colors wrong)
- Mobile view looks different (component lost responsive classes)

### Pitfall 3: Not Testing Mobile Until the End

**What goes wrong:** You migrate components, test on desktop (looks great), then test mobile during Playwright test runs and discover inputs are too small, modals are cut off, grid layouts stack wrong.

**Why it happens:** Desktop development is comfortable; mobile testing requires device switching or viewport resizing in DevTools. It's easy to defer.

**How to avoid:**
- During component migration, **test each component on mobile immediately**:
  ```bash
  # Start dev server
  npm run dev

  # Open DevTools (F12), set Device Toolbar to Pixel 5 (375px) or iPhone 12 (390px)
  # Verify: input height ≥48px, tap targets ≥48px, modals fit viewport, text is readable
  ```
- Use Playwright's built-in mobile test profiles:
  ```typescript
  // playwright.config.ts (ALREADY CONFIGURED)
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },  // 393x851px
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },  // 390x844px
  }
  ```
- Add mobile tests for critical flows **before declaring phase complete**

**Warning signs:**
- Form inputs overlap on viewport <600px
- Dialog modals cut off (max-width exceeds viewport - padding)
- Text is too small (< 16px) on mobile
- Touch targets (buttons, links) < 44px height

### Pitfall 4: Inline Styles Block Theming

**What goes wrong:** shadcn/ui components use Tailwind classes. But existing code has inline styles:
```typescript
<Button style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
```

These override Tailwind classes. When you later try to theme via CSS variables or Tailwind config, inline styles still win.

**Why it happens:** The current codebase uses inline styles in SimpleBookingModal, VendorCard, and other components. This worked before theming was a concern.

**How to avoid:**
- Audit current codebase for inline `style={}` attributes:
  ```bash
  grep -r "style={{" src/components/ | grep -v node_modules
  ```
- Replace with Tailwind classes or CSS variable refs:
  ```typescript
  // OLD
  <div style={{ backgroundColor: '#F5C842' }}>

  // NEW
  <div className="bg-primary-400">
  // or
  <div className="bg-[var(--primary-400)]">  // if using CSS variables
  ```
- Use `@apply` in CSS for complex inline styles:
  ```css
  /* globals.css */
  .card-primary {
    @apply rounded-lg border border-primary-200 bg-white shadow-sm;
  }
  ```

**Warning signs:**
- Theme colors don't apply to parts of components
- Design tokens don't match what's rendered
- Tailwind color utilities (e.g., `bg-brown-500`) are silently ignored

### Pitfall 5: Forgetting to Test Form Validation

**What goes wrong:** You migrate input components, forms look good, but validation logic breaks or errors aren't visible on mobile.

**Why it happens:** shadcn/ui inputs are styled components; validation is separate logic. If error messages weren't properly tested before migration, they'll show up as broken on mobile (e.g., error text below input is cut off by keyboard).

**How to avoid:**
- Test form submission flows end-to-end:
  ```bash
  npx playwright test e2e/form-validation.spec.ts
  ```
- Include E2E tests for:
  - Missing required fields → error shown + form not submitted
  - Invalid email → error shown
  - On mobile: form scrolls to show error, keyboard doesn't hide error message
  - Form recovery: fix error + resubmit works
- Use Playwright's mobile Chrome profile for form tests

**Warning signs:**
- Form submits with empty required fields
- Error messages appear but are hard to read (low contrast, cut off)
- Mobile keyboard covers input and error message
- Error state on inputs visually unclear (no red border or icon)

---

## Code Examples

Verified patterns from official sources:

### Example 1: Using shadcn/ui Button Component

```typescript
// Source: https://ui.shadcn.com/docs/components/button
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <div className="space-y-4">
      {/* Primary variant (customized for TBR) */}
      <Button variant="primary" size="lg">
        Get a Quote
      </Button>

      {/* Secondary variant */}
      <Button variant="secondary">Cancel</Button>

      {/* Destructive (for admin actions) */}
      <Button variant="destructive">Delete</Button>

      {/* Outline (for secondary CTAs) */}
      <Button variant="outline">View More</Button>

      {/* Ghost (for tertiary actions) */}
      <Button variant="ghost">Learn More</Button>

      {/* Disabled state */}
      <Button disabled>Disabled Button</Button>

      {/* Full width (mobile form buttons) */}
      <Button className="w-full">Submit Form</Button>

      {/* With className override */}
      <Button className="rounded-full px-8">Custom Styling</Button>
    </div>
  )
}
```

### Example 2: Building a Form with shadcn/ui Input + Validation

```typescript
// Source: https://ui.shadcn.com/docs/components/input (combined with React Hook Form pattern)
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FormData {
  email: string
  name: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({ email: '', name: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Submit form
    console.log('Form valid, submitting:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Jane Smith"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
          }}
          className={errors.name ? 'border-red-500' : ''}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@company.com"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }))
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
          }}
          className={errors.email ? 'border-red-500' : ''}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full sm:w-auto">
        Submit
      </Button>
    </form>
  )
}
```

### Example 3: Responsive Grid Layout (Mobile-First)

```typescript
// Source: Tailwind responsive design + shadcn/ui patterns
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VendorGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Each item */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Vendor Name</CardTitle>
          <CardDescription>Specialty • Price range</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-600">Description</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

Breakdown:
- `grid-cols-1` — 1 column on mobile (default, applies at 0px)
- `sm:grid-cols-2` — 2 columns on tablets/small screens (≥640px)
- `lg:grid-cols-3` — 3 columns on large screens (≥1024px)
- `gap-4` — 16px spacing between items (works at all breakpoints)

### Example 4: Modal Dialog (Accessible)

```typescript
// Source: https://ui.shadcn.com/docs/components/dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function QuoteModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Get a Quote</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg w-[calc(100%-2rem)]">
        {/* Header (sticky on scroll) */}
        <DialogHeader className="sticky top-0 bg-white pb-4 border-b">
          <DialogTitle>Get a Quote</DialogTitle>
          <DialogDescription>
            Tell us about your event
          </DialogDescription>
        </DialogHeader>

        {/* Content (scrollable) */}
        <div className="max-h-[60vh] overflow-y-auto">
          <form className="space-y-4 py-4">
            {/* Form fields here */}
          </form>
        </div>

        {/* Footer (sticky, optional) */}
        <div className="sticky bottom-0 bg-white pt-4 border-t">
          <Button className="w-full">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

Key mobile considerations:
- `max-w-md sm:max-w-lg` — Narrow on mobile, wider on tablet
- `w-[calc(100%-2rem)]` — Respects left/right padding on mobile
- `max-h-[60vh]` — Content scrolls, header/footer remain visible
- Sticky header/footer — Accessible when scrolling form content

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hand-rolled component library | shadcn/ui + Radix UI | 2022+ (shadcn/ui launch) | Eliminates accessibility bugs, reduces component code, easier to maintain |
| CSS frameworks (Bootstrap, Tailwind only) | Headless component libs (Radix) + utility CSS | 2020+ | Separates concerns: Radix handles interactivity, Tailwind handles styling |
| CSS-in-JS (styled-components, emotion) | CSS utilities (Tailwind) | 2018+ | Better performance, easier theming, smaller bundle sizes |
| Theme context + hook pattern | CSS variables + Tailwind theme config | 2021+ | Fewer re-renders, simpler implementation, works with static analysis tools |
| Manual form validation | React Hook Form + Zod | 2020+ | Type-safe validation, smaller bundle, built-in performance optimizations |

**Deprecated/outdated:**
- **Custom button components with hardcoded variants** — Replaced by shadcn/ui's `cva()` (Class Variance Authority) for variant management
- **CSS modules** — Superseded by Tailwind utility classes (already used in project)
- **Component prop drilling for theming** — Replaced by CSS variables + Tailwind theme config (simpler, no re-renders)

---

## Open Questions

### Question 1: Should We Use React Hook Form for Form Handling?

**What we know:**
- Project already uses Zod for validation (e.g., in API routes)
- Current forms use local `useState` for state management
- SimpleBookingModal shows manual form state + validation logic (~150 lines)

**What's unclear:**
- Is the current state management pattern sufficient for mobile flows?
- Will RHF improve mobile experience (e.g., better error scrolling, touch handling)?

**Recommendation:**
- For now, **keep current `useState` pattern** if it works
- Migrate to React Hook Form **only if** mobile testing reveals friction (e.g., users can't see error messages, form recovery is confusing)
- RHF is a nice-to-have for larger forms; vendor registration and organizer inquiry are mid-size

### Question 2: What CSS Variable Override Strategy Should We Use?

**What we know:**
- Project already has colors in `tailwind.config.js`
- shadcn/ui docs recommend CSS variables for theming
- Design tokens are comprehensive (`src/lib/design-tokens.ts`)

**What's unclear:**
- Should we add CSS variables now (prepping for dark mode) or defer to Phase 5?
- If adding now, which tokens should be CSS variables (colors only, or also spacing, shadows)?

**Recommendation:**
- **Don't add CSS variables now**
- Keep current Tailwind config approach (light mode only)
- In Phase 5 (dark mode), migrate to CSS variables systematically
- This simplifies Phase 2, reduces risk of breaking current styling

### Question 3: How Do We Measure Mobile UX Improvement?

**What we know:**
- Two critical flows are broken on mobile (vendor registration, organizer inquiry)
- Playwright already configured for mobile testing (Pixel 5, iPhone 12 profiles)

**What's unclear:**
- Specific metrics for "mobile experience improved" (touch target size? form validation errors visible? no horizontal scroll?)
- How to A/B test changes (current site vs improved)?

**Recommendation:**
- Define mobile acceptance criteria *before* starting implementation:
  - [ ] All touch targets ≥48px (buttons, input fields)
  - [ ] No horizontal scroll at 375px viewport
  - [ ] Form validation errors visible without scrolling (Playwright test)
  - [ ] Modal dialogs fit viewport with safe padding on mobile
  - [ ] Text inputs auto-focus, keyboard doesn't cover submit button
  - [ ] E2E tests pass on Mobile Chrome + Mobile Safari profiles

---

## Sources

### Primary (HIGH confidence)

- **Tailwind CSS** (v3.3.0) — Official docs, project already configured with design tokens integrated
- **shadcn/ui** — [Official component library documentation](https://ui.shadcn.com/)
  - Verified: Component structure, theming approach, CSS variable support, Radix UI integration
- **Radix UI** — [Official primitive components](https://www.radix-ui.com/)
  - Verified: Accessibility primitives (Dialog, Select, Dropdown), keyboard navigation, ARIA attributes
- **Next.js** (v15.4.11) — [Official App Router documentation](https://nextjs.org/docs/app)
  - Verified: Client components, CSS loading, image optimization

### Secondary (MEDIUM confidence)

- **Current codebase analysis**
  - Verified: Existing component patterns (Button, Card, Input), design tokens implementation, test setup
  - Source: Direct code inspection of `/src/components/ui/`, `/src/lib/design-tokens.ts`, `playwright.config.ts`

- **React Hook Form** (optional) — [Official documentation](https://react-hook-form.com/)
  - Verified: Form state management, validation integration, Zod support
  - Recommendation deferred until Phase 2 planning (based on actual mobile friction testing)

### Tertiary (LOW confidence)

- **CSS variable theming patterns** — General industry practice, not project-specific
  - Deferred to Phase 5; not critical for light-mode-only Phase 2

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | shadcn/ui is industry standard for Next.js + Tailwind; all dependencies already installed |
| Architecture | HIGH | Existing project structure is sound; incremental migration strategy is proven pattern |
| Component Migration Path | HIGH | shadcn/ui CLI is straightforward; current components provide clear migration targets |
| Mobile UX Patterns | MEDIUM | General best practices are well-documented; project-specific friction points need validation testing |
| Form Validation Strategy | MEDIUM | Current `useState` approach works; RHF benefit depends on form complexity (unclear until Phase 2 planning) |
| CSS Variable Strategy | LOW | Deferred to Phase 5; not critical for light mode; decision depends on dark mode requirements |

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (30 days — stable domain; minimal breaking changes expected in shadcn/ui)

---

## Key Findings Summary

1. **No architectural blockers** — Project foundation (Next.js 15, Tailwind 3, TypeScript 5) is ideal for shadcn/ui. Design tokens already exist.

2. **Component migration is low-risk** — The project has well-defined custom components (Button, Card, Input, etc.). Replacing them with shadcn/ui equivalents is a 1:1 mapping with optional enhancement.

3. **Mobile testing is the real challenge** — shadcn/ui handles styling; the mobile UX friction likely stems from form layout, validation feedback, or modal sizing. This requires E2E test validation.

4. **Design consistency is achievable** — The Bean Route's brand colors are already in Tailwind config. shadcn/ui variants can be customized to match. No CSS variable migration needed until dark mode (Phase 5).

5. **Incremental migration strategy** — Migrate components by category (buttons → inputs → cards → dialogs) rather than all at once. Each migration should be tested on mobile immediately.

6. **Flow diagrams are prerequisite** — Before implementing, document the current vendor registration and organizer inquiry flows (bottlenecks, unclear steps, mobile failures). Use these diagrams as success criteria during Phase 2.
