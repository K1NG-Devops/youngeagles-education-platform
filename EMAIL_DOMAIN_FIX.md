# 📧 EMAIL DOMAIN CONFIGURATION FIX

## 🚨 **Current Issue:**
The Resend API is returning a 403 error because it's in testing mode and can only send emails to your own email address (`oliviamakunyane@gmail.com`).

## ✅ **Solution Steps:**

### **Step 1: Verify Domain in Resend** 
1. Go to: https://resend.com/domains
2. Check if `edudashpro.org.za` is listed and **verified** (should have a green checkmark)
3. If not verified, follow the DNS setup instructions
4. Make sure you can send emails from `donations@edudashpro.org.za`

### **Step 2: Update Edge Function Domain**
The Edge Function is already configured to use `donations@edudashpro.org.za`, but we need to redeploy it.

**Manual Method (via Supabase Dashboard):**
1. Go to: https://supabase.com/dashboard/project/bppuzibjlxgfwrujzfsz/functions
2. Click on `send-donation-email` function
3. Update the code if needed
4. Click "Deploy" to redeploy

### **Step 3: Test Email Domain**
```bash
# Test if the domain works by sending a test email from Resend dashboard
# Or use their API directly to test
```

### **Step 4: Verify Environment Variables**
Make sure these are set in Supabase → Settings → Edge Functions:
- `RESEND_API_KEY`: re_BEZe5Z3V_37L1xtSXfaLHX61MoHbuVhMD
- `SUPABASE_URL`: https://bppuzibjlxgfwrujzfsz.supabase.co  
- `SUPABASE_SERVICE_ROLE_KEY`: [Your service role key]

## 🔍 **Quick Domain Verification:**

### Check if domain is verified:
1. Login to Resend: https://resend.com/login
2. Go to Domains: https://resend.com/domains
3. Look for `edudashpro.org.za` with ✅ status

### If domain is NOT verified:
1. Add the domain in Resend
2. Add the required DNS records to your domain provider
3. Wait for verification (can take up to 24 hours)
4. Once verified, test sending emails

## 🚀 **Alternative Quick Fix:**
If you want to test immediately with your own email, you can temporarily change the Edge Function to use `onboarding@resend.dev` and only send to `oliviamakunyane@gmail.com` for testing.

Let me know the status of your domain verification!
