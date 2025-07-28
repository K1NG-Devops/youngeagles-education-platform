import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChild, FaUser, FaEnvelope, FaPhone, FaCalendar, FaBaby, FaCheckCircle, FaSpinner, FaTimes, FaMobile } from 'react-icons/fa';
import DatabaseService from '../services/DatabaseService';
import { toast } from 'sonner';

const Register2026Modal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    childGender: '',
    preferredProgram: '',
    additionalNotes: ''
  });

  const programs = [
    { id: 'mini-coders', name: '🤖 Mini Coders & Robo Buddies (Ages 3-5)', ages: '3-5' },
    { id: 'little-builders', name: '🏗️ Little Builders & Tinkerers (Ages 2-5)', ages: '2-5' },
    { id: 'creative-cubs', name: '🎨 Creative Cubs Art Studio (Ages 2-5)', ages: '2-5' },
    { id: 'imagination-station', name: '📚 Imagination Station (Ages 2-5)', ages: '2-5' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await DatabaseService.register2026(formData);
      
      if (result.success !== false) {
        toast.success('Registration successful! We\'ll contact you soon.', {
          description: 'Welcome to Young Eagles 2026 intake!'
        });
        setCurrentStep(4); // Success step
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      childName: '',
      childAge: '',
      childGender: '',
      preferredProgram: '',
      additionalNotes: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Register for 2026 Intake</h2>
                <p className="opacity-90">Secure your child's spot at Young Eagles</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step
                        ? 'bg-white text-purple-600'
                        : 'bg-white/30 text-white/70'
                    }`}
                  >
                    {step === 4 && currentStep >= 4 ? <FaCheckCircle /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > step ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Parent Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaUser className="text-purple-600" />
                      Parent Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="081 234 5678"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Child Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaChild className="text-purple-600" />
                      Child Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Child's Name *</label>
                      <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter child's full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Age (in 2026) *</label>
                        <select
                          name="childAge"
                          value={formData.childAge}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select age</option>
                          <option value="2">2 years</option>
                          <option value="3">3 years</option>
                          <option value="4">4 years</option>
                          <option value="5">5 years</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Gender *</label>
                        <select
                          name="childGender"
                          value={formData.childGender}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Program Selection */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaBaby className="text-purple-600" />
                      Program Selection
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Program *</label>
                      <div className="space-y-2">
                        {programs.map((program) => (
                          <label
                            key={program.id}
                            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="preferredProgram"
                              value={program.id}
                              checked={formData.preferredProgram === program.id}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <span className="font-medium">{program.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Any special requirements or questions..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-3xl text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for registering for our 2026 intake. We'll contact you soon with more details.
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`px-6 py-3 rounded-lg border transition-colors ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Register2026Modal;
