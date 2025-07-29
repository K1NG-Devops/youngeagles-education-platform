#!/bin/bash
# Add VITE_ prefixed environment variables to Vercel

echo "🔐 Adding VITE_ prefixed environment variables for browser access..."

# Add VITE_SUPABASE_URL
echo "Adding VITE_SUPABASE_URL..."
echo "https://bppuzibjlxgfwrujzfsz.supabase.co" | vercel env add VITE_SUPABASE_URL production

echo "✅ VITE_SUPABASE_URL added!"
echo ""
echo "⚠️  Now you need to add your Supabase ANON key:"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard/projects"
echo "2. Select project: bppuzibjlxgfwrujzfsz"
echo "3. Go to Settings → API"
echo "4. Copy the 'anon public' key"
echo "5. Run: echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcHV6aWJqbHhnZndydWp6ZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDM3MzAsImV4cCI6MjA2OTMxOTczMH0.LcoKy-VzT6nKLPjcb6BXKHocj4E7DuUQPyH_bmfGbWA' | vercel env add VITE_SUPABASE_ANON_KEY production"
echo ""
echo "📝 Example command (replace with your actual key):"
echo "echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...' | vercel env add VITE_SUPABASE_ANON_KEY production"
