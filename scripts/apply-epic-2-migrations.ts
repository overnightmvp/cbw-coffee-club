import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function applyMigrations() {
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
        console.log('Connected to Postgres.');

        const sqlPath = path.resolve(__dirname, 'epic-2-schema-updates.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying Epic 2 schema updates...');
        await client.query(sql);
        console.log('Successfully applied schema updates!');

        await client.end();
    } catch (err: unknown) {
        console.error('Migration error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}

applyMigrations();
