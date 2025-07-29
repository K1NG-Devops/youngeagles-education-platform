# 🔐 PAYFAST ENVIRONMENT VARIABLES SETUP

## 📋 **Required Environment Variables for Vercel**

You need to add these environment variables to Vercel Dashboard with the `VITE_` prefix:

### **Step 1: Get PayFast Credentials**
1. Login to your PayFast dashboard: https://www.payfast.co.za/
2. Go to **Settings** → **Merchant Settings**
3. Copy the following values:
   - **Merchant ID** (usually a number like `10000100`)
   - **Merchant Key** (long string of characters)
   - **Passphrase** (if you set one up)

### **Step 2: Add to Vercel**
Run these commands in your terminal (replace with your actual values):

```bash
# Add PayFast Merchant ID
echo "YOUR_MERCHANT_ID_HERE" | vercel env add VITE_PAYFAST_MERCHANT_ID production

# Add PayFast Merchant Key  
echo "YOUR_MERCHANT_KEY_HERE" | vercel env add VITE_PAYFAST_MERCHANT_KEY production

# Add PayFast Passphrase (if you have one)
echo "YOUR_PASSPHRASE_HERE" | vercel env add VITE_PAYFAST_PASSPHRASE production
```

### **Step 3: Also Add Missing Supabase Key**
```bash
# Add the Supabase Anonymous Key (get this from your Supabase dashboard)
echo "YOUR_SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production
```

### **Step 4: Redeploy**
```bash
vercel --prod
```

## 🔍 **How to Find Your PayFast Credentials**

### **Merchant ID & Merchant Key:**
1. Go to your PayFast dashboard
2. Click on **Settings** (gear icon)
3. Navigate to **Developer** section
4. Your **Merchant ID** and **Merchant Key** will be displayed

### **Passphrase (Optional but Recommended):**
1. In the same Developer section
2. Set up a **Passphrase** for additional security
3. Use this same passphrase in your environment variables

## 🚨 **Important Security Notes**

1. **Use PRODUCTION credentials** for your live site
2. **Never commit** these values to your code repository
3. **Test thoroughly** with small amounts first
4. **Set up webhook URLs** in PayFast for payment notifications

## 🧪 **Testing**

Once configured, test with:
- Small donation amounts (R1-R10)
- Different payment methods (card, EFT)
- Check that donation records are created in Supabase
- Verify emails are sent

## 📞 **Support**

If you have issues:
- **PayFast Support:** support@payfast.co.za
- **Check PayFast logs** in your dashboard for detailed error messages
- **Check browser console** for JavaScript errors
