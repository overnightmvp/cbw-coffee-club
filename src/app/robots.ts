export default {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/design-system', '/storybook'],
    },
  ],
  sitemap: 'https://thebeanroute.com.au/sitemap.xml',
}
