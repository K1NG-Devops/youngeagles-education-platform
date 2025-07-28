import React from 'react';
import { motion } from 'framer-motion';

const BubbleAnimation = () => {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4,
    x: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 backdrop-blur-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
          }}
          initial={{ y: '100vh', opacity: 0.7 }}
          animate={{ 
            y: '-20vh', 
            opacity: [0.7, 1, 0.7, 0],
            scale: [1, 1.1, 1, 0.8]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default BubbleAnimation;
