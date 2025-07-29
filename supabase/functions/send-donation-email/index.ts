import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

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
        from: 'onboarding@resend.dev', // Temporary - change to your verified domain later
        to: [donation.email],
        subject: subject,
        html: emailContent,
      }),
    })
    
    const result = await res.json()
    
    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(result)}`)
    }
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        } 
      },
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        } 
      },
    )
  }
})

function generateConfirmationEmail(donation: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Donation Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .banking { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Thank You for Your Donation!</h1>
          <p>Young Eagles Home Centre</p>
        </div>
        <div class="content">
          <p>Dear ${donation.full_name},</p>
          <p>Thank you for your generous donation to Young Eagles Home Centre. Your contribution will help us build a digital future for children through technology education.</p>
          
          <div class="details">
            <h3>Donation Details:</h3>
            <p><strong>Reference Number:</strong> ${donation.reference_number}</p>
            <p><strong>Amount:</strong> <span class="amount">R${donation.amount}</span></p>
            <p><strong>Payment Method:</strong> ${donation.payment_method}</p>
            <p><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString('en-ZA')}</p>
          </div>
          
          ${donation.payment_method !== 'PayFast' ? `
            <div class="banking">
              <h3>Banking Details:</h3>
              <p><strong>Account Name:</strong> YOUNG EAGLES HOME CARE CENTRE NPO</p>
              <p><strong>Registration ID:</strong> 104-850-NPO</p>
              <p><strong>Account Number:</strong> 62777403181</p>
              <p><strong>Account Type:</strong> Gold Business Account</p>
              <p><strong>Reference:</strong> <strong>${donation.reference_number}</strong></p>
            </div>
            <p><strong>⚠️ Important:</strong> Please use the reference number <strong>${donation.reference_number}</strong> when making your payment so we can track your donation.</p>
            <p>Once you've made the payment, please send proof of payment to us via WhatsApp at <strong>081 523 6000</strong>.</p>
          ` : `
            <p>Your payment has been processed securely through PayFast. You will receive a separate payment confirmation from PayFast.</p>
          `}
          
          <p>If you have any questions, please contact us at <strong>081 523 6000</strong> (WhatsApp).</p>
          
          <div class="footer">
            <p><strong>Thank you for sowing into a child's future!</strong></p>
            <p>Young Eagles Home Centre Team</p>
            <p>Building tomorrow's innovators today 🚀</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateBankingDetailsEmail(donation: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Banking Details</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .banking { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669; }
        .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 Banking Details</h1>
          <p>Complete Your Donation</p>
        </div>
        <div class="content">
          <p>Dear ${donation.full_name},</p>
          <p>Thank you for choosing to donate to Young Eagles Home Centre. Below are the banking details to complete your donation:</p>
          
          <div class="banking">
            <h3>Banking Information:</h3>
            <p><strong>Account Name:</strong> YOUNG EAGLES HOME CARE CENTRE NPO</p>
            <p><strong>Registration ID:</strong> 104-850-NPO</p>
            <p><strong>Account Number:</strong> 62777403181</p>
            <p><strong>Account Type:</strong> Gold Business Account</p>
            <p><strong>Amount to Pay:</strong> <span class="amount">R${donation.amount}</span></p>
            <p><strong>Reference Number:</strong> <strong>${donation.reference_number}</strong></p>
          </div>
          
          <div class="warning">
            <p><strong>⚠️ Important Instructions:</strong></p>
            <ul>
              <li>Please use the reference number <strong>${donation.reference_number}</strong> when making your payment</li>
              <li>This helps us track and confirm your donation quickly</li>
              <li>Send proof of payment to WhatsApp: <strong>081 523 6000</strong></li>
            </ul>
          </div>
          
          <p>Once we receive your payment, we'll send you a confirmation email.</p>
          
          <div class="footer">
            <p><strong>Thank you for your generous contribution!</strong></p>
            <p>Young Eagles Home Centre Team</p>
            <p>Your support makes digital education possible 💻</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
