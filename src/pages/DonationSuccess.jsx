import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FaHeart, FaCheckCircle, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DonationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="max-w-2xl w-full mx-4 shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="text-8xl text-green-500 mb-8">
            <FaCheckCircle className="mx-auto animate-pulse" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Payment Successful!
          </h1>
          
          <div className="text-6xl text-red-400 mb-6">
            <FaHeart className="mx-auto" />
          </div>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            Thank you for your generous donation to the Young Eagles Home Centre! 
            Your contribution will help us build a digital future for children.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-green-700 font-medium">
              ✅ Your payment has been processed successfully
            </p>
            <p className="text-lg text-green-700 font-medium mt-2">
              📧 A confirmation email will be sent to you shortly
            </p>
            <p className="text-lg text-green-700 font-medium mt-2">
              🏦 Please keep your transaction reference for your records
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FaHome className="w-5 h-5 mr-3" />
                Return to Home
              </Button>
            </Link>
            
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                For any questions, contact us at{" "}
                <span className="font-semibold text-green-600">081 523 6000</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
