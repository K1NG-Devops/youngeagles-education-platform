# Supabase Integration Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name: "young-eagles-donations"
5. Enter database password (save this!)
6. Choose region closest to you
7. Click "Create new project"

### 2. Get Supabase Credentials
Once your project is created:
1. Go to Settings > API
2. Copy these values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### 3. Set up Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the entire content from `supabase-setup.sql`
3. Click "Run" to execute the SQL

### 4. Update Environment Variables
1. Copy `.env.example` to `.env`
3. **Add Environment Variables:**
   ```bash
   # Add to your .env file:
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 5. Test the Integration
1. Start your development server: `npm run dev`
2. Go to the donation page
3. Fill out the form with EFT or Cash payment method
4. Submit the form
5. Check your Supabase dashboard > Table Editor > donations to see the new record

## What's Working Now

✅ **EFT/Cash Donations:**
- Form data is saved to Supabase database
- Reference numbers are auto-generated
- Thank you page shows banking details
- Error handling for failed submissions

✅ **PayFast Integration:**
- Donation record created before PayFast redirect
- Reference number used as PayFast payment ID
- Donation ID passed for webhook processing

## What's Next (Optional)

### Email Integration Options

#### Option 1: Supabase Edge Functions + Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Follow instructions in `docs/email-setup.md`

#### Option 2: Simple EmailJS (Quick Setup)
```bash
npm install emailjs-com
```

#### Option 3: Backend API Route
- Create Express.js server
- Use Nodemailer with Gmail/Outlook

### PayFast Webhook Setup
1. Create API route for `/api/payfast-notify`
2. Verify PayFast signature
3. Update donation status in Supabase

### Admin Dashboard
1. Create admin page to view donations
2. Export donation data
3. Manage donation statuses

## Database Schema

The donations table includes:
- `id` - UUID primary key
- `reference_number` - Auto-generated (YEHC-2025-001-1234)
- `full_name` - Donor name
- `email` - Donor email
- `contact_number` - Phone number
- `company` - Optional company name
- `amount` - Donation amount
- `payment_method` - EFT, Cash, or PayFast
- `status` - pending, confirmed, completed, cancelled
- `created_at` - Timestamp
- `payfast_payment_id` - For PayFast transactions
- `notes` - Additional information

## Testing

### Test EFT Donation:
1. Fill out donation form
2. Select "EFT" payment method
3. Enter amount and donor details
4. Submit form
5. Check Supabase table for new record
6. Verify reference number is generated

### Test PayFast Integration:
1. Use PayFast sandbox environment first
2. Update PayFast URL to sandbox
3. Test with sandbox credentials
4. Verify donation record is created

## Production Checklist

- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] PayFast production credentials added
- [ ] Email service configured (optional)
- [ ] Error handling tested
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active
- [ ] Domain verified with PayFast

## Support

For any issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify environment variables are loaded
4. Test database connection manually

## Security Notes

- Never expose service role key in frontend
- Use Row Level Security (RLS) policies
- Validate all input data
- Use HTTPS in production
- Regularly backup database
