# Payload CMS Entry Guide: Venue Spotlight Posts

## Overview

This guide provides step-by-step instructions for manually entering the 10 venue spotlight posts into Payload CMS. Each post has been drafted as markdown and now needs to be published in the Posts collection.

**Estimated Time:** 5-7 minutes per post (50-70 minutes total for all 10)

**Prerequisites:**
- Access to Payload CMS admin at `/admin`
- Admin authentication credentials
- Familiarity with Lexical rich text editor
- Featured images prepared (or placeholders documented)

---

## Quick Reference: 10 Spotlight Posts

| # | Slug | Business Name | Status | Word Count |
|---|------|---------------|--------|------------|
| 01 | artisan-espresso-chadstone | Artisan Espresso Co. | ✅ Verified | ~1,150 |
| 02 | mobile-brew-fountain-gate | Mobile Brew | ⚠️ Needs verification | ~1,120 |
| 03 | coffee-culture-westfield | Coffee Culture Café | ✅ Verified | ~1,180 |
| 04 | bean-cart-glen-iris | Bean & Cart Co. | ⚠️ Needs verification | ~1,210 |
| 05 | espresso-express-malvern | Espresso Express | ⚠️ Needs verification | ~1,175 |
| 06 | roaming-roasters-oakleigh | Roaming Roasters | ⚠️ Needs verification | ~1,190 |
| 07 | brew-hub-chadstone | Brew Hub | ⚠️ Needs verification | ~1,185 |
| 08 | cup-cart-fountain-gate | Cup & Cart | ⚠️ Needs verification | ~1,195 |
| 09 | java-junction-glen-iris | Java Junction | ⚠️ Needs verification | ~1,180 |
| 10 | percolate-malvern | Percolate | ⚠️ Needs verification | ~1,230 |

**IMPORTANT:** Posts marked "⚠️ Needs verification" should have status set to 'draft' in Payload until business details are verified. Only publish verified posts (01 and 03) initially.

---

## Step-by-Step Entry Process

### Step 1: Access Payload Admin

1. Navigate to `http://localhost:3000/admin` (development) or `https://yourdomain.com/admin` (production)
2. Log in with admin credentials
3. Click "Posts" in the left sidebar navigation
4. Click "Create New" button (top right)

### Step 2: Fill Standard Fields

**Title:**
- Copy the `title` value from markdown frontmatter
- Example: "Artisan Espresso Co.: Award-Winning Specialty Coffee Cart in Chadstone | The Bean Route"
- Keep the " | The Bean Route" suffix for SEO branding

**Slug:**
- Payload auto-generates from title, or manually enter the `slug` from frontmatter
- Example: `artisan-espresso-chadstone`
- Ensure slug matches internal linking references in other posts

**Excerpt:**
- Copy the `meta_description` from frontmatter (150-160 characters)
- This becomes the post excerpt and meta description
- Example: "Discover Artisan Espresso Co., Chadstone's premium mobile coffee cart serving specialty coffee and award-winning latte art for weddings, corporate events, and private functions."

### Step 3: Convert Markdown Content to Lexical

**Converting Markdown to Lexical:**

Payload uses the Lexical rich text editor. You cannot paste raw markdown directly. Follow this process:

1. **Copy Content Section by Section:**
   - Copy one section at a time from the markdown file
   - Paste into Lexical editor (it will convert to plain text)
   - Apply formatting using Lexical toolbar

2. **Heading Conversion:**
   - Markdown `# Heading` → Select text, choose "Heading 1" from dropdown
   - Markdown `## Heading` → Select text, choose "Heading 2" from dropdown
   - Markdown `### Heading` → Select text, choose "Heading 3" from dropdown

3. **Paragraph Formatting:**
   - Markdown paragraphs paste as plain text → No action needed (default is paragraph)
   - Bold text: Select text, click **B** button or use Ctrl/Cmd + B
   - Italic text: Select text, click *I* button or use Ctrl/Cmd + I

4. **Link Insertion:**
   - Markdown `[text](url)` → Select text, click link icon, paste URL
   - For internal links (like "best-coffee-carts-chadstone"), use placeholder URL: `/blog/best-coffee-carts-chadstone` (will be updated after those posts are published)
   - For vendor profile links, use: `/vendors/[vendor-slug]`

5. **List Conversion:**
   - Markdown bulleted lists → Select lines, click bullet list button
   - Markdown numbered lists → Select lines, click numbered list button

**Pro Tip:** Work section by section (Introduction, About, Menu, Pricing, Why Choose, How to Book, Conclusion) to maintain structure.

### Step 4: Featured Image Upload

**For Verified Venues (01, 03):**
1. Click "Featured Image" upload field
2. Upload high-quality image (recommended: 1200x630px, under 300KB)
3. Add alt text: "[Business Name] mobile coffee cart" or "[Business Name] café interior"
4. If no image available yet: Document placeholder in notes field

