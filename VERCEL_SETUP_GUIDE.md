# 🔑 VERCEL ENVIRONMENT VARIABLES SETUP

## Required Commands (replace with your actual keys):

```bash
# Add Supabase Anonymous Key
echo "YOUR_ACTUAL_ANON_KEY_HERE" | vercel env add SUPABASE_ANON_KEY production

# Add Supabase Service Role Key  
echo "YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Add Resend API Key (already have this one)
echo "re_BEZe5Z3V_37L1xtSXfaLHX61MoHbuVhMD" | vercel env add RESEND_API_KEY production

# Add PayFast credentials (get these from your PayFast dashboard)
echo "YOUR_PAYFAST_MERCHANT_ID" | vercel env add PAYFAST_MERCHANT_ID production
echo "YOUR_PAYFAST_MERCHANT_KEY" | vercel env add PAYFAST_MERCHANT_KEY production  
echo "YOUR_PAYFAST_PASSPHRASE" | vercel env add PAYFAST_PASSPHRASE production
```

## After adding all variables:

```bash
# Redeploy to production
vercel --prod
```

## ⚠️ IMPORTANT NOTES:

1. **SUPABASE_URL is already added** ✅
2. **You need the FULL API keys** from Supabase dashboard
3. **All variables must be added to PRODUCTION environment**
4. **PayFast credentials** come from your PayFast merchant dashboard

## 🔍 Quick Test:
After adding variables and redeploying, the error should be gone!
