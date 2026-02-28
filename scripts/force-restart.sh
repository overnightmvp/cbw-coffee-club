#!/bin/bash

# Force-restart Next.js dev server with fresh cache
# Run this when you see stale code being served

echo "=== Stopping all Next.js dev servers ==="
pkill -f "next dev" || echo "No dev servers running"

echo ""
echo "=== Deleting .next cache directory ==="
rm -rf .next

echo ""
echo "=== Starting fresh dev server ==="
npm run dev
