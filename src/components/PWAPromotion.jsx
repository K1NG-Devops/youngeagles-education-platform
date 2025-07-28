import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMobile, FaDownload, FaTimes, FaStar, FaBolt, FaWifi } from 'react-icons/fa';

const PWAPromotion = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-24 left-6 right-6 md:left-auto md:right-24 md:w-80 z-40"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl text-white overflow-hidden">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <FaMobile className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Young Eagles PWA</h3>
                  <p className="text-sm opacity-90">Get the mobile app experience!</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <FaBolt className="mx-auto mb-1 text-yellow-300" />
                <span className="text-xs">Fast</span>
              </div>
              <div className="text-center">
                <FaWifi className="mx-auto mb-1 text-blue-300" />
                <span className="text-xs">Offline</span>
              </div>
              <div className="text-center">
                <FaStar className="mx-auto mb-1 text-yellow-300" />
                <span className="text-xs">Native</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://youngeagles.org.za', '_blank')}
                className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <FaDownload />
                Open PWA
              </motion.button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors"
              >
                ?
              </button>
            </div>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-black/20 p-4 border-t border-white/20">
                  <h4 className="font-semibold mb-2">Why download our PWA?</h4>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• 📱 Install like a native app</li>
                    <li>• ⚡ Lightning fast loading</li>
                    <li>• 📴 Works offline</li>
                    <li>• 🔔 Push notifications</li>
                    <li>• 💾 Saves data usage</li>
                    <li>• 🎯 Direct access from home screen</li>
                  </ul>
                  <div className="mt-3 p-2 bg-white/10 rounded text-xs">
                    <strong>How to install:</strong> Open in Safari/Chrome → Tap share → "Add to Home Screen"
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAPromotion;
