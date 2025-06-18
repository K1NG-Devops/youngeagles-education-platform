import React from 'react';
import { FaComments } from 'react-icons/fa';

const MessagingCenter = () => {
  return (
    <div className="p-4 space-y-4 max-w-full overflow-x-hidden pb-20">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <h1 className="text-xl font-bold mb-1">Messages</h1>
        <p className="text-sm text-indigo-100">Chat with teachers and other parents</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <FaComments className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Message system coming soon</p>
        <p className="text-sm text-gray-500">Stay tuned for real-time messaging features</p>
      </div>
    </div>
  );
};

export default MessagingCenter;
