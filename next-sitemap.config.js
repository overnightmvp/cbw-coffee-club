/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thebeanroute.com.au',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/dashboard', '/dashboard/*', '/design-system', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api/', '/design-system'],
      },
    ],
  },
}
