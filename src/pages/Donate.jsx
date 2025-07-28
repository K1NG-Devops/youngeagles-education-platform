import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Heart, Phone, CreditCard } from "lucide-react"

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    contactNumber: "",
    email: "",
  })

  const donationAmounts = [
    { value: "50", label: "R50" },
    { value: "100", label: "R100" },
    { value: "250", label: "R250" },
    { value: "500", label: "R500" },
    { value: "1000", label: "R1000" },
  ]

  const paymentMethods = [
    { value: "EFT", label: "EFT" },
    { value: "Cash", label: "Cash" },
    { value: "PayFast", label: "PayFast (Card/EFT)" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayFastPayment = () => {
    const amount = selectedAmount || customAmount
    if (!amount || !formData.fullName || !formData.email) {
      alert("Please fill in all required fields and select an amount")
      return
    }

    // PayFast integration
    const payFastData = {
      merchant_id: "10000100", // Replace with your PayFast merchant ID
      merchant_key: "46f0cd694581a", // Replace with your PayFast merchant key
      return_url: `${window.location.origin}/donation-success`,
      cancel_url: `${window.location.origin}/donation-cancelled`,
      notify_url: `${window.location.origin}/api/payfast-notify`,
      name_first: formData.fullName.split(" ")[0],
      name_last: formData.fullName.split(" ").slice(1).join(" ") || "",
      email_address: formData.email,
      m_payment_id: `YEHC_${Date.now()}`,
      amount: amount,
      item_name: "Donation to Young Eagles Home Centre",
      item_description: "Digital Future Fund Donation",
      custom_str1: formData.company,
      custom_str2: formData.contactNumber,
    }

    // Create form and submit to PayFast
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://sandbox.payfast.co.za/eng/process" // Use https://www.payfast.co.za/eng/process for production

    Object.entries(payFastData).forEach(([key, value]) => {
      if (value) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value.toString()
        form.appendChild(input)
      }
    })

    document.body.appendChild(form)
    form.submit()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (selectedPayment === "PayFast") {
      handlePayFastPayment()
      return
    }

    console.log("Form submitted:", {
      ...formData,
      selectedAmount: selectedAmount || customAmount,
      selectedPayment,
    })

    // Handle other payment methods
    alert("Thank you for your donation! We will contact you with further details.")
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/gallery/img1.jpg"
          alt="Children learning background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <Card className="shadow-2xl backdrop-blur-sm bg-white/75 border-white/10">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img
                src="/app-icons/yehc_logo.png"
                alt="Young Eagles Home Care Centre Logo"
                className="w-[120px] h-[120px] rounded-full shadow-lg object-cover"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              <Heart className="inline-block w-6 h-6 text-red-500 mr-2" />
              Donation Form – Help Us Build a Digital Future
            </h1>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 p-6 rounded-lg border border-blue-100/30">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Young Eagles Home Centre, we are on a bold journey to digitize early childhood education. Our goal is
                to introduce our large TV – acquiring a large TV to serve as a smart board. But to go further.
              </p>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Your donation will help us with:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Tablets & computers
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Robotics and AI resources
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Educational books
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Website and platform development
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Hosting and digital tools for online learning
                  </li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donor Information */}
              <div className="bg-white/70 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  Make a Donation Today
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Donor's Full Name: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company/Organization (if applicable):
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactNumber" className="text-sm font-medium">
                      Contact Number: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Donation Amount */}
              <div className="bg-white/70 p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Amount</h3>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {donationAmounts.map((amount) => (
                    <label key={amount.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="amount"
                        value={amount.value}
                        checked={selectedAmount === amount.value}
                        onChange={(e) => {
                          setSelectedAmount(e.target.value)
                          setCustomAmount("")
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                          selectedAmount === amount.value
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                        }`}
                      >
                        {amount.label}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="customAmount" className="text-sm font-medium whitespace-nowrap">
                    Other: R
                  </Label>
                  <Input
                    id="customAmount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount("")
                    }}
                    placeholder="Enter amount"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/70 p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedPayment === method.value}
                        onCheckedChange={(checked) => {
                          setSelectedPayment(checked ? method.value : "")
                        }}
                      />
                      <span className="text-sm font-medium flex items-center">
                        {method.value === "PayFast" && <CreditCard className="w-4 h-4 mr-2 text-green-600" />}
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedPayment === "PayFast" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <CreditCard className="inline-block w-4 h-4 mr-1" />
                      PayFast allows secure online payments via credit card, debit card, or EFT. You will be redirected
                      to PayFast's secure payment page.
                    </p>
                  </div>
                )}
              </div>

              {/* Banking Details & QR Code */}
              <div className="bg-gradient-to-r from-gray-50/60 to-blue-50/60 p-6 rounded-lg border border-gray-200/30">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Details & Contact</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-600">Entity Name:</span>
                      <span className="text-gray-800">YOUNG EAGLES HOME CARE CENTRE NPO</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-600">Registration Number/ID:</span>
                      <span className="text-gray-800">104-850-NPO</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-600">Account Number:</span>
                      <span className="text-gray-800 font-mono">62777403181</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-600">Account Type:</span>
                      <span className="text-gray-800">Gold Business Account</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-200">
                      <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500 text-center">WhatsApp QR Code<br />081 523 6000</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600 bg-white px-4 py-2 rounded-full shadow-sm">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">WhatsApp: 081 523 6000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {selectedPayment === "PayFast" ? (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now with PayFast
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Submit Donation
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-orange-50/60 to-red-50/60 p-6 rounded-lg text-center border border-orange-200/30">
              <p className="text-gray-700">
                <Heart className="inline-block w-4 h-4 text-red-500 mr-1" />
                <span className="font-semibold text-orange-600">Thank you for sowing into a child's future.</span> Your
                contribution brings us closer to a future-ready generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
