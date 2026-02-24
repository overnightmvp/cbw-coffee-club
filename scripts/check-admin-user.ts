import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function checkAdminUser() {
    const connectionString = process.env.DATABASE_URI;
    if (!connectionString) {
        console.error('DATABASE_URI not found in environment');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to database\n');

        // Check if admin_users table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'admin_users'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('❌ admin_users table does NOT exist!');
            await client.end();
            return;
        }

        console.log('✅ admin_users table exists\n');

        // List all admin users
        const allAdmins = await client.query('SELECT id, email, created_at FROM admin_users ORDER BY created_at DESC');
        console.log(`Total admin users: ${allAdmins.rows.length}\n`);

        if (allAdmins.rows.length > 0) {
            console.log('Admin users:');
            allAdmins.rows.forEach((admin, i) => {
                console.log(`  ${i + 1}. ${admin.email} (ID: ${admin.id}, Created: ${admin.created_at})`);
            });
        }

        console.log('\n---\n');

        // Check for specific email
        const targetEmail = 'johnnytoshio@icloud.com';
        const specificCheck = await client.query(
            'SELECT * FROM admin_users WHERE email = $1',
            [targetEmail.toLowerCase()]
        );

        if (specificCheck.rows.length > 0) {
            console.log(`✅ ${targetEmail} IS in admin_users table`);
            console.log(JSON.stringify(specificCheck.rows[0], null, 2));
        } else {
            console.log(`❌ ${targetEmail} is NOT in admin_users table`);
            console.log(`\nTo add this user, run:`);
            console.log(`INSERT INTO admin_users (email) VALUES ('${targetEmail.toLowerCase()}');`);
        }

        await client.end();
    } catch (err) {
        const error = err as Error & { code?: string };
        console.error('Error:', error.message || String(err));
        if (error.code) console.error('Error code:', error.code);
        process.exit(1);
    }
}

checkAdminUser();
