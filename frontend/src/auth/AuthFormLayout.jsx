import React from 'react';

const AuthFormLayout = ({ imageUrl, children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden bg-pink-50 dark:bg-gray-900">
      
      {/* Left Image Section (hidden on mobile) */}
      {imageUrl && (
        <div className="hidden md:block md:w-1/2">
          <img
            src={imageUrl}
            alt="Side visual"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 shadow-xl rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
