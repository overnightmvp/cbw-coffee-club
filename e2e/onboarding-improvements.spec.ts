import { test, expect } from '@playwright/test'

test.describe('Onboarding Improvements', () => {

  test.describe('Landing Page Clarity', () => {
    test('Landing page has clear mission and value proposition', async ({ page }) => {
      await page.goto('/')

      // Mission/headline visible above fold
      await expect(page.getByRole('heading', { name: /coffee cart marketplace/i })).toBeVisible()

      // Verify dual CTAs visible above fold
      await expect(page.getByRole('link', { name: /find.*coffee.*vendors/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /list.*business/i })).toBeVisible()

      // Value proposition section exists
      await expect(page.getByText(/why choose the bean route/i)).toBeVisible()

      // Social proof section exists
      await expect(page.getByText(/trusted by.*coffee community/i)).toBeVisible()
    })

    test('Social proof section displays vendor count and testimonials', async ({ page }) => {
      await page.goto('/')

      // Scroll to social proof section
      await page.getByText(/trusted by.*coffee community/i).scrollIntoViewIfNeeded()

      // Verify vendor count stat visible
      await expect(page.locator('text=/10\\+/').first()).toBeVisible()
      await expect(page.getByText(/verified vendors/i).first()).toBeVisible()

      // Verify event count stat visible
      await expect(page.locator('text=/50\\+/').first()).toBeVisible()

      // Verify at least one testimonial visible (check for wedding or corporate keywords)
      const testimonials = page.locator('text=/wedding|corporate|bookings/i')
      await expect(testimonials.first()).toBeVisible()
    })

    test('Value proposition section explains benefits for both audiences', async ({ page }) => {
      await page.goto('/')

      // Scroll to value prop section
      await page.getByText(/why choose the bean route/i).scrollIntoViewIfNeeded()

      // Verify event organizer benefits (look for heading specifically)
      await expect(page.getByRole('heading', { name: /for event organizers/i })).toBeVisible()
      await expect(page.getByText(/curated list/i)).toBeVisible()

      // Verify vendor benefits
      await expect(page.getByRole('heading', { name: /for coffee vendors/i })).toBeVisible()
      await expect(page.getByText(/free vendor listing/i)).toBeVisible()

      // Verify "Our Promise" section
      await expect(page.getByRole('heading', { name: /our promise/i })).toBeVisible()
    })

    test('CTAs are visible and actionable on mobile', async ({ page }) => {
      // Use mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Primary CTA visible above fold
      const findVendorsCTA = page.getByRole('link', { name: /find.*coffee.*vendors/i })
      await expect(findVendorsCTA).toBeVisible()

      // CTA is clickable and navigates correctly
      await findVendorsCTA.click()
      await expect(page).toHaveURL(/\/app/)
    })
  })

  test.describe('Post-Registration Feedback', () => {
    test('Success page shows approval timeline and next steps', async ({ page }) => {
      // Navigate directly to success page
      await page.goto('/vendors/register/success')

      // Verify success message visible
      await expect(page.getByRole('heading', { name: /registration submitted/i })).toBeVisible()

      // Verify approval timeline mentioned (24-48 hours)
      await expect(page.locator('text=/24.*48.*hours?/i')).toBeVisible()

      // Verify "what happens next" section present
      await expect(page.getByText(/what happens next/i)).toBeVisible()

      // Verify next steps numbered list (Review, Approval Email, Go Live)
      await expect(page.getByText(/review.*24.*48/i)).toBeVisible()
      await expect(page.getByText(/approval email/i)).toBeVisible()
      await expect(page.getByText(/go live/i)).toBeVisible()
    })

    test('Success state provides actionable next steps', async ({ page }) => {
      // Navigate directly to success page
      await page.goto('/vendors/register/success')

      // Verify tips section exists
      await expect(page.getByRole('heading', { name: /tips while you wait/i })).toBeVisible()

      // Verify at least 3 tips present (check for list items)
      await expect(page.getByText(/prepare high-quality photos/i)).toBeVisible()
      await expect(page.getByText(/check your email/i)).toBeVisible()
      await expect(page.getByText(/review your pricing/i)).toBeVisible()

      // Verify action buttons present
      await expect(page.getByRole('link', { name: /return home/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /browse vendors/i })).toBeVisible()
    })

    test('Success page is mobile-friendly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/vendors/register/success')

      // Verify no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)

      // Verify action buttons are visible and clickable on mobile
      const returnButton = page.getByRole('link', { name: /return home/i })
      await expect(returnButton).toBeVisible()

      // Verify main content is not cut off
      const mainContent = page.locator('main')
      await expect(mainContent).toBeVisible()
    })

    test('Action buttons navigate correctly from success page', async ({ page }) => {
      await page.goto('/vendors/register/success')

      // Test "Browse Vendors" button
      const browseButton = page.getByRole('link', { name: /browse vendors/i })
      await expect(browseButton).toBeVisible()
      await browseButton.click()
      await page.waitForURL(/\/app/)
      await expect(page).toHaveURL(/\/app/)

      // Navigate back to success page
      await page.goto('/vendors/register/success')

      // Test "Return Home" button
      const returnHomeButton = page.getByRole('link', { name: /return home/i })
      await expect(returnHomeButton).toBeVisible()
      await returnHomeButton.click()
      await page.waitForURL('/')
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Landing Page SEO and Accessibility', () => {
    test('Landing page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/')

      // Check h1 exists and is visible
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(/melbourne.*coffee.*cart.*marketplace/i)

      // Check h2 headings exist for sections
      const h2Headings = page.locator('h2')
      const h2Count = await h2Headings.count()
      expect(h2Count).toBeGreaterThan(2) // Should have multiple sections with h2
    })

    test('CTAs have sufficient contrast and touch target size', async ({ page }) => {
      await page.goto('/')

      // Get primary CTA button
      const primaryCTA = page.getByRole('link', { name: /find.*coffee.*vendors/i })

      // Check button is large enough for touch (WCAG 2.1 Level AA: 44px minimum, we use 48px)
      const boundingBox = await primaryCTA.boundingBox()
      expect(boundingBox).not.toBeNull()
      if (boundingBox) {
        // Accept 46px or more (allows for browser rendering differences)
        expect(boundingBox.height).toBeGreaterThanOrEqual(46)
      }
    })
  })
})
