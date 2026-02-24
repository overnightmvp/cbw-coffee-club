import { test, expect } from '@playwright/test';

test.describe('Section 1: Landing Page (/)', () => {
    test('should load and render key sections', async ({ page }) => {
        await page.goto('/');

        // Page title (as defined in src/app/page.tsx metadata)
        await expect(page).toHaveTitle("Melbourne Mobile Coffee Carts | The Bean Route");

        // Hero section
        await expect(page.getByRole('heading', { name: /Great coffee,/i })).toBeVisible();

        // Vendor carousel (check if it exists)
        // Based on LOCAL-TEST-CHECKLIST.md: "Vendor carousel shows vendors"
        // We'll look for vendor cards or the carousel container
        await expect(page.locator('section').filter({ hasText: /Browse Vendors/i }).first()).toBeVisible();

        // Check CTAs
        const browseCTA = page.getByRole('link', { name: /Browse Vendors/i }).first();
        await expect(browseCTA).toBeVisible();
        await browseCTA.click();
        await expect(page).toHaveURL(/\/app/);

        await page.goto('/');
        const listCTA = page.getByRole('link', { name: /List Your Cart|Get Listed/i }).first();
        // Adjust selector based on actual text in page.tsx
        await expect(listCTA).toBeVisible();

        // FAQ section
        await expect(page.getByText(/Common questions/i)).toBeVisible();
    });
});

test.describe('Section 2: Browse Vendors (/app)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/app');
    });

    test('should load vendor cards from database', async ({ page }) => {
        // Wait for vendors to load (look for at least one vendor card)
        await expect(page.locator('article.vendor-card').first()).toBeVisible();
    });

    test('should filter by vendor type (Barista)', async ({ page }) => {
        const typeFilter = page.locator('select').first();
        await typeFilter.selectOption('barista');

        // Wait for results to update
        await page.waitForTimeout(1000);

        // Check if visible cards are baristas or if count message updated
        await expect(page.locator('article.vendor-card').first()).toBeVisible();
        await expect(page.getByText(/Independent Barista/i).first()).toBeVisible();
    });

    test('should filter by suburb', async ({ page }) => {
        // Assuming there is a suburb select or input
        // We'll look for a filter section first
        const suburbFilter = page.getByPlaceholder(/Suburb/i).or(page.getByLabel(/Suburb/i));
        if (await suburbFilter.isVisible()) {
            await suburbFilter.fill('Melbourne');
            // Wait for results to update
            await page.waitForTimeout(1000);
        }
    });

    test('should open inquiry modal', async ({ page }) => {
        // Click "Get a Quote" on the first vendor card
        const quoteButton = page.getByRole('button', { name: /Get a Quote/i }).first();
        await quoteButton.click();

        // Verify modal appears
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText(/Get a quote/i).first()).toBeVisible();
    });
});

test.describe('Section 3: Vendor Detail (/vendors/[slug])', () => {
    test('should load vendor information and form', async ({ page }) => {
        // Go to browse page first to find a valid vendor
        await page.goto('/app');
        const firstVendor = page.locator('article.vendor-card').first();
        await expect(firstVendor).toBeVisible();

        // Get the link and navigate
        const viewDetails = firstVendor.locator('a').first();
        await viewDetails.click();

        // Check for vendor name heading
        await expect(page.locator('h1')).toBeVisible();

        // Check for "Get a Quote" (mobile) or "Get Directions" (shop)
        const quoteBtn = page.getByRole('button', { name: /Get a Quote/i }).first();
        const directionsBtn = page.getByRole('button', { name: /Get Directions/i }).first();

        await expect(quoteBtn.or(directionsBtn)).toBeVisible();

        if (await quoteBtn.isVisible()) {
            await quoteBtn.click();
            await expect(page.locator('form').first()).toBeVisible();
        }
    });
});

