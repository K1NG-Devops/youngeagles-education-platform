// Email service integration for donation notifications
import { supabase } from '../config/supabase';

export const emailService = {
  // Send donation confirmation email
  async sendDonationEmail(donationId, type = 'banking_details') {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-donation-email', {
        body: { donationId, type }
      });

      if (error) {
        console.error('Email service error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send banking details email (for EFT/Cash donations)
  async sendBankingDetails(donationId) {
    return this.sendDonationEmail(donationId, 'banking_details');
  },

  // Send confirmation email (for all donation types)
  async sendConfirmation(donationId) {
    return this.sendDonationEmail(donationId, 'confirmation');
  }
};

// Alternative: Simple email sending without Edge Functions
// This is a simpler approach if you prefer not to use Supabase Edge Functions
export const simpleEmailService = {
  async sendDonationEmail(donation, type = 'banking_details') {
    try {
      // This would require a custom API endpoint on your server
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donation,
          type,
          resendApiKey: process.env.RESEND_API_KEY // This won't work client-side, needs server endpoint
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Simple email service error:', error);
      return { success: false, error: error.message };
    }
  }
};
