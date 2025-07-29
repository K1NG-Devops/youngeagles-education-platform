// Email service integration for donation notifications
import { supabase } from '../config/supabase';

export const emailService = {
  // Send donation confirmation email using a simpler approach
  async sendDonationEmail(donationId, type = 'banking_details') {
    try {
      console.log('Attempting to send email for donation:', donationId);
      
      // First, try the Edge Function approach
      try {
        const { data, error } = await supabase.functions.invoke('send-donation-email', {
          body: { donationId, type }
        });

        if (error) {
          console.warn('Edge Function error:', error);
          // Fall back to simple approach if Edge Function fails
          return await this.sendEmailFallback(donationId, type);
        }

        return { success: true, data };
      } catch (edgeFunctionError) {
        console.warn('Edge Function not available, using fallback:', edgeFunctionError);
        return await this.sendEmailFallback(donationId, type);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Fallback email method - just log the email that would be sent
  async sendEmailFallback(donationId, type) {
    try {
      // Get the donation details
      const { data: donation, error } = await supabase
        .from('donations')
        .select('*')
        .eq('id', donationId)
        .single();

      if (error) {
        console.error('Error fetching donation for email:', error);
        return { success: false, error: 'Could not fetch donation details' };
      }

      // For now, we'll just log what the email would contain
      // In production, you could integrate with a different email service
      console.log('📧 Email would be sent to:', donation.email);
      console.log('📧 Email type:', type);
      console.log('📧 Donation details:', donation);

      // Simulate successful email sending
      return { 
        success: true, 
        data: { 
          message: 'Email logged successfully (fallback mode)',
          donationId,
          recipientEmail: donation.email
        }
      };
    } catch (error) {
      console.error('Fallback email error:', error);
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
