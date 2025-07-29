# 🚀 Deployment Checklist for Young Eagles Donation System

## ✅ **Pre-Deployment Checklist**

### **1. Vercel Environment Variables** 
Add these to Vercel Dashboard → Settings → Environment Variables:

```bash
# Core Supabase Configuration (Frontend)
VITE_SUPABASE_URL=https://bppuzibjlxgfwrujzfsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Backend (Edge Functions only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PayFast Configuration (Frontend - VITE_ prefix required)
VITE_PAYFAST_MERCHANT_ID=your_merchant_id
VITE_PAYFAST_MERCHANT_KEY=your_merchant_key
VITE_PAYFAST_PASSPHRASE=your_passphrase

# Email Service
RESEND_API_KEY=re_BEZe5Z3V_37L1xtSXfaLHX61MoHbuVhMD
```

**⚠️ Important:** Use **Production** environment for all variables.

### **2. Supabase Setup**
- [x] Database tables created (donations table)
- [x] Row Level Security enabled
- [x] Edge function deployed (send-donation-email)
- [x] Function environment variables set

### **3. Domain Configuration**
- [x] EduDashPro domain verified in Resend
- [x] Email function using `donations@edudashpro.org.za`

## 🔄 **Deployment Steps**

### **Step 1: Push Code**
```bash
git add .
git commit -m "Add Supabase donation system with email integration"
git push origin features
```
✅ **Completed**

### **Step 2: Vercel Deployment**
- Vercel will auto-deploy from your GitHub push
- Check Vercel dashboard for deployment status
- Verify environment variables are set

### **Step 3: Domain Setup**
- Ensure your production domain points to Vercel
- SSL certificate should be active

## 🧪 **Testing Checklist**

### **Test 1: EFT Donation**
1. Go to: `https://your-domain.com/donate`
2. Fill form with test data
3. Select "EFT" payment method
4. Submit donation
5. **Expected Results:**
   - ✅ Success page shows with reference number
   - ✅ Email received at donated email address
   - ✅ Donation record in Supabase

### **Test 2: Cash Donation**
1. Fill form with different email
2. Select "Cash" payment method
3. Submit donation
4. **Expected Results:**
   - ✅ Same as EFT test
   - ✅ Email contains banking details

### **Test 3: PayFast Donation**
1. Fill form with test data
2. Select "PayFast" payment method
3. Submit donation
4. **Expected Results:**
   - ✅ Redirected to PayFast
   - ✅ Donation record created before redirect
   - ✅ Reference number used as PayFast ID

## 🔍 **Verification Steps**

### **Check Supabase Data**
1. Go to Supabase dashboard
2. Navigate to Table Editor → donations
3. Verify test donations appear
4. Check reference numbers are generated

### **Check Email Delivery**
1. Test with your own email first
2. Check spam folder if not in inbox
3. Verify email formatting is correct
4. Test reply-to functionality

### **Check Function Logs**
1. Supabase dashboard → Edge Functions
2. Click on send-donation-email
3. Check logs for any errors
4. Verify successful email sends

## 🚨 **Troubleshooting**

### **Email Not Sending:**
- Check Resend API key is correct
- Verify domain is verified in Resend
- Check Supabase function logs
- Ensure environment variables are set

### **Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies are correct
- Ensure tables exist

### **PayFast Issues:**
- Verify merchant credentials
- Check PayFast signature generation
- Ensure HTTPS is enabled

## 📊 **Post-Deployment Monitoring**

### **Week 1:**
- [ ] Monitor donation submissions
- [ ] Check email delivery rates
- [ ] Verify PayFast transactions
- [ ] Monitor error logs

### **Ongoing:**
- [ ] Monthly donation reports
- [ ] Email delivery analytics
- [ ] Database performance
- [ ] Security updates

## 🎉 **Go Live!**

Once all tests pass:
1. ✅ Update DNS if needed
2. ✅ Announce donation system is live
3. ✅ Monitor initial donations
4. ✅ Have support ready for user questions

---

## 📞 **Support Information**

- **Technical Issues:** support@edudashpro.org.za
- **Donations Help:** 081 523 6000 (WhatsApp)
- **PayFast Support:** PayFast dashboard
- **Supabase Issues:** Supabase support

**System Status:** 🟢 Ready for Production
