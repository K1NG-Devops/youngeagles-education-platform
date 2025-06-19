import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import { FaQrcode, FaMobile, FaDesktop, FaExternalLinkAlt } from 'react-icons/fa';
import PWAQRCode from '../components/PWAQRCode';

const DownloadApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <img
                src="/app-icons/yehc_logo.png"
                alt="Young Eagles"
                className="h-8 w-8 rounded-full object-cover"
              />
              <h1 className="text-lg font-bold text-gray-900">Young Eagles</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FaHome className="mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download Young Eagles App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get our mobile app for the best experience managing your child's education, 
            homework, and school communications.
          </p>
        </div>

        {/* PWA Access Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Young Eagles App
            </h2>
            <p className="text-gray-600">
              Open our Progressive Web App (PWA) for the best mobile experience
            </p>
          </div>

          {/* PWA Access Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct Link */}
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaExternalLinkAlt className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Open PWA App</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access the app directly in your browser
              </p>
              <a
                href={window.location.hostname === 'localhost' ? 'http://localhost:3002' : `${window.location.protocol}//${window.location.host}/app`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaMobile className="mr-2" />
                Open App
              </a>
              <p className="text-xs text-gray-500 mt-2">
                You can install this as an app on your device
              </p>
            </div>

            {/* QR Code */}
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-2xl text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 text-sm mb-4">
                Quick access with your mobile device
              </p>
              <div className="flex justify-center mb-4">
                <PWAQRCode 
                  url={window.location.hostname === 'localhost' ? 'http://localhost:3002' : `${window.location.protocol}//${window.location.host}/app`}
                  size={128}
                />
              </div>
              <p className="text-xs text-gray-500">
                Scan with your camera app
              </p>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">💡 Install as App:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Mobile (Chrome/Safari):</strong> Open the link → Tap menu → "Add to Home Screen"</p>
              <p><strong>Desktop (Chrome):</strong> Open the link → Click install icon in address bar</p>
              <p><strong>Android:</strong> Open in Chrome → Menu → "Install app"</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Use Our PWA App?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaMobile className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600 text-sm">
                Full mobile experience with smooth navigation and touch-friendly interface.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Push Notifications</h3>
              <p className="text-gray-600 text-sm">
                Get instant notifications for homework, events, and important school updates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600 text-sm">
                Lightning-fast performance with offline capabilities and instant loading.
              </p>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Device Compatibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📱 Mobile Devices:</h4>
              <ul className="space-y-1">
                <li>• iOS 11.3+ (Safari)</li>
                <li>• Android 5+ (Chrome)</li>
                <li>• Works on any modern browser</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">💻 Desktop:</h4>
              <ul className="space-y-1">
                <li>• Chrome, Firefox, Safari, Edge</li>
                <li>• Windows, macOS, Linux</li>
                <li>• Installable as desktop app</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any issues downloading or installing the app, please contact our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Support
            </Link>
            <Link 
              to="/help"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              View Help Docs
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Young Eagles Home Care Centre. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link to="/contact" className="hover:text-gray-900">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DownloadApp;

