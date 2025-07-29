# Email Service Configuration for Young Eagles Donations

## Option 1: Supabase Edge Functions (Recommended)

Create a Supabase Edge Function for sending emails. This keeps everything in one place.

### Setup Steps:

1. Install Supabase CLI: `npm install -g supabase`
2. Initialize Supabase in your project: `supabase init`
3. Create the edge function: `supabase functions new send-donation-email`

### Edge Function Code (supabase/functions/send-donation-email/index.ts):

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const { donationId, type } = await req.json()
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    // Get donation details
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single()
    
    if (error) throw error
    
    let emailContent = ''
    let subject = ''
    
    if (type === 'confirmation') {
      subject = `Donation Confirmation - ${donation.reference_number}`
      emailContent = generateConfirmationEmail(donation)
    } else if (type === 'banking_details') {
      subject = `Banking Details for Your Donation - ${donation.reference_number}`
      emailContent = generateBankingDetailsEmail(donation)
    }
    
    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'donations@youngeagles.org.za',
        to: [donation.email],
        subject: subject,
        html: emailContent,
      }),
    })
    
    const result = await res.json()
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }
})

function generateConfirmationEmail(donation: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank You for Your Donation!</h2>
      <p>Dear ${donation.full_name},</p>
      <p>Thank you for your generous donation to Young Eagles Home Centre. Your contribution will help us build a digital future for children.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Donation Details:</h3>
        <p><strong>Reference Number:</strong> ${donation.reference_number}</p>
        <p><strong>Amount:</strong> R${donation.amount}</p>
        <p><strong>Payment Method:</strong> ${donation.payment_method}</p>
        <p><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString()}</p>
      </div>
      
      ${donation.payment_method !== 'PayFast' ? `
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Banking Details:</h3>
          <p><strong>Account Name:</strong> YOUNG EAGLES HOME CARE CENTRE NPO</p>
          <p><strong>Account Number:</strong> 62777403181</p>
          <p><strong>Account Type:</strong> Gold Business Account</p>
          <p><strong>Reference:</strong> ${donation.reference_number}</p>
        </div>
        <p><strong>Important:</strong> Please use the reference number ${donation.reference_number} when making your payment.</p>
      ` : ''}
      
      <p>If you have any questions, please contact us at 081 523 6000 (WhatsApp).</p>
      <p>Thank you for sowing into a child's future!</p>
      <p>Young Eagles Home Centre Team</p>
    </div>
  `
}

function generateBankingDetailsEmail(donation: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Banking Details for Your Donation</h2>
      <p>Dear ${donation.full_name},</p>
      
      <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Banking Information:</h3>
        <p><strong>Account Name:</strong> YOUNG EAGLES HOME CARE CENTRE NPO</p>
        <p><strong>Registration ID:</strong> 104-850-NPO</p>
        <p><strong>Account Number:</strong> 62777403181</p>
        <p><strong>Account Type:</strong> Gold Business Account</p>
        <p><strong>Amount to Pay:</strong> R${donation.amount}</p>
        <p><strong>Reference Number:</strong> ${donation.reference_number}</p>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>⚠️ Important:</strong> Please use the reference number <strong>${donation.reference_number}</strong> when making your payment so we can track your donation.</p>
      </div>
      
      <p>Once you've made the payment, please send a proof of payment to us via WhatsApp at 081 523 6000.</p>
      <p>Thank you for your generous contribution!</p>
      <p>Young Eagles Home Centre Team</p>
    </div>
  `
}
```

## Option 2: Alternative Email Services

### Resend (Recommended)
- Sign up at resend.com
- Get API key
- Add to environment variables

### SendGrid
- Sign up at sendgrid.com
- Get API key
- Similar integration

### Nodemailer with SMTP
- Use Gmail, Outlook, or other SMTP provider
- Requires app passwords

## Environment Variables to Add

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (for edge functions)
RESEND_API_KEY=your_resend_api_key
```
