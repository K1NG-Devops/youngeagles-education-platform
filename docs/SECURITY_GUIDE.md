# 🔐 Security Configuration Guide

## Environment Variables Security

### ⚠️ **CRITICAL SECURITY CONCEPTS**

#### 🔓 **Client-Side Variables (VITE_ prefix)**
- **Exposed to users**: Anyone can see these in browser dev tools
- **Use for**: Public configuration, non-sensitive data
- **Examples**: API URLs, public keys, feature flags

#### 🔒 **Server-Side Variables (No VITE_ prefix)**
- **Hidden from users**: Only accessible on server/build time
- **Use for**: Sensitive credentials, private keys, passwords
- **Examples**: Database passwords, API secrets, PayFast credentials

## 📝 **Current Configuration**

### ✅ **Secure Setup (Recommended)**

```bash
# .env file structure

# === ALL SECURE (Server-side only) ===
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_key

PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key  
PAYFAST_PASSPHRASE=your_secret_passphrase

RESEND_API_KEY=your_email_api_key
```

### ❌ **Insecure Setup (Avoid)**

```bash
# DON'T DO THIS - Exposes secrets to users
VITE_PAYFAST_MERCHANT_KEY=secret_key  # ❌ Anyone can see this!
VITE_PAYFAST_PASSPHRASE=secret_pass   # ❌ Compromises security!
VITE_DATABASE_PASSWORD=secret_pass    # ❌ Major security risk!
```

## 🔄 **Fallback Strategy**

Our code uses a fallback approach for flexibility:

```javascript
// All configuration uses secure server-side variables
const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY
const payFastMerchantId = import.meta.env.PAYFAST_MERCHANT_ID
```

## 🚀 **Deployment Security**

### **Vercel Deployment**

1. **Environment Variables in Vercel Dashboard:**
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = your_secret_service_key
   PAYFAST_MERCHANT_ID = your_merchant_id
   PAYFAST_MERCHANT_KEY = your_merchant_key
   PAYFAST_PASSPHRASE = your_secret_passphrase
   ```

2. **These are automatically hidden from client-side code**

3. **VITE_ variables are still exposed but contain only public data**

### **Other Platforms (Netlify, Railway, etc.)**
- Same principle applies
- Set server-side variables in platform dashboard
- Never put secrets in VITE_ variables

## 🛡️ **Best Practices**

### ✅ **Do:**
- Use server-side variables for all secrets (no VITE_ prefix)
- Set environment variables in deployment platform dashboard
- Keep all sensitive credentials secure
- Regularly rotate sensitive credentials
- Use different credentials for dev/staging/production

### ❌ **Don't:**
- Put secrets in VITE_ variables
- Commit .env files to git
- Share environment variables in public channels
- Use production credentials in development
- Log sensitive environment variables

## 🔍 **How to Verify Security**

### **Check Browser Exposure:**
1. Open your deployed website
2. Open browser dev tools (F12)
3. Go to Sources/Network tab
4. Search for your environment variables
5. **If you find PAYFAST_MERCHANT_KEY or similar secrets, they're exposed!**

### **Secure Check:**
- You should only see VITE_ variables in browser
- Server-side variables should not appear anywhere in client code

## 📋 **Migration Checklist**

If you're moving from insecure to secure setup:

- [ ] Update .env.example with new structure
- [ ] Copy .env.example to .env
- [ ] Fill in actual values in .env
- [ ] Update deployment platform environment variables
- [ ] Remove old VITE_ prefixed secrets
- [ ] Test that PayFast still works
- [ ] Verify secrets are not visible in browser
- [ ] Update documentation for team members

## 🆘 **If Secrets Were Exposed**

If you accidentally exposed secrets with VITE_ prefix:

1. **Immediately** change the credentials in the service (PayFast, Supabase, etc.)
2. Update environment variables with new credentials
3. Redeploy application
4. Monitor for any unauthorized usage
5. Implement proper security practices going forward

## 📞 **Support**

For security questions:
- Review this document first
- Check deployment platform documentation
- Consult with security team if available
- When in doubt, keep credentials server-side only
