# Responsive Testing Guide - The Bean Route

## Quick Start

```bash
# Run automated test script
npm run test:responsive

# Test specific URL
npm run test:responsive -- --url=http://localhost:3000/app

# Manual testing in browser
npm run dev
# Open DevTools → Toggle device toolbar (Cmd+Shift+M)
```

## Testing Checklist

### ✅ Mobile (320px - 767px)

**Header:**
- [ ] Hamburger menu appears
- [ ] Menu opens/closes smoothly
- [ ] Menu closes on navigation
- [ ] Logo remains visible

**Filters (/app page):**
- [ ] Filters stack in grid (2 columns on phone)
- [ ] Clear button appears on its own row
- [ ] Dropdowns are touch-friendly (44px min)

**Vendor Cards:**
- [ ] Cards display single column
- [ ] Images maintain aspect ratio
- [ ] Buttons are full width or prominent
- [ ] Text is readable (14px minimum)

**Modals:**
- [ ] Modal takes up screen with padding
- [ ] Scrollable if content is long
- [ ] Close button easy to tap (44x44px)
- [ ] Forms stack vertically
- [ ] Backdrop closes modal on click

### ✅ Tablet (768px - 1023px)

**Header:**
- [ ] Full navigation appears
- [ ] No hamburger menu

**Filters:**
- [ ] 3-column grid layout
- [ ] Clear button inline with filters

**Vendor Cards:**
- [ ] 2-column grid

**Modals:**
- [ ] Centered with max-width
- [ ] Forms use 2-column grid where appropriate

### ✅ Desktop (1024px+)

**Header:**
- [ ] Full navigation with proper spacing

**Filters:**
- [ ] 4-column grid (3 filters + clear button)

**Vendor Cards:**
- [ ] 3-column grid
- [ ] Hover effects work

**Modals:**
- [ ] Centered, max-width 600px
- [ ] Multi-column form layouts

## Browser DevTools Testing

### Chrome/Edge DevTools

1. **Open DevTools**: `Cmd+Option+I` (Mac) or `F12` (Windows)
2. **Toggle Device Mode**: Click device icon or `Cmd+Shift+M`
3. **Select Device**: Choose from presets or enter custom dimensions
4. **Test Interactions**: Click, scroll, tap

**Recommended Test Devices:**
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad Air (820x1180)
- Nest Hub (1024x600)

### Firefox Responsive Design Mode

1. **Open RDM**: `Cmd+Option+M` (Mac) or `Ctrl+Shift+M` (Windows)
2. **Choose preset** or enter custom size
3. **Rotate device** to test landscape

## Common Responsive Issues

### Issue: Text Too Small on Mobile
**Check:** Font sizes < 14px
**Fix:** Use `text-sm` (14px) minimum, `text-base` (16px) preferred

### Issue: Buttons Too Small
**Check:** Touch targets < 44x44px
**Fix:** Use `min-h-[44px]` and `px-4` minimum padding

### Issue: Horizontal Scroll
**Check:** Elements wider than viewport
**Fix:** Use `max-w-full` or `w-full` on containers

### Issue: Overlapping Elements
**Check:** Fixed positioning or negative margins
**Fix:** Use responsive spacing (`mt-4 md:mt-8`)

### Issue: Modal Off-Screen
**Check:** Modal too tall for viewport
**Fix:** Use `max-h-[90vh] overflow-y-auto`

## Tailwind Breakpoints

```css
/* Mobile first approach */
.class              /* 0px - applies to all */
sm:class            /* 640px+ */
md:class            /* 768px+ */
lg:class            /* 1024px+ */
xl:class            /* 1280px+ */
2xl:class           /* 1536px+ */
```

## Testing Workflow

1. **Start Dev Server**: `npm run dev`
2. **Run Automated Tests**: `npm run test:responsive`
3. **Manual Browser Test**:
   - Open http://localhost:3000
   - Toggle device mode
   - Test each route
4. **Real Device Test** (if possible):
   - iPhone/Android phone
   - iPad/Android tablet
5. **Record Issues**: Create GitHub issues for bugs found

## Performance Tips

- Images should be optimized (use Next.js Image component)
- Lazy load below-the-fold content
- Minimize layout shift (CLS)
- Use appropriate image sizes for each breakpoint

## Accessibility Notes

- Touch targets: 44x44px minimum (WCAG 2.1)
- Text contrast: 4.5:1 minimum
- Font size: 16px minimum for body text
- Focus indicators visible on all interactive elements

## Files Modified for Responsive

- `src/components/navigation/Header.tsx` - Mobile menu auto-close
- `src/app/app/page.tsx` - Improved filter grid layout
- `src/components/booking/SimpleBookingModal.tsx` - Backdrop click close
- `src/components/jobs/QuoteModal.tsx` - Backdrop click close

## Next Steps

1. Run `npm run test:responsive` after any layout changes
2. Test on real devices before major releases
3. Use Lighthouse CI for automated testing
4. Monitor Core Web Vitals in production
