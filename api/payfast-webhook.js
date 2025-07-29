// PayFast Webhook Handler
// This handles PayFast payment notifications (ITN - Instant Transaction Notification)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 PayFast Webhook received:', req.body);
    
    // PayFast sends payment data in the request body
    const {
      m_payment_id, // This is our donation reference number
      pf_payment_id,
      payment_status,
      amount_gross,
      amount_fee,
      amount_net,
      custom_str1, // full_name
      custom_str2, // contact_number  
      custom_str3, // email
    } = req.body;

    // Validate that this is a legitimate PayFast request
    // In production, you should verify the PayFast signature here
    
    console.log('💰 Payment details:', {
      reference: m_payment_id,
      status: payment_status,
      amount: amount_gross,
      payfast_id: pf_payment_id
    });

    // Update donation status in Supabase based on payment status
    if (payment_status === 'COMPLETE') {
      // TODO: Update donation in Supabase to 'completed' status
      console.log('✅ Payment completed for reference:', m_payment_id);
      
      // TODO: Send confirmation email
      console.log('📧 Sending confirmation email to:', custom_str3);
    } else {
      console.log('⏳ Payment status:', payment_status);
    }

    // PayFast requires a 200 OK response to confirm we received the notification
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed',
      reference: m_payment_id,
      status: payment_status
    });

  } catch (error) {
    console.error('❌ PayFast webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