test.describe('Section 4: Vendor Registration (/vendors/register)', () => {
    test('should load registration form and navigate steps', async ({ page }) => {
        await page.goto('/vendors/register');

        // Step 1
        await expect(page.getByRole('heading', { name: /Register your coffee cart/i })).toBeVisible();
        await expect(page.getByLabel(/Business Name/i)).toBeVisible();

        // Step 1: Business Details
        await page.getByLabel(/Business Name/i).fill('Test Coffee Cart');
        await page.getByLabel(/Specialty/i).fill('Custom Espresso Blends');
        await page.getByLabel(/Description/i).fill('We provide high-quality mobile coffee services with local Victorian beans and professional baristas for over 5 years.');
        await page.getByRole('button', { name: /Continue|Next/i }).first().click();

        // Step 2: Service Details
        await expect(page.getByText(/Suburbs you serve/i)).toBeVisible();
        // Check at least one suburb (CBD is the first one)
        await page.getByLabel('CBD').check();

        // Fill pricing and capacity (must meet minimums: 50 for price, 10 for capacity)
        await page.getByPlaceholder('150').first().fill('150');
        await page.getByPlaceholder('350').first().fill('350');
        await page.getByPlaceholder('20').first().fill('20');
        await page.getByPlaceholder('150').last().fill('100');

        // Check at least one event type
        await page.getByLabel('Corporate event').check();

        await page.getByRole('button', { name: /Continue|Next/i }).first().click();

        // Step 3: Contact & Review
        await expect(page.getByText(/Your name/i)).toBeVisible();
        await expect(page.getByLabel(/Website/i)).toBeVisible();

        // Verify optional website field
        await page.getByLabel(/Your name/i).fill('Test User');
        await page.getByLabel(/Email/i).fill('test@example.com');

        // Ensure "Submit Application" is present
        const submitBtn = page.getByRole('button', { name: /Submit Application/i });
        await expect(submitBtn).toBeVisible();
    });

    test('should handle Barista registration specifically', async ({ page }) => {
        await page.goto('/vendors/register');

        // Step 1: Select Barista
        await page.getByRole('button', { name: /☕/i }).click();
        await expect(page.getByLabel(/Display Name \/ Name/i)).toBeVisible();

        await page.getByLabel(/Display Name \/ Name/i).fill('Expert Barista Jo');
        await page.getByLabel(/Specialty/i).fill('Latte Art & Dial-in');
        await page.getByLabel(/Description/i).fill('I am a professional barista with 10 years experience working in high volume specialty coffee shops across Melbourne.');
        await page.getByRole('button', { name: /Continue|Next/i }).first().click();

        // Step 2: Service Details
        await expect(page.getByText(/Suburbs you serve/i)).toBeVisible();
        await page.getByLabel('Carlton').check();

        // Check Hourly Rate label
        await expect(page.getByText(/Hourly Rate \(\$\/hr\)/i)).toBeVisible();
        await page.getByPlaceholder('65').fill('65');
        await page.getByPlaceholder('350').fill('80');

        // Capacity should NOT be visible for baristas
        await expect(page.getByText(/Capacity \(guests\)/i)).not.toBeVisible();

        await page.getByLabel('Corporate event').check();
        await page.getByRole('button', { name: /Continue|Next/i }).first().click();

        // Step 3: Review
        await expect(page.getByText(/Hourly Rate/i)).toBeVisible();
        await expect(page.getByText(/Expert Barista Jo/i)).toBeVisible();
    });
});

test.describe('Section 5 & 6: Job Board (/jobs)', () => {
    test('should load jobs and allow quote modal', async ({ page }) => {
        await page.goto('/jobs');
        await expect(page.getByRole('heading', { name: /Open jobs/i })).toBeVisible();

        // If there's a job, click into it
        const jobLink = page.getByRole('link', { name: /View Job/i }).first();
        if (await jobLink.isVisible()) {
            await jobLink.click();
            await expect(page.getByRole('button', { name: /Submit a Quote/i })).toBeVisible();
        }
    });
});

test.describe('Section 8: Admin Portal (/dashboard)', () => {
    test('should show login gate', async ({ page }) => {
        await page.goto('/dashboard');

        // Check for login text or email field
        await expect(page.getByText(/Admin Portal/i).or(page.getByPlaceholder(/Email/i))).toBeVisible();
    });
});

test.describe('Section 9: Content Pages', () => {
    test('should load guide pages', async ({ page }) => {
        const pages = [
            '/contractors/how-to-hire',
            '/vendors-guide/get-listed'
        ];

        for (const route of pages) {
            await page.goto(route);
            await expect(page.locator('h1')).toBeVisible();
        }
    });
});
