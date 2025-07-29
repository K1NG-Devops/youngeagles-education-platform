// Environment Variables Debug Helper
// Add this temporarily to debug environment variable loading

export const debugEnvironmentVariables = () => {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Found' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
  console.log('VITE_PAYFAST_MERCHANT_ID:', import.meta.env.VITE_PAYFAST_MERCHANT_ID ? '✅ Found' : '❌ Missing');
  console.log('VITE_PAYFAST_MERCHANT_KEY:', import.meta.env.VITE_PAYFAST_MERCHANT_KEY ? '✅ Found' : '❌ Missing');
  console.log('VITE_PAYFAST_PASSPHRASE:', import.meta.env.VITE_PAYFAST_PASSPHRASE ? '✅ Found' : '❌ Missing');
  
  // Show actual values (only first 10 chars for security)
  console.log('Merchant ID (first 10 chars):', import.meta.env.VITE_PAYFAST_MERCHANT_ID?.substring(0, 10) || 'undefined');
  console.log('Merchant Key (first 10 chars):', import.meta.env.VITE_PAYFAST_MERCHANT_KEY?.substring(0, 10) || 'undefined');
};
