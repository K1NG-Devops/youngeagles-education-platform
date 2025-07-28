import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import AdManager from './AdManager';

const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/app-icons/yehc_logo.png" alt="Young Eagles Logo" className="h-12 w-12 rounded-full" />
            <div>
              <h3 className="text-xl font-bold">Young Eagles</h3>
              <p className="text-blue-300">Education Platform</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4 max-w-md">
            Where learning meets love. We nurture little minds with big dreams through play, care, 
            and creativity with cutting-edge Society 5.0 integration.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <FaLinkedin className="text-xl" />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <FaTwitter className="text-xl" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-blue-300">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Parent Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-blue-300">Contact Info</h4>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-300">
              <FaPhone className="mr-3 text-blue-400" />
              <span>081 523 6000</span>
            </li>
            <li className="flex items-center text-gray-300">
              <FaEnvelope className="mr-3 text-blue-400" />
              <span>info@youngeagles.org.za</span>
            </li>
            <li className="flex items-start text-gray-300">
              <FaMapMarkerAlt className="mr-3 text-blue-400 mt-1" />
              <span>7118 Section U Shabangu Street<br />Mamelodi Pretoria 0122</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Ad Banner */}
      <div className="mt-8 mb-4">
        <AdManager placement="footer" className="flex justify-center" />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Young Eagles Education Platform. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</Link>
          <Link to="/sitemap" className="text-gray-300 hover:text-white text-sm transition-colors">Sitemap</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;