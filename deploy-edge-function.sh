#!/bin/bash
# Deploy Supabase Edge Function with updated email configuration

echo "🚀 Deploying Edge Function to Supabase..."

# Make sure you have Supabase CLI installed
# If not, install it with: npm install -g supabase

# Login to Supabase (if not already logged in)
echo "Checking Supabase login status..."
supabase status 2>/dev/null || {
    echo "Please login to Supabase first:"
    echo "supabase login"
    exit 1
}

# Link to your project (replace with your project reference)
echo "Linking to Supabase project..."
supabase link --project-ref bppuzibjlxgfwrujzfsz

# Deploy the Edge Function
echo "Deploying send-donation-email function..."
supabase functions deploy send-donation-email

echo "✅ Edge Function deployed!"
echo ""
echo "📧 Email Configuration Updated:"
echo "- From address: donations@edudashpro.org.za"
echo "- Domain: edudashpro.org.za"
echo ""
echo "⚠️  Make sure your domain is verified in Resend:"
echo "1. Go to: https://resend.com/domains"
echo "2. Verify that edudashpro.org.za is listed and verified"
echo "3. If not verified, add the domain and follow DNS setup instructions"
