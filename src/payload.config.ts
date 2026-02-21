import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections
import Users from './collections/Users'
import Posts from './collections/Posts'
import Media from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin configuration
  admin: {
    user: 'users', // Collection for admin users
    meta: {
      titleSuffix: '- The Bean Route CMS',
      favicon: '/favicon.ico',
    },
  },

  // Collections
  collections: [Users, Posts, Media],

  // Database adapter - PostgreSQL via Supabase
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Use separate 'payload' schema to avoid conflicts with existing Supabase tables
    schemaName: 'payload',
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Secret for JWT encryption
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Disable GraphQL (use REST API only)
  graphQL: {
    disable: true,
  },

  // Server URL for production
  serverURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  // CORS configuration
  cors: [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ],

  // CSRF protection
  csrf: [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ],
})
