# Coding Conventions

**Analysis Date:** 2026-02-04

## Naming Patterns

**Files:**
- PascalCase for React components: `Button.tsx`, `InquiriesTab.tsx`, `VendorPageClient.tsx`
- camelCase for utilities and libraries: `supabase.ts`, `email.ts`, `admin.ts`, `utils.ts`
- kebab-case for directories: `src/components/ui/`, `src/app/api/admin/`, `src/components/booking/`

**Functions:**
- camelCase for all functions: `formatCurrency()`, `isValidEmail()`, `getCompanyDomain()`, `updateStatus()`
- Prefix boolean functions with `is` or `get`: `isValidEmail()`, `isPersonalEmail()`, `getInitials()`
- Handler functions prefixed with `handle`: `handleSubmit()`, `handleClose()`, `updateStatus()`

**Variables:**
- camelCase for all variables and constants: `formData`, `isSubmitting`, `selectedLead`, `filterStatus`
- State variables follow pattern: `[value, setValue]`: `const [leads, setLeads]`, `const [errors, setErrors]`
- Inline constants in UPPER_CASE: `eventTypes`, `guestOptions`, `durationOptions`, `personalDomains`

**Types:**
- PascalCase for all TypeScript types: `Vendor`, `Inquiry`, `VendorApplication`, `Job`, `Quote`, `AdminUser`
- Discriminated unions using `status` field: `'pending' | 'contacted' | 'converted'`, `'open' | 'closed'`, `'approved' | 'rejected'`
- Extend React props interface with component-specific props: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`

## Code Style

**Formatting:**
- Prettier is NOT explicitly configured (no .prettierrc file found)
- 2-space indentation inferred from codebase
- Semicolons used throughout
- Single quotes for strings, backticks for template literals

**Linting:**
- ESLint configuration: `.eslintrc.json`
- Extends `next/core-web-vitals` and `plugin:storybook/recommended`
- Custom rule overrides:
  - `@next/next/no-img-element: warn` (allows img elements with warning)
  - `react/no-unescaped-entities: off` (disables escaping check)

**Import Organization:**
Order in all files:
1. React and Next.js imports
2. External dependencies (`@supabase/supabase-js`, `@getbrevo/brevo`)
3. Internal absolute imports using `@/` alias
4. Type imports using `type` keyword

Example from `src/components/ui/Button.tsx`:
```typescript
import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // ...
}
```

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Used consistently throughout codebase for all imports

## Error Handling

**Patterns:**
- Try-catch blocks for async operations with console.error logging
- Structured error responses in API routes: `NextResponse.json({ error: '...' }, { status: 400 })`
- Inline validation with manual error objects: `const newErrors: Record<string, string> = {}`
- User-facing alerts via browser alert() for form submission errors
- Silent failures with console logging for non-critical operations (e.g., email notifications in forms)

Example from `src/components/booking/SimpleBookingModal.tsx`:
```typescript
try {
  const { error } = await supabase.from('inquiries').insert({...})
  if (error) {
    console.error('Inquiry submission error:', error)
    alert('Something went wrong. Please try again or contact us directly.')
    return
  }
} catch (err) {
  console.error('Unexpected error:', err)
  alert('Something went wrong. Please try again.')
} finally {
  setIsSubmitting(false)
}
```

Example from API route `src/app/api/admin/inquiries/route.ts`:
```typescript
if (error) {
  console.error('Error fetching inquiries:', error)
  return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
}
```

## Logging

**Framework:** console (no logging library)

**Patterns:**
- `console.error()` for failures and exceptions: `console.error('Error fetching inquiries:', error)`
- `console.log()` for informational messages (rarely used)
- Structured logging in email service with prefixes: `console.log('[EMAIL SENT] To ${to}: ${subject}')`
- Context-aware messages in error logs identifying location and what failed

Example from `src/lib/email.ts`:
```typescript
if (!brevoApiKey) {
  console.warn('BREVO_API_KEY not configured. Email sending will be skipped.')
}

