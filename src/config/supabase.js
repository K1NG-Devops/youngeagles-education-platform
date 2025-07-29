// Supabase configuration
import { createClient } from '@supabase/supabase-js'

// Use secure environment variables (no VITE_ prefix)
const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

// Client instance (for frontend use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server instance (for API routes with elevated permissions)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

// Donation API functions
export const donationApi = {
  // Create a new donation
  async createDonation(donationData) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([donationData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating donation:', error)
      return { success: false, error: error.message }
    }
  },

  // Get donation by reference number
  async getDonationByReference(referenceNumber) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('reference_number', referenceNumber)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching donation:', error)
      return { success: false, error: error.message }
    }
  },

  // Update donation status (for PayFast callbacks)
  async updateDonationStatus(referenceNumber, status, paymentDetails = {}) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...paymentDetails
      }

      const { data, error } = await supabase
        .from('donations')
        .update(updateData)
        .eq('reference_number', referenceNumber)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating donation:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all donations (for admin)
  async getAllDonations(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching donations:', error)
      return { success: false, error: error.message }
    }
  },

  // Get donation statistics
  async getDonationStats() {
    try {
      const { data, error } = await supabase
        .from('donation_stats')
        .select('*')
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching donation stats:', error)
      return { success: false, error: error.message }
    }
  }
}
