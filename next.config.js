const { withPayload } = require('@payloadcms/next/withPayload')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config options
}

module.exports = withPayload(nextConfig)
