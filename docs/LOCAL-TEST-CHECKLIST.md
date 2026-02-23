# Local Testing Checklist (Pre-Push)

Run through this before every push to `main`.

## 0. Build & Lint
- [ ] `npm run build` — passes with no errors
- [ ] `npm run lint` — no errors (warnings OK)
- [ ] `npm run dev` — starts without crashing

## 1. Landing Page (`/`)
- [ ] Page loads, hero section renders
- [ ] Vendor carousel shows vendors (from Supabase, not empty)
- [ ] "Browse Vendors" CTA navigates to `/app`
- [ ] "List Your Cart" CTA navigates to `/vendors-guide/get-listed`
- [ ] FAQ section renders at bottom

## 2. Browse Vendors (`/app`)
- [ ] Vendor cards load from database
- [ ] Filter by suburb works
- [ ] Filter by vendor type works (mobile cart / coffee shop)
- [ ] "Get a Quote" button opens inquiry modal
- [ ] "View" button navigates to vendor detail page

## 3. Vendor Detail (`/vendors/[slug]`)
- [ ] Page loads with vendor info (name, specialty, suburbs, pricing)
- [ ] "Get a Quote" / inquiry button opens modal
- [ ] Submit inquiry form → success message appears
- [ ] Check Supabase `inquiries` table for new row
- [ ] Check console for email log (or inbox if Brevo configured)

## 4. Vendor Registration (`/vendors/register`)
- [ ] Form loads with 3 steps
- [ ] Can fill all fields and navigate between steps
- [ ] Submit → success message
- [ ] Check Supabase `vendor_applications` table for new row (status: pending)

## 5. Job Board (`/jobs`)
- [ ] Jobs list loads
- [ ] "Post a Job" navigates to `/jobs/create`
- [ ] Create job form → fill all fields → submit → success
- [ ] Check Supabase `jobs` table for new row

## 6. Job Detail & Quotes (`/jobs/[id]`)
- [ ] Job detail page loads
- [ ] "Submit a Quote" opens quote modal
- [ ] Submit quote → success message
- [ ] Check Supabase `quotes` table for new row
- [ ] Quote appears in job detail page

## 7. Coffee Shops (`/coffee-shops`)
- [ ] Page loads with coffee shop listings (if any exist in DB)
- [ ] Filters work (suburb, price, amenities)

## 8. Admin Portal (`/dashboard`)
- [ ] Page loads, shows login gate
- [ ] Enter whitelisted email → check console for 6-digit code
- [ ] Enter code → access granted
- [ ] **Inquiries tab:** loads data, can change status
- [ ] **Applications tab:** loads data, can approve/reject
- [ ] **Jobs tab:** loads data, can view quotes

## 9. Content Pages
- [ ] `/contractors/how-to-hire` — loads, content renders
- [ ] `/contractors/coffee-cart-costs` — loads (if exists)
- [ ] `/vendors-guide/get-listed` — loads, CTA to register works

## 10. Blog (if Payload CMS is active)
- [ ] `/blog` — loads without errors
- [ ] `/blog/[slug]` — individual post loads (if posts exist)

---

**Quick pass (5 min):** Items 0, 1, 2, 3, 8  
**Full pass (20 min):** All items
