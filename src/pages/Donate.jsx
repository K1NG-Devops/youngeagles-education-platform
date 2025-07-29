import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FaHeart, FaPhone, FaCreditCard, FaUniversity, FaPaypal } from "react-icons/fa";
import { EducationalBanner } from "../components/Ads/AdManager_Safe";
import society5Background from "../assets/society-5.0.png";
import { donationApi } from "../config/supabase";
import { createPayFastPayment } from "../api/payfast";
import { emailService } from "../services/emailService";

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    contactNumber: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [donationReference, setDonationReference] = useState("");

  const donationAmounts = [
    { value: "50", label: "R50" },
    { value: "100", label: "R100" },
    { value: "150", label: "R150" },
    { value: "200", label: "R200" },
    { value: "250", label: "R250" },
    { value: "300", label: "R300" },
    { value: "350", label: "R350" },
    { value: "400", label: "R400" },
    { value: "450", label: "R450" },
    { value: "500", label: "R500" },
  ];

  const paymentMethods = [
    { value: "EFT", label: "EFT", icon: FaUniversity },
    { value: "Cash", label: "Cash", icon: FaHeart },
    { value: "PayFast", label: "PayFast (Card/EFT)", icon: FaCreditCard },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to generate PayFast signature (moved to separate file for security)
  // This is kept here temporarily for backward compatibility
  const generatePayFastSignature = (data, passPhrase = "") => {
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
      
      return paramString;
    };
    
    const parameterString = createParameterString(data, passPhrase);
    
    // This should be moved to server-side for better security
    console.warn('PayFast signature generation should be moved to server-side for production');
    return "temp_signature"; // Placeholder - implement server-side signature generation
  };

  const handlePayFastPayment = async () => {
    const amount = selectedAmount || customAmount;
    if (!amount || !formData.fullName || !formData.email) {
      alert("Please fill in all required fields and select an amount");
      return;
    }

    try {
      // First, create the donation record in Supabase
      const donationData = {
        full_name: formData.fullName,
        email: formData.email,
        contact_number: formData.contactNumber,
        company: formData.company || null,
        amount: parseFloat(amount),
        payment_method: 'PayFast',
        status: 'pending'
      };

      const result = await donationApi.createDonation(donationData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const donation = result.data;

      // Create PayFast payment data using the secure helper
      const payFastData = createPayFastPayment(donation);

      // Create form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.payfast.co.za/eng/process"; // Production PayFast URL

      Object.entries(payFastData).forEach(([key, value]) => {
        if (value) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error creating PayFast donation:', error);
      setSubmissionError('Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    if (selectedPayment === "PayFast") {
      await handlePayFastPayment();
      return;
    }

    // Handle EFT/Cash donations - Save to Supabase and send email
    try {
      const amount = selectedAmount || customAmount;
      
      const donationData = {
        full_name: formData.fullName,
        email: formData.email,
        contact_number: formData.contactNumber,
        company: formData.company || null,
        amount: parseFloat(amount),
        payment_method: selectedPayment,
        status: 'pending'
      };

      const result = await donationApi.createDonation(donationData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const donation = result.data;
      setDonationReference(donation.reference_number);

      // Send banking details email for EFT/Cash donations
      try {
        const emailResult = await emailService.sendBankingDetails(donation.id);
        if (!emailResult.success) {
          console.warn('Email sending failed:', emailResult.error);
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.warn('Email service unavailable:', emailError);
        // Continue with the process even if email fails
      }

      setIsSubmitting(false);
      setShowThankYou(true);
      
      // Reset form after showing thank you (longer timeout for EFT/Cash)
      setTimeout(() => {
        setShowThankYou(false);
        setFormData({
          fullName: "",
          company: "",
          contactNumber: "",
          email: "",
        });
        setSelectedAmount("");
        setCustomAmount("");
        setSelectedPayment("");
        setDonationReference("");
      }, 10000); // 10 seconds to read the banking details
    } catch (error) {
      console.error('Error creating donation:', error);
      setSubmissionError('Failed to submit donation. Please try again.');
      setIsSubmitting(false);
    }
  };

  const finalAmount = selectedAmount || customAmount;

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="max-w-2xl w-full mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="text-6xl text-green-500 mb-4">
              <FaHeart className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-4">
              Your generous donation of <strong>R{finalAmount}</strong> will make a real difference 
              in the lives of children at Young Eagles Education Platform.
            </p>
            
            {donationReference && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  Reference Number: <span className="font-mono">{donationReference}</span>
                </p>
                {selectedPayment !== "PayFast" && (
                  <div className="text-left">
                    <h3 className="font-bold text-blue-700 mb-2">Banking Details:</h3>
                    <p><strong>Account Name:</strong> YOUNG EAGLES HOME CARE CENTRE NPO</p>
                    <p><strong>Account Number:</strong> 62777403181</p>
                    <p><strong>Reference:</strong> {donationReference}</p>
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Please use the reference number when making your payment
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              {selectedPayment === "PayFast" 
                ? "You will receive a payment confirmation email shortly."
                : "You will receive detailed banking instructions via email shortly. WhatsApp us proof of payment at 081 523 6000."
              }
            </p>
            
            {submissionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700">{submissionError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={society5Background}
          alt="Digital education technology background - Society 5.0"
          className="w-full h-full object-cover object-center"
          style={{
            minHeight: '100vh',
            imageRendering: 'auto'
          }}
        />
        {/* Responsive overlay - darker on mobile for better text readability */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/35 md:bg-black/30 lg:bg-black/25 xl:bg-black/20"></div>
      </div>

      <div className="relative z-10 pt-32 sm:pt-36 lg:pt-40 w-full mx-auto p-2 sm:p-4 lg:p-8">
        {/* Logo and Header - Outside of Card */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/app-icons/yehc_logo.png"
              alt="Young Eagles Home Care Centre Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full shadow-2xl object-cover backdrop-blur-sm bg-white/10 border-4 border-white/30"
            />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 max-w-6xl mx-auto leading-tight drop-shadow-2xl px-2">
            <FaHeart className="inline-block w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-red-400 mr-2 sm:mr-4 drop-shadow-lg" />
            Donation Form – Help Us Build a Digital Future
          </h1>
        </div>

        <div className="w-full max-w-7xl mx-auto">
          <div className="shadow-2xl backdrop-blur-sm bg-white/95 border-white/20 rounded-2xl overflow-hidden">
            <div className="space-y-8 sm:space-y-12 px-2 sm:px-4 lg:px-8 xl:px-12 py-8 sm:py-12">
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-blue-50/90 to-cyan-50/90 p-4 sm:p-6 lg:p-8 xl:p-12 rounded-2xl border border-blue-200/60 w-full">
              <p className="text-gray-700 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed mb-6 sm:mb-8 text-center">
                At Young Eagles Home Centre, we are on a bold journey to digitize early childhood education. Our goal is
                to introduce our large TV – acquiring a large TV to serve as a smart board. But to go further.
              </p>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl xl:text-3xl text-center">Your donation will help us with:</h3>
                <div className="grid grid-cols-1 justify-left items-left lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 w-full">
                  <div className="flex items-center justify-start">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 text-base sm:text-lg lg:text-xl">Tablets & computers</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 text-base sm:text-lg lg:text-xl">Robotics and AI resources</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 text-base sm:text-lg lg:text-xl">Educational books</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 text-base sm:text-lg lg:text-xl">Website and platform development</span>
                  </div>
                  <div className="flex items-center justify-start xl:col-span-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-gray-700 text-base sm:text-lg lg:text-xl">Hosting and digital tools for online learning</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12 w-full">
              {/* Error Display */}
              {submissionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-center">{submissionError}</p>
                </div>
              )}

              {/* Donor Information */}
              <div className="bg-white/90 p-4 lg:p-12 xl:p-16 border rounded-2xl shadow-lg">
                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-8 flex items-center justify-center">
                  <FaHeart className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-red-500 mr-4" />
                  Make a Donation Today
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <Label htmlFor="fullName" className="text-lg lg:text-xl font-medium">
                      Donor's Full Name: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="mt-3 h-14 text-lg lg:text-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-lg lg:text-xl font-medium">
                      Company/Organization (if applicable):
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-3 h-14 text-lg lg:text-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactNumber" className="text-lg lg:text-xl font-medium">
                      Contact Number: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="mt-3 h-14 text-lg lg:text-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg lg:text-xl font-medium">
                      Email Address: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-3 h-14 text-lg lg:text-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Donation Amount */}
              <div className="bg-white/90 p-4 lg:p-12 xl:p-16 border rounded-2xl shadow-lg">
                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-8 text-center">Donation Amount</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
                  {donationAmounts.map((amount) => (
                    <label key={amount.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="amount"
                        value={amount.value}
                        checked={selectedAmount === amount.value}
                        onChange={(e) => {
                          setSelectedAmount(e.target.value);
                          setCustomAmount("");
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`p-2 lg:p-6 text-center border-2 rounded-2xl transition-all duration-200 text-lg lg:text-xl xl:text-2xl font-semibold ${
                          selectedAmount === amount.value
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg transform scale-105"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md hover:scale-102"
                        }`}
                      >
                        {amount.label}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6 max-w-2xl mx-auto">
                  <Label htmlFor="customAmount" className="text-lg lg:text-xl xl:text-2xl font-medium whitespace-nowrap">
                    Other Amount: R
                  </Label>
                  <Input
                    id="customAmount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("");
                    }}
                    placeholder="Enter custom amount"
                    className="h-14 lg:h-16 text-lg lg:text-xl w-full lg:w-80"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/90 p-2 lg:p-12 xl:p-16 border rounded-2xl shadow-lg">
                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4 text-center">Payment Method</h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center justify-center lg:justify-start space-x-4 cursor-pointer p-6 lg:p-8 border-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={selectedPayment === method.value}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-6 h-6 text-blue-600"
                      />
                      <span className="text-lg lg:text-xl xl:text-2xl font-medium flex items-center">
                        <method.icon className="w-6 h-6 lg:w-8 lg:h-8 mr-4 text-blue-600" />
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedPayment === "PayFast" && (
                  <div className="mt-8 p-6 lg:p-8 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-lg lg:text-xl text-green-700 text-center">
                      <FaCreditCard className="inline-block w-6 h-6 mr-3" />
                      PayFast allows secure online payments via credit card, debit card, or EFT. You will be redirected
                      to PayFast's secure payment page.
                    </p>
                  </div>
                )}
              </div>

              {/* Banking Details & Contact - Only show if PayFast is NOT selected */}
              {selectedPayment !== "PayFast" && (
                <div className="bg-gradient-to-br from-blue-50/95 via-white/90 to-cyan-50/95 p-2 lg:p-12 xl:p-16 rounded-3xl border-2 border-blue-200/40 shadow-xl">
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center">
                    <FaUniversity className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-blue-600 mr-4" />
                    Banking Details & Contact
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Banking Details */}
                    <div className="space-y-6">
                      <div className="bg-white/80 p-2 sm:p-4 lg:p-6 rounded-2xl shadow-lg border border-blue-100">
                        <h4 className="text-xl lg:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 text-center">Banking Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-blue-200/50">
                            <span className="font-semibold text-blue-700 text-sm lg:text-base block mb-2 uppercase tracking-wide">Entity Name</span>
                            <span className="text-gray-800 text-base lg:text-lg font-bold break-words">YOUNG EAGLES HOME CARE CENTRE NPO</span>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-blue-200/50">
                            <span className="font-semibold text-blue-700 text-sm lg:text-base block mb-2 uppercase tracking-wide">Registration ID</span>
                            <span className="text-gray-800 text-base lg:text-lg font-bold">104-850-NPO</span>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-green-200/50">
                            <span className="font-semibold text-green-700 text-sm lg:text-base block mb-2 uppercase tracking-wide">Account Number</span>
                            <span className="text-gray-800 font-mono text-lg lg:text-xl font-bold tracking-wider">62777403181</span>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-yellow-200/50">
                            <span className="font-semibold text-amber-700 text-sm lg:text-base block mb-2 uppercase tracking-wide">Account Type</span>
                            <span className="text-gray-800 text-base lg:text-lg font-bold">Gold Business Account</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="xl:col-span-2 flex flex-col justify-center space-y-6">
                      <div className="bg-white/80 p-6 lg:p-8 rounded-2xl shadow-lg border border-green-100">
                        <h4 className="text-xl lg:text-2xl font-bold text-green-800 mb-6 text-center">Get In Touch</h4>
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 lg:px-8 lg:py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center justify-center space-x-4">
                              <FaPhone className="w-6 h-6 lg:w-8 lg:h-8" />
                              <div className="text-center">
                                <div className="text-sm lg:text-base font-medium opacity-90">WhatsApp</div>
                                <div className="text-lg lg:text-xl xl:text-2xl font-bold">081 523 6000</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center p-4 bg-blue-50/50 rounded-xl">
                            <p className="text-sm lg:text-base text-gray-600 font-medium">
                              For any questions about your donation or banking details
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-8 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 p-4 lg:p-6 rounded-xl border border-amber-200/60">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      <p className="text-center text-sm lg:text-base text-amber-800 font-medium">
                        <strong>Secure Donation:</strong> All banking details are verified and secure. Your contribution directly supports our educational mission.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center text-white pt-8">
                <Button
                  type="submit"
                  disabled={!formData.fullName || !formData.contactNumber || !formData.email || !finalAmount || !selectedPayment || isSubmitting}
                  className="w-full lg:w-auto bg-blue-700 cursor-pointer hover:bg-blue-800 px-12 lg:px-16 xl:px-20 py-6 lg:py-8 text-xl lg:text-2xl xl:text-3xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105 rounded-2xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : selectedPayment === "PayFast" ? (
                    <>
                      <FaCreditCard className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mr-4" />
                      Pay Now with PayFast
                    </>
                  ) : (
                    <>
                      <FaHeart className="text-red-900 w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mr-4" />
                      Submit Donation
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-orange-50/90 to-red-50/90 p-8 lg:p-12 xl:p-16 rounded-2xl text-center border border-orange-200/60 max-w-5xl mx-auto">
              <p className="text-gray-700 text-xl lg:text-2xl xl:text-3xl leading-relaxed">
                <FaHeart className="inline-block w-6 h-6 lg:w-8 lg:h-8 text-red-500 mr-4" />
                <span className="font-bold text-orange-600">Thank you for sowing into a child's future.</span> Your
                contribution brings us closer to a future-ready generation.
              </p>
            </div>

            {/* Ad Banner */}
            <div className="mt-16 max-w-6xl mx-auto">
              <EducationalBanner />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}