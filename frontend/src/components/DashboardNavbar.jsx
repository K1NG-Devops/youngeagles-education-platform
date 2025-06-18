import React from 'react';
import { Link } from 'react-router-dom';

const DashboardNavbar = () => {
  return (
    <nav className="bg-gray-700 text-white p-4 flex justify-between items-center">
      <span className="font-bold text-lg">Dashboard</span>
      <div className="space-x-4">
        <h1 className='text-white'>Welcome to Your Dashboard</h1>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
