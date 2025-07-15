import React, { useState } from 'react';
import { FaRocket, FaStar, FaCheck, FaPhone, FaEnvelope } from 'react-icons/fa';

const MarketingCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Give Your Child the Best Start?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Join hundreds of families who trust Young Eagles for their child's educational journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center">
              <FaCheck className="text-green-400 mr-3" />
              <span>Society 5.0 Integration</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-green-400 mr-3" />
              <span>Certified Expert Staff</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-green-400 mr-3" />
              <span>Flexible Programs</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-green-400 mr-3" />
              <span>Safe Environment</span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitted ? 'Subscribed!' : 'Get Updates'}
              </button>
            </form>
          </div>

          {/* Contact Options */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Contact Us Today</h3>
              <div className="space-y-3">
                <a
                  href="tel:+15551234567"
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors"
                >
                  <FaPhone className="mr-2" />
                  Call Now
                </a>
                <a
                  href="mailto:info@youngeagles.edu"
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white border-opacity-20">
          <div className="text-center">
            <div className="text-2xl font-bold">200+</div>
            <div className="text-sm opacity-80">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm opacity-80">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm opacity-80">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            <div className="text-sm opacity-80">5-Star Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCTA;
