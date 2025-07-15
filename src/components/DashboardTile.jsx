import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DashboardTile = ({ label, icon, color, to, isActive }) => {
  const content = (
    <div
      className={`rounded-lg p-6 shadow-md flex flex-col items-center text-center transition ${
        isActive
          ? `${color} text-black cursor-pointer hover:shadow-lg`
          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold">{label}</h3>
    </div>
  );

  return isActive ? <Link to={to}>{content}</Link> : content;
};

export default DashboardTile;
