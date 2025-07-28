import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMobile, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import DatabaseService from '../services/DatabaseService';
import { toast } from 'sonner';

const PWAEarlyAccessButton = ({ className = "" }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const result = await DatabaseService.signupPWAEarlyAccess({
        ...formData,
        deviceType: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        notificationPreferences: ['pwa_updates', 'early_access']
      });

      if (result.success !== false) {
        toast.success('Welcome to PWA Early Access!', {
          description: 'You\'ll be notified when our app is ready.'
        });
        setShowForm(false);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        throw new Error(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('PWA signup error:', error);
      toast.error('Signup failed', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white p-6 rounded-lg shadow-lg border-2 border-purple-200 ${className}`}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaMobile className="text-purple-600" />
          Join PWA Early Access
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="081 234 5678 (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSigningUp}
              className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSigningUp ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing up...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Get Early Access
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowForm(true)}
      className={`bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${className}`}
    >
      <FaMobile />
      Get Early Access
    </motion.button>
  );
};

export default PWAEarlyAccessButton;
