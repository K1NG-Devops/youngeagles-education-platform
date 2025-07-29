#!/bin/bash
# Add PayFast environment variables with VITE_ prefix to Vercel

echo "🔐 Adding PayFast environment variables with VITE_ prefix..."

echo "⚠️  You need to add your PayFast credentials with VITE_ prefix:"
echo ""
echo "1. Get your PayFast credentials from: https://www.payfast.co.za/user/integration"
echo "2. Run these commands with your actual credentials:"
echo ""
echo "# Add PayFast Merchant ID"
echo "echo 'YOUR_MERCHANT_ID' | vercel env add VITE_PAYFAST_MERCHANT_ID production"
echo ""
echo "# Add PayFast Merchant Key"  
echo "echo 'YOUR_MERCHANT_KEY' | vercel env add VITE_PAYFAST_MERCHANT_KEY production"
echo ""
echo "# Add PayFast Passphrase"
echo "echo 'YOUR_PASSPHRASE' | vercel env add VITE_PAYFAST_PASSPHRASE production"
echo ""
echo "📝 Note: These need to match your PayFast merchant account settings"
echo "🔒 Make sure to use PRODUCTION credentials, not SANDBOX"
