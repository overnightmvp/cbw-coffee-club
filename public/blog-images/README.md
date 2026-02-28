# Blog Images Directory

This directory contains all blog-related images organized by purpose.

## Directory Structure

```
blog-images/
├── hero/          # Featured images for blog posts (1200x630px)
├── thumbnails/    # Card images for blog listings (600x400px)
├── authors/       # Author avatar images (200x200px)
└── fallback.jpg   # Default image when post has no featured image
```

## Image Specifications

### Hero Images (`hero/`)
- **Dimensions:** 1200x630px (OpenGraph standard)
- **Format:** JPG or PNG
- **Quality:** 85%
- **Usage:** Featured images at top of blog posts, social sharing
- **Naming:** `{post-slug}.jpg` (e.g., `hire-coffee-cart-melbourne.jpg`)

### Thumbnails (`thumbnails/`)
- **Dimensions:** 600x400px (3:2 aspect ratio)
- **Format:** JPG or PNG
- **Quality:** 85%
- **Usage:** Blog listing cards
- **Naming:** `{post-slug}-thumb.jpg`

### Author Avatars (`authors/`)
- **Dimensions:** 200x200px (square)
- **Format:** JPG or PNG
- **Quality:** 90%
- **Usage:** Author bylines, sidebar widgets
- **Naming:** `{author-id}.jpg` (e.g., `sarah-chen.jpg`, `bean-route-logo.png`)

### Fallback Image
- **File:** `fallback.jpg`
- **Dimensions:** 1200x630px
- **Usage:** Default when post has no `featuredImage` in frontmatter
- **Suggestion:** Generic coffee cart or The Bean Route branded image

## Next.js Image Optimization

All images are automatically optimized by Next.js:
- Lazy loading (except hero images with `priority` prop)
- Responsive sizing
- Modern formats (WebP) served automatically
- Automatic blur placeholders

## Usage in Frontmatter

```yaml
# In content/posts/{post}.md
featuredImage: "/blog-images/hero/hire-coffee-cart.jpg"
imageAlt: "Mobile coffee cart serving guests at Melbourne wedding"
imageCredit: "Artisan Espresso Co."  # Optional
```

## Sourcing Images

### Free Stock Photos:
- [Unsplash](https://unsplash.com/) - Search "coffee cart", "barista", "coffee event"
- [Pexels](https://www.pexels.com/) - High-quality free images
- [Pixabay](https://pixabay.com/) - Public domain images

### Custom Photography:
- Use vendor photos (with permission + credit)
- Event photography from past bookings
- Styled product shots of coffee equipment

### Brand Assets:
- The Bean Route logo for default author avatar
- Branded hero images for company posts
- Location-specific Melbourne photography

## Image Optimization Tools

Before uploading, compress images:
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Squoosh](https://squoosh.app/) - Advanced image optimizer
- ImageMagick CLI:
  ```bash
  # Resize to hero dimensions
  magick input.jpg -resize 1200x630^ -gravity center -extent 1200x630 output.jpg

  # Resize to thumbnail
  magick input.jpg -resize 600x400^ -gravity center -extent 600x400 output.jpg

  # Resize to avatar
  magick input.jpg -resize 200x200^ -gravity center -extent 200x200 output.jpg
  ```

## SEO Considerations

- Use descriptive filenames (e.g., `melbourne-coffee-cart-wedding.jpg` not `IMG_1234.jpg`)
- Always provide `imageAlt` text in frontmatter for accessibility
- Credit photographers/sources when required
- Optimize file sizes (aim for <200KB for hero images)
