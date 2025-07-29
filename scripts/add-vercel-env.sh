#!/bin/bash
# Script to add all environment variables to Vercel
# Make sure to replace the placeholder values with your actual keys

echo "🔐 Adding Environment Variables to Vercel..."

# Supabase Configuration
echo "Adding Supabase URL..."
echo "https://bppuzibjlxgfwrujzfsz.supabase.co" | vercel env add SUPABASE_URL production

echo "Adding Supabase Anon Key..."
echo "REPLACE_WITH_YOUR_ACTUAL_ANON_KEY" | vercel env add SUPABASE_ANON_KEY production

echo "Adding Supabase Service Role Key..."
echo "REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Email Service
echo "Adding Resend API Key..."
echo "re_BEZe5Z3V_37L1xtSXfaLHX61MoHbuVhMD" | vercel env add RESEND_API_KEY production

# PayFast Configuration (you'll need to get these from PayFast dashboard)
echo "Adding PayFast Merchant ID..."
echo "REPLACE_WITH_YOUR_PAYFAST_MERCHANT_ID" | vercel env add PAYFAST_MERCHANT_ID production

echo "Adding PayFast Merchant Key..."
echo "REPLACE_WITH_YOUR_PAYFAST_MERCHANT_KEY" | vercel env add PAYFAST_MERCHANT_KEY production

echo "Adding PayFast Passphrase..."
echo "REPLACE_WITH_YOUR_PAYFAST_PASSPHRASE" | vercel env add PAYFAST_PASSPHRASE production

echo "✅ Environment variables added! Now redeploy your project."
echo "Run: vercel --prod"
