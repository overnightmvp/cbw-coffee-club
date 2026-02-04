# Testing Patterns

**Analysis Date:** 2026-02-04

## Test Framework

**Status:** No testing framework is currently configured in this codebase.

**Note:** Neither Jest, Vitest, nor any other test runner has been set up. No test files exist in `src/`. Testing infrastructure is absent from package.json dependencies and build configuration.

## Test File Organization

**Current State:** Not applicable - no tests exist.

**Recommended Pattern (if testing is added):**
- Co-located tests: Place `.test.tsx` or `.spec.tsx` files next to source files
- API tests in: `src/app/api/[route]/__tests__/`
- Component tests in: `src/components/[component]/__tests__/`
- Utility tests in: `src/lib/__tests__/`

## Manual Testing Patterns

**Email Testing:**
The project includes two manual test scripts for email functionality:

**Script 1: `scripts/test-brevo-email.ts`**
- Run via: `npm run test:email`
- Tests email sending through Brevo API integration

**Script 2: `scripts/test-brevo-direct.ts`**
- Run via: `npm run test:email:direct`
- Direct testing of Brevo email functionality

Example from `package.json`:
```json
"test:email": "tsx scripts/test-brevo-email.ts",
"test:email:direct": "tsx scripts/test-brevo-direct.ts"
```

## Form Validation Testing (Built-in)

**Client-side Validation:**
All forms implement manual validation before submission.

Example from `src/components/booking/SimpleBookingModal.tsx`:
```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.contactName) {
    newErrors.contactName = 'Your name is required'
  }
  if (!formData.contactEmail) {
    newErrors.contactEmail = 'Email is required so the vendor can get back to you'
  } else if (!validateEmail(formData.contactEmail)) {
    newErrors.contactEmail = 'Please enter a valid email address'
  }
  if (!formData.eventType) {
    newErrors.eventType = 'What kind of event is this?'
  }
  if (!formData.eventDate) {
    newErrors.eventDate = 'When is your event?'
  }
  if (!formData.location) {
    newErrors.location = 'Where is your event being held?'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

**Validation Helpers:**
- `validateEmail()`: Inline regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Utilities in `src/lib/utils.ts`: `isValidEmail()`, `isPersonalEmail()`, `getCompanyDomain()`

## API Route Testing (Manual)

**Pattern:**
- API routes use try-catch with centralized error handling
- Routes check authentication and return structured error responses
- Console logging for debugging

Example from `src/app/api/admin/inquiries/route.ts`:
```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in inquiries route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Component Integration Testing (Manual)

**Admin Components:**
Components fetch data from API routes and handle async updates. Testing occurs through:
- Manual UI interaction in development
- Console error logging for debugging

Example from `src/app/admin/InquiriesTab.tsx`:
```typescript
const fetchLeads = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/admin/inquiries')
    if (!response.ok) throw new Error('Failed to fetch inquiries')
    const { data } = await response.json()
    setLeads(data || [])
  } catch (error) {
    console.error('Error fetching leads:', error)
    onMessage('Error loading inquiries')
  } finally { setLoading(false) }
}

useEffect(() => { fetchLeads() }, []) // eslint-disable-line react-hooks/exhaustive-deps

const updateStatus = async (leadId: string, status: Inquiry['status']) => {
  try {
    const response = await fetch(`/api/admin/inquiries/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!response.ok) throw new Error('Failed to update inquiry')
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
    onMessage(`Inquiry marked as ${status}`)
  } catch (error) {
    console.error('Error updating lead:', error)
    onMessage('Error updating status')
  }
}
```

## Storybook Testing

**Framework:** Storybook 9.1.3 with Next.js integration

**Configuration:**
- Location: `.storybook/main.ts` and `.storybook/preview.ts`
- Stories pattern: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Addons: `@storybook/addon-docs`, `@chromatic-com/storybook`

**Run Commands:**
```bash
npm run storybook              # Start Storybook dev server (port 6006)
npm run build-storybook       # Build static Storybook
npm run dev:docs              # Build Storybook + start dev server
```

**Story Structure:**
Each component has comprehensive Storybook documentation with:
- Multiple named story exports
- Rich JSDoc descriptions
- Interactive controls (argTypes)
- Real-world use case examples

Example from `src/components/ui/Button.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `...`
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'],
      description: 'Visual style variant for different use cases'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', 'icon'],
      description: 'Button size - all sizes meet 44px touch target on mobile'
    },
  }
}

export const AllVariants: Story = {
  name: '🎨 All Variants',
  render: () => (
    <div className="space-y-4">
      {/* Story content */}
    </div>
  )
}
```

**Story Naming Convention:**
- Emoji prefixes for visual scanning: `🎨`, `📱`, `⏳`, `🏢`, `🎯`
- PascalCase story names: `AllVariants`, `MobileSizes`, `LoadingStates`, `CorporateBookingFlow`
- Descriptive `name` parameter for display in Storybook UI

## Email Testing

**Brevo Integration:**
- Email sending is abstracted in `src/lib/email.ts`
- API routes use sendEmail() for notifications
- Fallback behavior: Skips email if BREVO_API_KEY not configured, logs to console

Example from `src/lib/email.ts`:
```typescript
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!brevoApiKey) {
    console.log('[EMAIL SKIPPED] No BREVO_API_KEY configured')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${html.substring(0, 200)}...`)
    return false
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { email: 'noreply@coffeecartsmelbourne.com', name: 'Coffee Cart Marketplace' }
    sendSmtpEmail.to = [{ email: to }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html

    await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log(`[EMAIL SENT] To ${to}: ${subject}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
```

**Manual Email Tests:**
Two scripts provide manual testing without full integration:
```bash
npm run test:email             # Test email via configured path
npm run test:email:direct      # Direct Brevo API test
```

## Missing Test Coverage

**Critical Areas Without Tests:**
1. **Authentication flow** (`src/lib/admin.ts`) - getCurrentAdmin() session checking
2. **Supabase operations** - All database queries in components and API routes
3. **Email notifications** - Brevo API integration (only manual scripts available)
4. **Form validation** - All validator functions in components and utils
5. **Error handling** - Try-catch blocks in components and routes
6. **Admin dashboard** - InquiriesTab, ApplicationsTab, JobsTab interactions
7. **Quote and job workflows** - Multi-step form logic and status transitions

**Recommended Priority for Testing:**
- High: API route authentication and error handling
- High: Form validation logic
- Medium: Database query wrappers
- Medium: Email sending functionality
- Low: UI component rendering (Storybook provides visual testing)

## Type Safety

**TypeScript Configuration:**
- Strict mode enabled: `"strict": true` in tsconfig.json
- All components and functions have explicit type annotations
- No implicit any types allowed

**Type Generation:**
- Database types manually defined in `src/lib/supabase.ts`
- Can be auto-generated via: `supabase gen types typescript --local`
- Legacy camelCase types (`LegacyVendor`) maintained for backward compatibility with older components

---

*Testing analysis: 2026-02-04*
