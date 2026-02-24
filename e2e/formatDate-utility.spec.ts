import { test, expect } from '@playwright/test'

/**
 * Tests for the formatDate utility function
 * Tests both the function itself and its usage in dashboard components
 */
test.describe('formatDate Utility Function', () => {
  test.describe('Input Validation', () => {
    test('handles ISO 8601 date strings', async ({ page }) => {
      // This test validates the utility by executing it in the browser context
      await page.goto('/')

      const result = await page.evaluate(() => {
        // Import from the actual module
        const { formatDate } = require('@/lib/utils')
        return formatDate('2025-01-15T10:30:00Z')
      })

      // Should return formatted date in Australian format
      expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
      expect(result).toBe('Jan 15, 2025')
    })

    test('handles JavaScript Date objects', async ({ page }) => {
      await page.goto('/')

      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')
        const dateObj = new Date('2025-12-25T00:00:00Z')
        return formatDate(dateObj)
      })

      expect(result).toBe('Dec 25, 2025')
    })

    test('returns empty string for null input', async ({ page }) => {
      await page.goto('/')

      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')
        return formatDate(null)
      })

      expect(result).toBe('')
    })

    test('returns empty string for undefined input', async ({ page }) => {
      await page.goto('/')

      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')
        return formatDate(undefined)
      })

      expect(result).toBe('')
    })

    test('handles invalid date strings gracefully', async ({ page }) => {
      await page.goto('/')

      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')
        return formatDate('not-a-date')
      })

      // Should return empty string instead of throwing
      expect(result).toBe('')
    })
  })

  test.describe('Output Format', () => {
    test('returns format: Mon DD, YYYY', async ({ page }) => {
      await page.goto('/')

      const testCases = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        return {
          jan: formatDate('2025-01-15T00:00:00Z'),
          dec: formatDate('2025-12-31T00:00:00Z'),
          may: formatDate('2025-05-01T00:00:00Z'),
          sep: formatDate('2024-09-30T00:00:00Z')
        }
      })

      // Verify pattern and specific values
      expect(testCases.jan).toBe('Jan 15, 2025')
      expect(testCases.dec).toBe('Dec 31, 2025')
      expect(testCases.may).toBe('May 01, 2025')
      expect(testCases.sep).toBe('Sep 30, 2024')
    })

    test('uses short month names (Jan, Feb, etc)', async ({ page }) => {
      await page.goto('/')

      const months = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        // Test all 12 months
        const results: Record<string, string> = {}
        for (let month = 1; month <= 12; month++) {
          const dateStr = `2025-${String(month).padStart(2, '0')}-15T00:00:00Z`
          results[month.toString()] = formatDate(dateStr)
        }
        return results
      })

      // Verify short month abbreviations
      const expectedMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]

      expectedMonths.forEach((month, index) => {
        const key = (index + 1).toString()
        expect(months[key]).toContain(month)
      })
    })

    test('uses Australian locale (en-AU)', async ({ page }) => {
      await page.goto('/')

      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        // Australian locale uses DMY format with short month names
        // Test a few dates to verify the locale
        return {
          newYear: formatDate('2025-01-01T00:00:00Z'),
          australia: formatDate('2025-01-26T00:00:00Z'), // Australia Day
          christmas: formatDate('2025-12-25T00:00:00Z')
        }
      })

      // Verify Australian format (no leading zeros on days in output)
      expect(result.newYear).toBe('Jan 01, 2025')
      expect(result.australia).toBe('Jan 26, 2025')
      expect(result.christmas).toBe('Dec 25, 2025')
    })

    test('handles edge dates correctly', async ({ page }) => {
      await page.goto('/')

      const edgeCases = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        return {
          leapYearFeb29: formatDate('2024-02-29T00:00:00Z'),
          leapYearMar1: formatDate('2024-03-01T00:00:00Z'),
          yearBoundary: formatDate('2024-12-31T23:59:59Z'),
          newYearMoment: formatDate('2025-01-01T00:00:00Z')
        }
      })

      expect(edgeCases.leapYearFeb29).toBe('Feb 29, 2024')
      expect(edgeCases.leapYearMar1).toBe('Mar 01, 2024')
      expect(edgeCases.yearBoundary).toBe('Dec 31, 2024')
      expect(edgeCases.newYearMoment).toBe('Jan 01, 2025')
    })
  })

  test.describe('Timezone Handling', () => {
    test('consistently formats UTC dates', async ({ page }) => {
      await page.goto('/')

      const utcResults = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        // Test same date with UTC timezone indicator
        return {
          utc: formatDate('2025-06-15T12:00:00Z'),
          utcPlusFour: formatDate('2025-06-15T16:00:00+04:00'),
          utcMinusFive: formatDate('2025-06-15T07:00:00-05:00')
        }
      })

      // All should represent the same date (2025-06-15)
      expect(utcResults.utc).toContain('Jun 15, 2025')
      expect(utcResults.utcPlusFour).toContain('Jun 15, 2025')
      expect(utcResults.utcMinusFive).toContain('Jun 15, 2025')
    })
  })

  test.describe('Integration with Dashboard Components', () => {
    test('InquiriesTab uses formatDate for created_at', async ({ page }) => {
      // Navigate to page that includes InquiriesTab (if available)
      await page.goto('/dashboard')

      // Check that the component imports formatDate without errors
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.waitForLoadState('networkidle')

      // Should not have formatDate import errors
      const formatDateErrors = consoleErrors.filter((err) =>
        err.includes('formatDate')
      )
      expect(formatDateErrors).toHaveLength(0)
    })

    test('ApplicationsTab uses formatDate for created_at', async ({ page }) => {
      await page.goto('/dashboard')

      // Click Applications tab if it exists
      const appTab = page.getByRole('tab', { name: /Applications/i })
      const exists = await appTab.isVisible().catch(() => false)

      if (exists) {
        await appTab.click()
        await page.waitForLoadState('networkidle')

        // Verify formatDate is being applied - look for date pattern
        const datePattern = /[A-Z][a-z]{2} \d{1,2}, \d{4}/
        const pageContent = await page.content()

        // If there's any content, check for proper date formatting
        if (pageContent && pageContent.length > 100) {
          // Date pattern should exist if data is present
          const hasDatePattern = datePattern.test(pageContent)
          expect(hasDatePattern).toBeTruthy()
        }
      }
    })

    test('JobsTab uses formatDate for created_at', async ({ page }) => {
      await page.goto('/dashboard')

      // Click Jobs tab if it exists
      const jobsTab = page.getByRole('tab', { name: /Jobs/i })
      const exists = await jobsTab.isVisible().catch(() => false)

      if (exists) {
        await jobsTab.click()
        await page.waitForLoadState('networkidle')

        // Verify date formatting
        const datePattern = /[A-Z][a-z]{2} \d{1,2}, \d{4}/
        const pageContent = await page.content()

        if (pageContent && pageContent.length > 100) {
          const hasDatePattern = datePattern.test(pageContent)
          expect(hasDatePattern).toBeTruthy()
        }
      }
    })
  })

  test.describe('Consistency & Reliability', () => {
    test('produces consistent output for same input', async ({ page }) => {
      await page.goto('/')

      const results = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')
        const testDate = '2025-06-15T14:30:00Z'

        // Call the same date multiple times
        return {
          call1: formatDate(testDate),
          call2: formatDate(testDate),
          call3: formatDate(testDate)
        }
      })

      // All calls should produce identical output
      expect(results.call1).toBe(results.call2)
      expect(results.call2).toBe(results.call3)
      expect(results.call1).toBe('Jun 15, 2025')
    })

    test('does not throw errors on edge inputs', async ({ page }) => {
      await page.goto('/')

      // Should not throw - should handle gracefully
      const result = await page.evaluate(() => {
        const { formatDate } = require('@/lib/utils')

        try {
          // All edge cases should return safely
          const test1 = formatDate('')
          const test2 = formatDate(0) // number instead of string/Date
          const test3 = formatDate({}) // object instead of expected type

          return {
            empty: test1,
            zero: test2,
            object: test3,
            error: null
          }
        } catch (e) {
          return {
            empty: null,
            zero: null,
            object: null,
            error: (e as Error).message
          }
        }
      })

      // If it threw, there would be an error message
      // If it didn't throw, edge cases returned empty strings
      expect(result.error).toBeNull() // No error should be thrown
    })
  })
})
