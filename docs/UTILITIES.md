# Utility Functions Reference

This document describes all utility functions available in the application at `src/lib/utils.ts`.

## Overview

The `utils.ts` file exports common helper functions used throughout the application for styling, formatting, and data manipulation.

---

## Available Utilities

### `cn(...inputs: ClassValue[]): string`

**Purpose:** Merge and deduplicate CSS class names using Tailwind CSS utilities.

**Usage:**
```typescript
import { cn } from '@/lib/utils'

// Merge multiple class strings
const buttonClasses = cn(
  'px-4 py-2 rounded',
  'bg-blue-500',
  'hover:bg-blue-600'
)

// Conditional classes
const isDisabled = true
const classes = cn(
  'px-4 py-2',
  isDisabled && 'opacity-50 cursor-not-allowed'
)

// Override with variant
const variantClasses = cn(
  'px-4 py-2 bg-blue-500',
  'bg-red-500' // This will override the blue due to Tailwind specificity
)
```

**Implementation:** Uses `clsx` for conditional class handling and `tailwind-merge` to avoid conflicting Tailwind utilities.

**Import:** `import { cn } from '@/lib/utils'`

---

### `formatDate(dateString: string | Date): string`

**Purpose:** Format timestamps into human-readable dates using Australian locale.

**Signature:**
```typescript
function formatDate(dateString: string | Date): string
```

**Parameters:**
- `dateString` (string | Date): ISO date string or JavaScript Date object

**Returns:**
- Formatted date string in "Mon DD, YYYY" format (e.g., "Jan 15, 2025")
- Empty string if input is null, undefined, or invalid

**Usage:**
```typescript
import { formatDate } from '@/lib/utils'

// Format ISO date string
const created = formatDate('2025-01-15T10:30:00Z')
console.log(created) // "Jan 15, 2025"

// Format Date object
const date = new Date('2025-12-25')
const formatted = formatDate(date)
console.log(formatted) // "Dec 25, 2025"

// Handle null values
const result = formatDate(null)
console.log(result) // ""

// In JSX (dashboard tables)
<td>{formatDate(inquiry.created_at)}</td>
```

**Locale:** Australian English (`en-AU`)
- Short month names: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- DD format: Zero-padded day (01-31)
- YYYY format: 4-digit year

**Used in:**
- Dashboard Inquiries Tab: `InquiriesTab.tsx` (lines 130, 228)
- Dashboard Applications Tab: `ApplicationsTab.tsx` (lines 132, 224)
- Dashboard Jobs Tab: `JobsTab.tsx` (lines 137, 216, 240)

**Error Handling:**
- Invalid date strings return empty string (not thrown error)
- Null/undefined inputs return empty string
- Safe to use with API responses that may have missing dates

---

## Importing Utilities

All utilities should be imported from the barrel export:

```typescript
// ✅ CORRECT
import { cn, formatDate } from '@/lib/utils'

// ❌ AVOID (importing directly from file)
import { formatDate } from '@/lib/utils.ts'
```

---

## Adding New Utilities

When adding new utility functions to `src/lib/utils.ts`:

1. Write the function with clear JSDoc comments
2. Export it: `export function myUtility() { ... }`
3. Add TypeScript types for all parameters
4. Update this documentation with usage examples
5. Consider adding tests in `e2e/formatDate-utility.spec.ts` if date/format related
6. Commit with a clear message: `feat: add myUtility function to @/lib/utils`

---

## Testing

Unit and integration tests for utilities are located in:
- `e2e/formatDate-utility.spec.ts` - formatDate validation and edge cases
- `e2e/admin-dashboard.spec.ts` - formatDate usage in dashboard components

Run tests with:
```bash
npx playwright test
npx playwright test e2e/formatDate-utility.spec.ts --ui
```

---

## Related Files

- **Definition:** `src/lib/utils.ts`
- **Tests:** `e2e/formatDate-utility.spec.ts`, `e2e/admin-dashboard.spec.ts`
- **Consumers:** Dashboard tabs, form components, data display components
