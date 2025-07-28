import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
  const elements = [
    { emoji: '🎈', size: 'text-2xl', delay: 0, duration: 8 },
    { emoji: '⭐', size: 'text-xl', delay: 1, duration: 6 },
    { emoji: '🌈', size: 'text-3xl', delay: 2, duration: 10 },
    { emoji: '🎨', size: 'text-lg', delay: 3, duration: 7 },
    { emoji: '📚', size: 'text-xl', delay: 4, duration: 9 },
    { emoji: '🧸', size: 'text-2xl', delay: 2.5, duration: 8 },
    { emoji: '🚀', size: 'text-lg', delay: 1.5, duration: 7 },
    { emoji: '🎵', size: 'text-xl', delay: 3.5, duration: 6 },
    { emoji: '🌟', size: 'text-sm', delay: 0.5, duration: 8 },
    { emoji: '🎯', size: 'text-lg', delay: 4.5, duration: 9 },
    { emoji: '🎭', size: 'text-xl', delay: 2.8, duration: 7 },
    { emoji: '🏆', size: 'text-lg', delay: 1.2, duration: 8 }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} opacity-20`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth,
            rotate: 360
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: Math.random() * 90 + '%',
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
