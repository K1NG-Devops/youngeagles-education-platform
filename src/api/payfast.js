// PayFast API helper for secure server-side operations
import CryptoJS from 'crypto-js';

// Server-side PayFast configuration
const getPayFastConfig = () => {
  return {
    merchant_id: import.meta.env.PAYFAST_MERCHANT_ID,
    merchant_key: import.meta.env.PAYFAST_MERCHANT_KEY,
    passphrase: import.meta.env.PAYFAST_PASSPHRASE,
  };
};

// Function to generate PayFast signature securely
export const generatePayFastSignature = (data, passPhrase = "") => {
  // Create parameter string for signature generation
  const createParameterString = (data, passPhrase = "") => {
    // Remove signature if it exists
    const filteredData = { ...data };
    delete filteredData.signature;
    
    // Sort parameters alphabetically and create parameter string
    const sortedKeys = Object.keys(filteredData).sort();
    let paramString = "";
    
    sortedKeys.forEach(key => {
      const value = filteredData[key];
      // PayFast is very strict - only include non-empty values
      if (value !== null && value !== undefined && value !== "") {
        const stringValue = value.toString().trim();
        if (stringValue !== "") {
          paramString += `${key}=${stringValue}&`;
        }
      }
    });
    
    // Remove the last &
    paramString = paramString.slice(0, -1);
    
    // Add passphrase if provided - CRITICAL for production
    if (passPhrase && passPhrase.trim() !== "") {
      paramString += `&passphrase=${passPhrase.trim()}`;
    }
    
    console.log('PayFast Parameter String:', paramString); // Debug log
    console.log('PayFast Data Object:', filteredData); // Debug log
    return paramString;
  };
  
  const parameterString = createParameterString(data, passPhrase);
  
  // Generate MD5 hash for PayFast signature
  const signature = CryptoJS.MD5(parameterString).toString();
  console.log('Generated PayFast Signature:', signature); // Debug log
  return signature;
};

// Create PayFast payment data
export const createPayFastPayment = (donationData) => {
  const config = getPayFastConfig();
  
  const payFastData = {
    merchant_id: config.merchant_id,
    merchant_key: config.merchant_key,
    return_url: `${window.location.origin}/donation-success?ref=${donationData.reference_number}`,
    cancel_url: `${window.location.origin}/donation-cancelled?ref=${donationData.reference_number}`,
    notify_url: `${window.location.origin}/api/payfast-notify`,
    name_first: donationData.full_name.split(" ")[0],
    email_address: donationData.email,
    m_payment_id: donationData.reference_number,
    amount: parseFloat(donationData.amount).toFixed(2),
    item_name: "Donation to Young Eagles Home Centre",
    item_description: "Digital Future Fund Donation",
    custom_str2: donationData.contact_number,
    custom_str3: donationData.id, // Store the donation ID for webhook processing
  };
  
  // Only add optional fields if they have values
  const lastName = donationData.full_name.split(" ").slice(1).join(" ").trim();
  if (lastName) {
    payFastData.name_last = lastName;
  }
  
  if (donationData.company && donationData.company.trim()) {
    payFastData.custom_str1 = donationData.company.trim();
  }
  
  // Generate signature with passphrase
  payFastData.signature = generatePayFastSignature(payFastData, config.passphrase);
  
  return payFastData;
};
