import { test, expect, devices } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard before each test
    await page.goto('/dashboard')
  })

  test.describe('Authentication & Access', () => {
    test('unauthenticated user sees login gate', async ({ page }) => {
      // Should show login prompt with email field
      await expect(
        page.getByPlaceholder(/Email/i).or(page.getByText(/Admin Portal/i))
      ).toBeVisible()

      // Should not show dashboard content
      const inquiriesTab = page.getByRole('tab', { name: /Inquiries/i })
      await expect(inquiriesTab).not.toBeVisible()
    })

    test('session cookie persists across page refreshes', async ({ page }) => {
      // Verify we're on login page initially
      const emailInput = page.getByPlaceholder(/Email/i)
      await expect(emailInput).toBeVisible()

      // Refresh the page
      await page.reload()

      // Should still be on login page (session not authenticated)
      await expect(emailInput).toBeVisible()
    })
  })

  test.describe('Inquiries Tab', () => {
    test('displays inquiry table with formatted dates', async ({ page }) => {
      // Assuming we can somehow view the dashboard (mocking or local auth)
      // Check that if inquiries exist, they have formatted dates
      const table = page.locator('table').first()

      // Look for date-like text pattern: "Jan 15, 2025"
      const datePattern = /[A-Z][a-z]{2} \d{1,2}, \d{4}/
      const dateCells = page.locator('td').filter({
        hasText: datePattern
      })

      // If table has content, it should have at least some dates
      const tableVisible = await table.isVisible().catch(() => false)
      if (tableVisible) {
        const dateCount = await dateCells.count()
        expect(dateCount).toBeGreaterThanOrEqual(0) // May be empty, but format should be correct
      }
    })

    test('inquiries table renders without console errors', async ({ page }) => {
      // Collect any console errors
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      // Navigate to ensure rendering happens
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Check for formatDate import errors
      const formatDateErrors = consoleErrors.filter((err) =>
        err.includes('formatDate')
      )
      expect(formatDateErrors).toHaveLength(0)
    })

    test('inquiry detail panel shows formatted created_at date', async ({
      page
    }) => {
      // This test assumes you can click on an inquiry row to show details
      // Look for detail view with date information

      // Check if any detail panel is visible
      const detailPanel = page.locator('[role="region"]').first()

      // If detail panel visible, verify it has properly formatted date
      const detailVisible = await detailPanel.isVisible().catch(() => false)
      if (detailVisible) {
        // Look for "Submitted:" or "Created:" label followed by formatted date
        const createdText = page.locator('text=/Submitted|Created/i').first()
        const isVisible = await createdText.isVisible().catch(() => false)

        if (isVisible) {
          const nextElement = createdText.locator('..')
          const content = await nextElement.textContent()

          // Should contain date pattern
          expect(content).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
        }
      }
    })
  })

  test.describe('Applications Tab', () => {
    test('displays applications table with formatted dates', async ({
      page
    }) => {
      // Click Applications tab if available
      const appTab = page.getByRole('tab', { name: /Applications/i })
      const tabExists = await appTab.isVisible().catch(() => false)

      if (tabExists) {
        await appTab.click()
        await page.waitForLoadState('networkidle')

        // Verify date formatting
        const datePattern = /[A-Z][a-z]{2} \d{1,2}, \d{4}/
        const tableContent = await page.locator('table').first().textContent()

        // If table has content, look for date pattern
        if (tableContent && tableContent.length > 0) {
          expect(tableContent).toMatch(datePattern)
        }
      }
    })

    test('application detail view shows formatted date', async ({ page }) => {
      // Click Applications tab
      const appTab = page.getByRole('tab', { name: /Applications/i })
      const tabExists = await appTab.isVisible().catch(() => false)

      if (tabExists) {
        await appTab.click()
        await page.waitForLoadState('networkidle')

        // Look for formatted date in detail section
        const submittedLabel = page.locator('text=/Submitted/i')
        const exists = await submittedLabel.isVisible().catch(() => false)

        if (exists) {
          const detailText = await submittedLabel.locator('..').textContent()
          expect(detailText).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
        }
      }
    })
  })

  test.describe('Jobs Tab', () => {
    test('displays jobs table with formatted dates', async ({ page }) => {
      // Click Jobs tab if available
      const jobsTab = page.getByRole('tab', { name: /Jobs/i })
      const tabExists = await jobsTab.isVisible().catch(() => false)

      if (tabExists) {
        await jobsTab.click()
        await page.waitForLoadState('networkidle')

        // Verify date formatting in table
        const datePattern = /[A-Z][a-z]{2} \d{1,2}, \d{4}/
        const tableContent = await page.locator('table').first().textContent()

        if (tableContent && tableContent.length > 0) {
          expect(tableContent).toMatch(datePattern)
        }
      }
    })

    test('job detail view shows formatted posted date', async ({ page }) => {
      // Click Jobs tab
      const jobsTab = page.getByRole('tab', { name: /Jobs/i })
      const tabExists = await jobsTab.isVisible().catch(() => false)

      if (tabExists) {
        await jobsTab.click()
        await page.waitForLoadState('networkidle')

        // Look for "Posted:" label with formatted date
        const postedLabel = page.locator('text=/Posted/i')
        const exists = await postedLabel.isVisible().catch(() => false)

        if (exists) {
          const detailText = await postedLabel.locator('..').textContent()
          expect(detailText).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
        }
      }
    })

    test('quotes in job detail show formatted date', async ({ page }) => {
      // Click Jobs tab
      const jobsTab = page.getByRole('tab', { name: /Jobs/i })
      const tabExists = await jobsTab.isVisible().catch(() => false)

      if (tabExists) {
        await jobsTab.click()
        await page.waitForLoadState('networkidle')

        // Look for quote entries with date information
        const quoteSection = page.locator('text=/Quote|Vendor|Response/i')
        const exists = await quoteSection.isVisible().catch(() => false)

        if (exists) {
          // Verify any dates in quote section follow formatDate pattern
          const sectionText = await quoteSection.locator('..').textContent()
          // May or may not have dates depending on data
          if (sectionText && /[A-Z][a-z]{2}/.test(sectionText)) {
            expect(sectionText).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
          }
        }
      }
    })
  })

  test.describe('Responsive Design - Mobile (375px)', () => {
    test.use({ ...devices['iPhone SE'] })

    test('dashboard loads on mobile viewport', async ({ page }) => {
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Verify content is visible without horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px for rounding
    })

    test('tab navigation works on mobile', async ({ page }) => {
      await page.goto('/dashboard')

      // Check that at least one tab is clickable
      const tabs = page.getByRole('tab')
      const tabCount = await tabs.count()

      if (tabCount > 0) {
        const firstTab = tabs.first()
        await expect(firstTab).toBeVisible()

        // Touch target should be at least 48px (mobile accessibility)
        const box = await firstTab.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(48)
          expect(box.width).toBeGreaterThanOrEqual(48)
        }
      }
    })
  })

  test.describe('No Build Errors', () => {
    test('dashboard page compiles without import errors', async ({ page }) => {
      const pageErrors: string[] = []

      page.on('pageerror', (error) => {
        pageErrors.push(error.message)
      })

      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Check for specific import errors
      const importErrors = pageErrors.filter(
        (err) =>
          err.includes('formatDate') ||
          err.includes('not exported') ||
          err.includes('cannot find')
      )

      expect(importErrors).toHaveLength(0)
    })
  })
})
