# 📧 Email Integration Setup Guide

You have your Resend API key ready! Now let's integrate it with your donation system.

## 🎯 **Setup Options**

### Option 1: Supabase Edge Functions (Recommended) ✅

This keeps everything secure in your Supabase ecosystem.

#### **Step 1: Setup Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
cd /home/king/Desktop/Main-Website/youngeagles-education-platform
supabase init

# Login to Supabase
supabase login
```

#### **Step 2: Link Your Project**
```bash
# Link to your existing Supabase project
supabase link --project-ref bppuzibjlxgfwrujzfsz
```

#### **Step 3: Deploy the Email Function**
```bash
# Deploy the email function
supabase functions deploy send-donation-email
```

#### **Step 4: Set Environment Variables in Supabase**
1. Go to your Supabase dashboard
2. Navigate to Settings → Functions
3. Add these environment variables:
   ```
   RESEND_API_KEY=re_BEZe5Z3V_37L1xtSXfaLHX61MoHbuVhMD
   SUPABASE_URL=https://bppuzibjlxgfwrujzfsz.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

#### **Step 5: Test the Integration**
```bash
# Test the function locally
supabase functions serve send-donation-email

# In another terminal, test with curl
curl -X POST http://localhost:54321/functions/v1/send-donation-email \
  -H "Content-Type: application/json" \
  -d '{"donationId": "test-id", "type": "banking_details"}'
```

---

### Option 2: Simple Server Route (Alternative) 🔄

If you prefer a simpler approach without Edge Functions.

#### **Create API Route** (if using Express.js backend)
```javascript
// api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { donation, type } = req.body;
    
    const emailContent = generateEmailContent(donation, type);
    
    const { data, error } = await resend.emails.send({
      from: 'donations@youngeagles.org.za',
      to: [donation.email],
      subject: `Donation ${type === 'confirmation' ? 'Confirmation' : 'Banking Details'} - ${donation.reference_number}`,
      html: emailContent,
    });

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

---

## 🚀 **Quick Test Instructions**

### **Test Email Integration:**

1. **Run the SQL setup** in your Supabase dashboard (from `supabase-setup.sql`)

2. **Copy your .env.example to .env** and fill in real values

3. **Test a donation:**
   - Go to your donation page
   - Fill out the form with EFT/Cash
   - Submit the form
   - Check your email for banking details

### **What Should Happen:**
1. ✅ Donation saved to Supabase
2. ✅ Reference number generated
3. ✅ Email sent with banking details
4. ✅ Thank you page displays

---

## 🔧 **Domain Setup for Resend**

### **Important: Email Domain Verification**

Currently using: `donations@youngeagles.org.za`

#### **Option A: Use Your Own Domain**
1. Go to Resend dashboard
2. Add your domain (e.g., `youngeagles.org.za`)
3. Add the required DNS records
4. Update the `from` address in the email function

#### **Option B: Use Resend's Sandbox Domain**
For testing, change the email from address to:
```javascript
from: 'onboarding@resend.dev' // Sandbox domain
```

---

## 📋 **Integration Checklist**

- [ ] Resend API key added to environment variables ✅
- [ ] Supabase CLI installed
- [ ] Supabase project linked
- [ ] Email function deployed
- [ ] Environment variables set in Supabase Functions
- [ ] Domain verified in Resend (or using sandbox)
- [ ] Test donation submitted
- [ ] Email received successfully

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Email not sending:**
   - Check Resend API key is correct
   - Verify domain is verified in Resend
   - Check Supabase function logs

2. **Function not deployed:**
   - Ensure Supabase CLI is logged in
   - Check project is linked correctly
   - Verify function code has no syntax errors

3. **Environment variables not working:**
   - Check variables are set in Supabase dashboard
   - Restart the function after adding variables

### **Debug Steps:**
```bash
# Check Supabase function logs
supabase functions logs send-donation-email

# Test function locally
supabase functions serve send-donation-email --debug
```

---

## 🎉 **Ready to Go!**

Once setup is complete, your donation system will:
- ✅ Save donations to Supabase
- ✅ Send beautiful HTML emails with banking details
- ✅ Handle both EFT/Cash and PayFast payments
- ✅ Provide reference numbers for tracking
- ✅ Work securely in production

Would you like me to help you set up the Supabase CLI and deploy the email function?