console.log(`[EMAIL SENT] To ${to}: ${subject}`)
console.error('Failed to send email:', error)
```

## Comments

**When to Comment:**
- JSDoc comments for public exported functions and types
- Inline comments for non-obvious logic or workarounds
- Type comments explaining discriminated union states

**JSDoc/TSDoc:**
- Used in utility functions: `src/lib/utils.ts` and `src/lib/email.ts`
- Format: Multi-line comments with `/**` start, `@param`, `@returns`
- Example from `src/lib/email.ts`:
```typescript
/**
 * Send an email via Brevo (formerly Sendinblue)
 * Server-side only - never call from client components
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - HTML email body
 * @returns Promise resolving to success status
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean>
```

## Function Design

**Size:** Generally under 150 lines, with larger functions broken into logical blocks with comments
- `InquiriesTab.tsx`: 235 lines (complex admin interface with local state management)
- `SimpleBookingModal.tsx`: 415 lines (multi-step form with validation and email notification)
- Individual utility functions: 5-20 lines

**Parameters:**
- Props destructured inline with type annotation
- Optional parameters with defaults: `variant = 'primary'`, `size = 'base'`, `loading = false`
- Configuration objects for complex data: `interface ButtonProps`, `interface InquiryFormData`

**Return Values:**
- Explicit return types on all functions
- API routes return `NextResponse.json({ ... }, { status })`
- Component functions return JSX or null conditionally
- Utility functions return primitives or typed objects: `string`, `boolean`, `number`, `Promise<boolean>`

## Module Design

**Exports:**
- Named exports preferred for utilities: `export function formatCurrency()`, `export function isValidEmail()`
- Named exports for components: `export { Button }`, `export function InquiriesTab()`
- Default exports for page components: `export default function RootLayout()`
- Type exports for database types: `export type Vendor = {...}`, `export type Inquiry = {...}`

**Barrel Files:**
- `src/components/ui/` imports all components in Button, Card, Input, Badge
- Import from barrel in components: `import { Card, CardContent, Button } from '@/components/ui'`
- All database types in single file: `src/lib/supabase.ts`

## Design System & Styling

**Tailwind CSS:**
- Utility-first approach for all styling
- No CSS modules or styled-components
- Inline className strings with conditional variants

Example from `src/components/ui/Button.tsx`:
```typescript
const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md..."
const variantStyles = {
  primary: "bg-blue-500 text-white hover:bg-blue-600...",
  secondary: "bg-neutral-100 text-neutral-900...",
}
const sizeStyles = {
  xs: "h-7 rounded px-2 text-xs",
  base: "h-10 px-4 py-2",
  lg: "h-11 rounded-md px-6 text-base",
}
```

**Design Tokens:**
- Centralized in `src/lib/design-tokens.ts` (5,752 bytes)
- Brand colors: Coffee-themed palette with primary gold (#F5C842), dark brown (#1A1A1A, #3B2A1A)
- Used inline in components via style props: `style={{ color: '#1A1A1A' }}`, `className="bg-[#F5C842]"`
- Australian market considerations: AUD currency formatting, Melbourne suburbs, corporate event language

## Component Patterns

**Functional Components:**
- All components are functional with React hooks
- Use `'use client'` directive for interactive components
- ForwardRef pattern for components that need DOM access:

Example from `src/components/ui/Button.tsx`:
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'base', ...props }, ref) => {
    // component logic
    return (
      <button
        className={cn(...)}
        ref={ref}
        {...props}
      >
        {/* JSX */}
      </button>
    )
  }
)
Button.displayName = "Button"
export { Button }
```

**Component Composition:**
- Components accept children and pass through HTML attributes
- Use cn() utility for className merging: `className={cn(baseStyles, variantStyles[variant], customClassName)}`
- Conditional rendering with early return: `if (!isOpen || !vendor) return null`

**Storybook Integration:**
- All UI components include `.stories.tsx` files
- Story exports with meaningful names: `AllVariants`, `MobileSizes`, `LoadingStates`, `CorporateBookingFlow`
- Rich documentation in story parameters with Markdown descriptions
- Example contexts for real-world usage patterns

---

*Convention analysis: 2026-02-04*
