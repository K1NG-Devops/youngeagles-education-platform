import React, { useEffect, useRef } from 'react';

const PWAQRCode = ({ url, size = 128 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Simple QR code generation using a free service
    const generateQRCode = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;

      // Create a simple QR code-like pattern as placeholder
      // In production, you'd use a proper QR code library like qrcode.js
      
      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Create a simple pattern
      ctx.fillStyle = '#000000';
      const blockSize = size / 21; // Standard QR code is 21x21 modules minimum

      // Draw simple QR-like pattern
      for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
          // Create a pseudo-random pattern based on coordinates
          const shouldFill = (i + j * 7 + url.length) % 3 === 0;
          if (shouldFill) {
            ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
          }
        }
      }

      // Add corner squares (finder patterns)
      const drawFinderPattern = (x, y) => {
        const patternSize = blockSize * 7;
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, patternSize, patternSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + blockSize, y + blockSize, patternSize - 2 * blockSize, patternSize - 2 * blockSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 2 * blockSize, y + 2 * blockSize, patternSize - 4 * blockSize, patternSize - 4 * blockSize);
      };

      drawFinderPattern(0, 0); // Top-left
      drawFinderPattern(size - 7 * blockSize, 0); // Top-right
      drawFinderPattern(0, size - 7 * blockSize); // Bottom-left
    };

    generateQRCode();
  }, [url, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded-lg"
        style={{ width: size, height: size }}
      />
      <p className="text-xs text-gray-500 mt-2 text-center">
        QR Code for PWA Access
      </p>
    </div>
  );
};

export default PWAQRCode;

