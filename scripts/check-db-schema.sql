-- Run this in Supabase SQL Editor to check what columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vendors'
ORDER BY ordinal_position;
