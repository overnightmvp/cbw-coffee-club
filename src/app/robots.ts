export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/design-system', '/storybook'],
      },
    ],
    sitemap: 'https://thebeanroute.com.au/sitemap.xml',
  }
}
