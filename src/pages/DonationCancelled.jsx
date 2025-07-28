import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FaHeart, FaTimesCircle, FaHome, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DonationCancelled() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="max-w-2xl w-full mx-4 shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="text-8xl text-red-500 mb-8">
            <FaTimesCircle className="mx-auto" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Payment Cancelled
          </h1>
          
          <div className="text-6xl text-gray-400 mb-6">
            <FaHeart className="mx-auto" />
          </div>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            Your PayFast payment was cancelled. No charges have been made to your account.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-orange-700 font-medium">
              ℹ️ Your payment transaction was not completed
            </p>
            <p className="text-lg text-orange-700 font-medium mt-2">
              💡 You can try again or choose a different payment method
            </p>
            <p className="text-lg text-orange-700 font-medium mt-2">
              🤝 We appreciate your willingness to support our cause
            </p>
          </div>
          
          <div className="space-y-4 space-x-0 lg:space-y-0 lg:space-x-4 flex flex-col lg:flex-row justify-center items-center">
            <Link to="/donate">
              <Button className="w-full lg:w-auto bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FaArrowLeft className="w-5 h-5 mr-3" />
                Try Again
              </Button>
            </Link>
            
            <Link to="/">
              <Button 
                variant="outline" 
                className="w-full lg:w-auto border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaHome className="w-5 h-5 mr-3" />
                Return to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Need help? Contact us at{" "}
              <span className="font-semibold text-green-600">081 523 6000</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
