import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testConnection() {
    const connectionString = process.env.DATABASE_URI;
    if (!connectionString) {
        console.error('DATABASE_URI not found in environment');
        process.exit(1);
    }

    console.log('Attempting to connect to:', connectionString.replace(/:([^@]+)@/, ':****@'));

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Successfully connected to Postgres!');

        // Check for vendor applications
        const appCount = await client.query('SELECT COUNT(*) FROM vendor_applications');
        console.log(`Total vendor applications: ${appCount.rows[0].count}`);

        const lastApp = await client.query('SELECT business_name, status, created_at FROM vendor_applications ORDER BY created_at DESC LIMIT 1');
        if (lastApp.rows.length > 0) {
            console.log('Last application:', lastApp.rows[0]);
        }

        // Check if we can access the 'payload' schema
        const res = await client.query('SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1', ['payload']);
        if (res.rows.length > 0) {
            console.log("Schema 'payload' exists.");
        } else {
            console.log("Schema 'payload' does NOT exist.");
        }

        await client.end();
    } catch (err) {
        const error = err as Error & { code?: string };
        console.error('Connection error:', error.message || String(err));
        if (error.code) console.error('Error code:', error.code);
        process.exit(1);
    }
}

testConnection();
