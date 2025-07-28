import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaStar, FaCheck, FaPhone, FaEnvelope, FaGift, FaHeart } from 'react-icons/fa';
import DatabaseService from '../services/DatabaseService';
import { toast } from 'sonner';

const MarketingCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await DatabaseService.subscribeNewsletter(email);
      setIsSubmitted(true);
      toast.success('Welcome to our newsletter!', {
        description: 'You\'ll receive updates about programs and events.'
      });
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      toast.error('Subscription failed', {
        description: 'Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🎈</div>
        <div className="absolute top-20 right-20 text-4xl">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl">🌈</div>
        <div className="absolute bottom-10 right-10 text-3xl">🎨</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Give Your Child the Best Start?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Join hundreds of families who trust Young Eagles for their child's educational journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              { icon: FaCheck, text: 'Society 5.0 Integration', color: 'text-green-400' },
              { icon: FaHeart, text: 'Certified Expert Staff', color: 'text-pink-400' },
              { icon: FaStar, text: 'Flexible Programs', color: 'text-yellow-400' },
              { icon: FaGift, text: 'Safe Environment', color: 'text-blue-400' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center group"
              >
                <item.icon className={`${item.color} mr-3 text-lg group-hover:scale-110 transition-transform`} />
                <span className="group-hover:text-yellow-200 transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Signup - Fixed UI */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                📧
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated!</h3>
              <p className="text-white/80 text-sm">Get exclusive updates & early access</p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-4 rounded-xl bg-white/20 border border-white/30 placeholder-white/70 text-white focus:bg-white/30 focus:border-white/50 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading || isSubmitted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mr-2"
                    />
                    Subscribing...
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center justify-center">
                    <FaCheck className="mr-2" />
                    Subscribed! 🎉
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaGift className="mr-2" />
                    Get Updates & Offers
                  </span>
                )}
              </motion.button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-white/60">
                ✨ No spam, unsubscribe anytime
              </p>
            </div>
          </motion.div>

          {/* Contact Options */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
                <span className="mr-2">📞</span>
                Contact Us Today
              </h3>
              <div className="space-y-4">
                <motion.a
                  href="tel:0815236000"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaPhone className="mr-3" />
                  <div className="text-left">
                    <div className="font-bold">Call Now</div>
                    <div className="text-sm opacity-90">081 523 6000</div>
                  </div>
                </motion.a>
                
                <motion.a
                  href="mailto:info@youngeagles.org.za"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaEnvelope className="mr-3" />
                  <div className="text-left">
                    <div className="font-bold">Send Email</div>
                    <div className="text-sm opacity-90">Quick Response</div>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20"
        >
          {[
            { number: '200+', label: 'Happy Families', emoji: '👨‍👩‍👧‍👦' },
            { number: '15+', label: 'Years Experience', emoji: '📅' },
            { number: '98%', label: 'Satisfaction Rate', emoji: '⭐' },
            { number: '10', label: 'Expert Staff', emoji: '👩‍🏫' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              className="text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {stat.emoji}
              </div>
              <div className="text-2xl font-bold">{stat.number}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarketingCTA;