**For Unverified Venues (02, 04-10):**
1. Use generic coffee cart/café stock images temporarily
2. Document in internal notes: "PLACEHOLDER IMAGE - replace with vendor photo after verification"
3. Or leave empty and add featured images after vendor verification

**Image Sources (if needed):**
- Vendor Instagram/Facebook (request permission first)
- Stock photo sites: Unsplash, Pexels (search "coffee cart", "mobile barista", "specialty coffee")
- Generic placeholder: Use a high-quality coffee cart image with note "Generic placeholder pending vendor photo"

### Step 5: Set Status and Publishing

**Status Field:**
- **Verified venues (01, 03):** Select `published`
- **Unverified venues (02, 04-10):** Select `draft` (human review required before publishing)

**Published At:**
- For published posts: Set to current date/time or stagger by 1 day for SEO publishing cadence
- For draft posts: Leave empty (will be set when status changes to published)

**Publishing Cadence Recommendation:**
- Day 1: Post 01 (Artisan Espresso Co.)
- Day 2: Post 03 (Coffee Culture Café)
- Day 3-12: Posts 02, 04-10 (after verification, publish 1 per day)

### Step 6: Category & Conversion Goal

**Category:**
- Select `event-focused` (all venue spotlights are event-focused content)
- This affects how posts are grouped on `/blog` page

**Conversion Goal:**
- Select `vendor_signup` (spotlights drive vendor discovery → inquiries → potential vendor signups)

### Step 7: SEO Fields

**Target Keywords:**
- Click "Add Keyword" for each keyword from frontmatter `keywords` array
- Example for Artisan Espresso Co.:
  - "Artisan Espresso Chadstone"
  - "mobile coffee cart Chadstone"
  - "specialty coffee Chadstone"
  - "hire coffee cart Melbourne"
  - "wedding coffee cart Chadstone"
- Limit to 3-5 most important keywords per post

**Search Intent:**
- Enter a concise search intent statement
- Template: "Find and book [Business Name] for [event type] in [suburb]"
- Example: "Find and book Artisan Espresso Co. for weddings and events in Chadstone"

**Meta Description:**
- Auto-populated from Excerpt field (no need to re-enter)
- Verify it's 150-160 characters for optimal SEO

**OG Image (Open Graph):**
- Select same image as Featured Image
- This is the image shown when post is shared on social media

### Step 8: Editorial Metadata

**Priority:**
- Select `quick-win`
- Venue spotlights are low-difficulty content that can rank quickly for brand-name keywords

**Difficulty:**
- Select `low`
- Brand-name keywords (e.g., "Artisan Espresso Chadstone") are easy to rank for

**Traffic Potential:**
- Enter `10-50`
- Individual spotlights have low traffic but aggregate value across 10 posts is significant

### Step 9: Internal Linking

**Internal Links Field:**
- Click "Add Internal Link"
- Search for posts by slug from the internal linking matrix
- For Post 01 (Artisan Espresso Co.), add:
  - `best-coffee-carts-chadstone` (if exists, otherwise note as TODO)
  - `hire-coffee-cart-guide` (if exists, otherwise note as TODO)
  - `specialty-coffee-benefits` (if exists, otherwise note as TODO)

**IMPORTANT:** If target posts don't exist yet (they'll be created in Plan 01-03 and 01-04):
1. Document in internal notes field: "TODO: Add internal links after Plan 01-03 completes"
2. Return to this post after location guides and how-to guides are published
3. Add internalLinks references via Payload admin

**Related Posts:**
- Leave empty (auto-populated by Payload based on category and tags)

### Step 10: Save and Preview

1. Click "Save" button (top right) to save as draft
2. Click "Preview" to see how the post renders on `/blog/[slug]`
3. Verify:
   - ✅ RichTextRenderer displays content correctly
   - ✅ Headings are properly formatted (H1, H2, H3)
   - ✅ Links work (internal and external)
   - ✅ Images display (if uploaded)
   - ✅ SEO metadata appears in page <head>
4. Return to edit if issues found
5. Click "Publish" to change status from draft to published (only for verified posts)

---

## Batch Entry Tips for Efficiency

### Template Approach (Recommended)

1. **Create First Post Completely:** Enter Post 01 (Artisan Espresso Co.) following all steps above
2. **Duplicate for Similar Posts:** Many fields are identical across all spotlights:
   - Category: `event-focused` (same for all)
   - Conversion Goal: `vendor_signup` (same for all)
   - Priority: `quick-win` (same for all)
   - Difficulty: `low` (same for all)
   - Traffic Potential: `10-50` (same for all)

3. **Prepare Content in Batches:**
   - Convert markdown to text for 2-3 posts before starting Payload entry
   - Have all featured images ready in a folder
   - Create spreadsheet with SEO keywords for quick copy/paste

### Common Pitfalls to Avoid

