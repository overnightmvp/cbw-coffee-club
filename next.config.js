/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, isEdge }) => {
    // Fix for Edge Runtime - externalize OpenTelemetry
    if (isEdge) {
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/resources': false,
      }
    }

    if (isServer && !isEdge) {
      // Externalize dependencies for server-side rendering
      config.externals = [...(config.externals || []), {
        'date-fns': 'commonjs date-fns',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
        '@opentelemetry/sdk-node': 'commonjs @opentelemetry/sdk-node',
        '@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation',
        '@opentelemetry/resources': 'commonjs @opentelemetry/resources',
      }]
    }
    return config
  },
}

module.exports = nextConfig
