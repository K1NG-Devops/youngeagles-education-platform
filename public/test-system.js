// Quick test script to verify Supabase connection
// Run this in browser console on your deployed site to test

console.log('🧪 Testing Young Eagles Donation System...');

// Test environment variables are loaded
const testEnvVars = () => {
  console.log('📋 Environment Variables Check:');
  console.log('SUPABASE_URL:', import.meta.env.SUPABASE_URL ? '✅ Found' : '❌ Missing');
  console.log('SUPABASE_ANON_KEY:', import.meta.env.SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
  console.log('RESEND_API_KEY:', import.meta.env.RESEND_API_KEY ? '✅ Found' : '❌ Missing');
};

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Testing Supabase Connection...');
    
    // Import Supabase client
    const { supabase } = await import('./src/config/supabase.js');
    
    // Test database connection
    const { data, error } = await supabase
      .from('donations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database Error:', error);
      return false;
    }
    
    console.log('✅ Database Connection: Success');
    return true;
  } catch (err) {
    console.error('❌ Supabase Connection Failed:', err);
    return false;
  }
};

// Test email function
const testEmailFunction = async () => {
  try {
    console.log('📧 Testing Email Function...');
    
    const { supabase } = await import('./src/config/supabase.js');
    
    // Test function exists
    const { data, error } = await supabase.functions.invoke('send-donation-email', {
      body: { donationId: 'test', type: 'test' }
    });
    
    if (error && !error.message.includes('test')) {
      console.error('❌ Email Function Error:', error);
      return false;
    }
    
    console.log('✅ Email Function: Available');
    return true;
  } catch (err) {
    console.error('❌ Email Function Test Failed:', err);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting System Tests...\n');
  
  testEnvVars();
  
  const dbTest = await testSupabaseConnection();
  const emailTest = await testEmailFunction();
  
  console.log('\n📊 Test Results:');
  console.log('Database:', dbTest ? '✅ Ready' : '❌ Issues');
  console.log('Email Function:', emailTest ? '✅ Ready' : '❌ Issues');
  
  if (dbTest && emailTest) {
    console.log('\n🎉 System Ready for Donations!');
    console.log('You can now test the donation form.');
  } else {
    console.log('\n⚠️ Please fix the issues above before testing.');
  }
};

// Auto-run tests
runAllTests();
