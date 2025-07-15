import React, { useState } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin,
  FaStar,
  FaCheckCircle,
  FaPaperPlane,
  FaChild,
  FaUsers,
  FaHeart
} from 'react-icons/fa';
import SEOManager from '../components/SEO/SEOManager';
import { EducationalBanner, SidebarAd } from '../components/Ads/AdManager';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    message: '',
    program: '',
    visitPreference: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        childAge: '',
        message: '',
        program: '',
        visitPreference: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["081 523 6000 (Main)", "067 494 2359 (Secondary)"],
      color: "text-blue-600"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["info@youngeagles.org.za", "admin@youngeagles.org.za"],
      color: "text-green-600"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: ["7118 Section U Shabangu Street", "Mamelodi Pretoria 0122"],
      color: "text-purple-600"
    },
    {
      icon: FaClock,
      title: "Hours",
      details: ["Monday - Friday: 7:00 AM - 6:00 PM", "Saturday: 8:00 AM - 4:00 PM"],
      color: "text-orange-600"
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, url: "#", color: "text-blue-600 hover:text-blue-800" },
    { icon: FaInstagram, url: "#", color: "text-pink-600 hover:text-pink-800" },
    { icon: FaTwitter, url: "#", color: "text-blue-400 hover:text-blue-600" },
    { icon: FaLinkedin, url: "#", color: "text-blue-700 hover:text-blue-900" }
  ];

  const quickStats = [
    { icon: FaChild, number: "200+", label: "Happy Children" },
    { icon: FaUsers, number: "50+", label: "Expert Staff" },
    { icon: FaStar, number: "15+", label: "Years Experience" },
    { icon: FaHeart, number: "99%", label: "Parent Satisfaction" }
  ];

  return (
    <>
      <SEOManager 
        title="Contact Young Eagles Education Platform - Get in Touch Today"
        description="Contact Young Eagles Education Platform for enrollment, tours, and questions about our premium daycare and early learning programs. Call us at (555) 123-4567."
        keywords="contact young eagles, daycare enrollment, schedule tour, early learning contact, STEM education inquiry"
        url="https://youngeagles.edu/contact"
      />
      
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Ready to give your child the best start? Let's connect and discuss how we can help your little one soar!
            </p>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="text-3xl text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600">We've received your message and will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Child's Age</label>
                        <select
                          name="childAge"
                          value={formData.childAge}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select age range</option>
                          <option value="6-months-2-years">6 months - 2 years</option>
                          <option value="2-3-years">2 - 3 years</option>
                          <option value="3-4-years">3 - 4 years</option>
                          <option value="4-6-years">4 - 6 years</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Program Interest</label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a program</option>
                        <option value="little-explorers">Little Explorers (6m-2y)</option>
                        <option value="curious-minds">Curious Minds (2-3y)</option>
                        <option value="young-scholars">Young Scholars (3-4y)</option>
                        <option value="future-leaders">Future Leaders (4-6y)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Visit Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visitPreference"
                            value="morning"
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-sm">Morning</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visitPreference"
                            value="afternoon"
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-sm">Afternoon</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visitPreference"
                            value="weekend"
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-sm">Weekend</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about your needs, questions, or anything else you'd like us to know..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      const IconComponent = info.icon;
                      return (
                        <div key={index} className="flex items-start">
                          <IconComponent className={`text-2xl ${info.color} mr-4 mt-1`} />
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-gray-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive Map Coming Soon</p>
                      <p className="text-sm text-gray-500">123 Learning Lane, Education City</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className={`text-2xl ${social.color} transition-colors duration-200`}
                        >
                          <IconComponent />
                        </a>
                      );
                    })}
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    Stay connected for updates, photos, and parenting tips!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <EducationalBanner 
              title="Local Family Services"
              description="Connect with trusted local family services, pediatricians, and educational resources in our community."
              buttonText="Explore Services"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Quick answers to common questions</p>
            </div>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">What are your enrollment requirements?</h3>
                <p className="text-gray-600 text-sm">We welcome children aged 6 months to 6 years. All we need is completed enrollment forms, immunization records, and emergency contacts.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">Do you provide meals?</h3>
                <p className="text-gray-600 text-sm">Yes! We provide nutritious breakfast, lunch, and snacks. Our menu follows USDA guidelines and accommodates dietary restrictions.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">What's your teacher-to-child ratio?</h3>
                <p className="text-gray-600 text-sm">We maintain low ratios: 1:4 for infants, 1:5 for toddlers, 1:8 for preschoolers, ensuring personalized attention for every child.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">Can I schedule a tour?</h3>
                <p className="text-gray-600 text-sm">Absolutely! We encourage tours so you can see our facilities and meet our team. Contact us to schedule your visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-12 bg-red-50 border-t-4 border-red-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Contact</h2>
            <p className="text-red-700 mb-4">For urgent matters outside business hours:</p>
            <a href="tel:+15551234567" className="text-xl font-bold text-red-800 hover:text-red-900">
              Emergency Line: +1 (555) 123-4567
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
  