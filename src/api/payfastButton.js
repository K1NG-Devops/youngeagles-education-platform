// PayFast Pay Now Button Generator
// This creates a proper PayFast payment form following their official documentation

export const createPayFastForm = (donationData) => {
  const config = {
    merchant_id: import.meta.env.VITE_PAYFAST_MERCHANT_ID,
    merchant_key: import.meta.env.VITE_PAYFAST_MERCHANT_KEY,
    passphrase: import.meta.env.VITE_PAYFAST_PASSPHRASE,
  };

  console.log('🔍 PayFast Configuration Check:');
  console.log('Merchant ID:', config.merchant_id ? `✅ ${config.merchant_id}` : '❌ Missing');
  console.log('Merchant Key:', config.merchant_key ? '✅ Found' : '❌ Missing');
  console.log('Passphrase:', config.passphrase ? '✅ Found' : '❌ Missing');

  if (!config.merchant_id || !config.merchant_key) {
    throw new Error('PayFast credentials missing. Please check VITE_PAYFAST_MERCHANT_ID and VITE_PAYFAST_MERCHANT_KEY.');
  }

  // PayFast form data according to their API documentation
  const formData = {
    // Merchant details
    merchant_id: config.merchant_id,
    merchant_key: config.merchant_key,
    
    // Return URLs
    return_url: `${window.location.origin}/donation-success`,
    cancel_url: `${window.location.origin}/donate`,
    notify_url: `${window.location.origin}/api/payfast-webhook`,
    
    // Buyer details
    name_first: donationData.full_name.split(' ')[0] || 'Donor',
    name_last: donationData.full_name.split(' ').slice(1).join(' ') || '',
    email_address: donationData.email,
    
    // Transaction details
    m_payment_id: donationData.reference_number,
    amount: parseFloat(donationData.amount).toFixed(2),
    item_name: 'Young Eagles Education Platform Donation',
    item_description: `Donation for digital education initiatives - Ref: ${donationData.reference_number}`,
    
    // Custom fields for our tracking
    custom_str1: donationData.company || '',
    custom_str2: donationData.contact_number || '',
    custom_str3: donationData.id, // Our internal donation ID
    custom_str4: 'YE-Donation',
    custom_str5: new Date().toISOString(),
  };

  // Remove empty values (PayFast is strict about this)
  Object.keys(formData).forEach(key => {
    if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
      delete formData[key];
    }
  });

  console.log('💰 PayFast Form Data:', formData);

  return formData;
};

// Create and submit PayFast payment form
export const submitPayFastPayment = (donationData) => {
  try {
    const formData = createPayFastForm(donationData);
    
    // Create form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.payfast.co.za/eng/process'; // Official PayFast URL
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });
    
    // Add form to page and submit
    document.body.appendChild(form);
    
    console.log('🚀 Submitting PayFast form...');
    form.submit();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);
    
  } catch (error) {
    console.error('❌ PayFast submission error:', error);
    throw error;
  }
};

// Alternative: Generate PayFast button HTML (for server-side rendering)
export const generatePayFastButtonHTML = (donationData) => {
  const formData = createPayFastForm(donationData);
  
  let html = `<form action="https://www.payfast.co.za/eng/process" method="post">`;
  
  Object.entries(formData).forEach(([key, value]) => {
    html += `<input type="hidden" name="${key}" value="${value}" />`;
  });
  
  html += `<input type="submit" value="Pay Now" class="payfast-pay-now-button" />`;
  html += `</form>`;
  
  return html;
};