1. **Forgetting to Set Status:** Always set status to `draft` for unverified posts
2. **Skipping Alt Text:** Featured images need alt text for accessibility and SEO
3. **Incomplete Internal Links:** Document TODOs for posts that don't exist yet
4. **Inconsistent Slugs:** Ensure slugs match exactly what's referenced in internal links
5. **Missing Keywords:** Target keywords array must be populated for SEO tracking

### Quality Checklist (Per Post)

Before clicking "Publish," verify:
- [ ] Title includes business name and "| The Bean Route" suffix
- [ ] Slug matches markdown filename and internal link references
- [ ] Excerpt is 150-160 characters
- [ ] Content is fully formatted in Lexical (headings, paragraphs, links, lists)
- [ ] Featured image uploaded with alt text (or placeholder documented)
- [ ] Status set correctly (published for verified, draft for unverified)
- [ ] Category = `event-focused`
- [ ] Conversion Goal = `vendor_signup`
- [ ] 3-5 target keywords added
- [ ] Search intent documented
- [ ] Internal links added (or TODOs documented)
- [ ] Preview renders correctly without errors

---

## Post-Publication Tasks

### After All 10 Posts Entered

1. **Verify Blog Listing:**
   - Navigate to `/blog`
   - Confirm published posts appear in "Event Planning Guides" section
   - Verify filtering and sorting work correctly

2. **Test Individual Post Pages:**
   - Visit `/blog/[slug]` for each published post
   - Check RichTextRenderer displays content properly
   - Verify internal links resolve (no 404s)
   - Test social share preview (Open Graph meta tags)

3. **Update Internal Links (After Plan 01-03 Completes):**
   - Return to all 10 spotlight posts
   - Add internal links to newly published location guides
   - Remove "TODO" notes from internal notes field

4. **Update REQUIREMENTS.md Traceability:**
   - Mark CONTENT-03 and CONTENT-04 requirements as complete
   - Add links to published posts in requirements traceability table

5. **SEO Verification:**
   - Submit updated sitemap to Google Search Console
   - Verify meta descriptions appear in search results (takes 1-2 weeks)
   - Monitor Google Analytics for early traffic signals

---

## Troubleshooting Common Issues

### Issue: Lexical Editor Not Formatting Correctly

**Solution:**
- Clear browser cache and reload Payload admin
- Try different browser (Chrome/Firefox work best with Payload)
- If formatting breaks, delete and re-enter content section

### Issue: Featured Image Upload Fails

**Solution:**
- Check image file size (must be under 5MB)
- Verify image format (JPG, PNG, WebP supported)
- Compress image using tinypng.com or similar
- Check server upload limits in Payload config

### Issue: Internal Links Don't Show Dropdown

**Solution:**
- Ensure target posts exist and are published (or in draft)
- Check Posts collection relationship configuration in `src/collections/Posts.ts`
- Verify internalLinks field is properly configured as relationship type

### Issue: Preview Shows 404 Error

**Solution:**
- Verify slug is unique and follows kebab-case format
- Check Next.js dynamic route exists at `src/app/blog/[slug]/page.tsx`
- Restart dev server if using local development
- Clear Next.js cache: `rm -rf .next && npm run dev`

---

## Reference: Markdown File Locations

All venue spotlight markdown drafts are located in:
```
/docs/content-strategy/venue-spotlights/
```

Files:
- `01-artisan-espresso-chadstone.md`
- `02-mobile-brew-fountain-gate.md`
- `03-coffee-culture-westfield.md`
- `04-bean-cart-glen-iris.md`
- `05-espresso-express-malvern.md`
- `06-roaming-roasters-oakleigh.md`
- `07-brew-hub-chadstone.md`
- `08-cup-cart-fountain-gate.md`
- `09-java-junction-glen-iris.md`
- `10-percolate-malvern.md`

---

## Next Steps After Manual Entry

1. **Verify 2 Published Posts Are Live:**
   - Check `/blog/artisan-espresso-chadstone`
   - Check `/blog/coffee-culture-westfield`

2. **Begin Venue Verification for Remaining 8:**
   - Google Maps research: "mobile coffee carts [suburb]"
   - Instagram/Facebook: Search business names, verify existence
   - Contact vendors for permission and photos
   - Update post status to `published` after verification

3. **Create Location Guides (Plan 01-03):**
   - 7 location guide posts will link to these spotlights
   - Complete Plan 01-03 before adding full internal links

4. **Monitor Performance:**
   - Track post views in Google Analytics
   - Monitor search impressions in Google Search Console
   - Review bounce rate and time on page for content quality signals

---

**Total Time Investment:** 50-70 minutes for all 10 posts (5-7 minutes per post average)

**Difficulty:** Low-Medium (requires familiarity with Lexical editor but straightforward process)

**Outcome:** 10 venue spotlight posts ready for publication (2 immediately, 8 after verification)
