import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaComment } from 'react-icons/fa';

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '0815236000';
  const welcomeMessage = "Hi! I'm interested in Young Eagles Education Platform. Can you help me?";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(welcomeMessage)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const predefinedMessages = [
    "I want to enroll my child for 2026",
    "Tell me about your programs",
    "What are your fees?",
    "Can I schedule a visit?",
    "When do applications open?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 bg-white rounded-lg shadow-2xl p-4 w-80 border border-green-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Young Eagles</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Welcome Message */}
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                👋 Hi there! How can we help you today?
              </p>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2 mb-4">
              {predefinedMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                    window.open(url, '_blank');
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  {message}
                </button>
              ))}
            </div>

            {/* Start Chat Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Start Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <FaTimes className="text-xl" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <FaWhatsapp className="text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Dot */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <FaComment className="text-white text-xs" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppFloat;
