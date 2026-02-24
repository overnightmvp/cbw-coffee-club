import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function setupStorage() {
    console.log('Checking for vendor-images bucket...')

    // Check if bucket exists
    const { data: buckets, error: getError } = await supabase.storage.listBuckets()
    if (getError) {
        console.error('Error listing buckets:', getError.message)
        process.exit(1)
    }

    const bucketName = 'vendor-images'
    const exists = buckets.find(b => b.name === bucketName)

    if (!exists) {
        console.log(`Creating bucket: ${bucketName}...`)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 2 * 1024 * 1024 // 2MB
        })
        if (createError) {
            console.error('Error creating bucket:', createError.message)
            process.exit(1)
        }
        console.log('Bucket created successfully.')
    } else {
        console.log('Bucket already exists.')
    }

    // Set up public access policy if not already present
    // Note: createBucket with public: true handles most cases, 
    // but explicit policies might be needed depending on the Supabase version.
    console.log('Storage setup complete.')
}

setupStorage()
