import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, icon, description, bgColor, onClick }) => (
  <div
    onClick={onClick}
    className={`${bgColor} rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition duration-300 cursor-pointer min-h-[220px]`}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm mt-2">{description}</p>
  </div>
);

export default DashboardCard;
