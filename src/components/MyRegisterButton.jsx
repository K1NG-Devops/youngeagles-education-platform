import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaCalendarAlt } from 'react-icons/fa';
import Register2026Modal from './Register2026Modal';

function MyRegisterButton({ className = "", variant = "primary" }) {
  const [showModal, setShowModal] = useState(false);

  const variants = {
    primary: "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700",
    secondary: "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50",
    outline: "border-2 border-white text-white hover:bg-white hover:text-purple-600"
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${variants[variant]} ${className}`}
      >
        <FaCalendarAlt />
        Register for 2026
      </motion.button>
      
      <Register2026Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}

export default MyRegisterButton;
