import React from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaCamera,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ user = {}, onLogout, onUploadPhoto, closeSidebar }) => {
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

  // Safer profilePic check
  const profilePic =
    user?.profilePic && user.profilePic !== "null"
      ? user.profilePic
      : defaultAvatar;

  const navItems = [
    { label: "Attendance", icon: <FaChalkboardTeacher size={22} /> },
    { label: "Calendar", icon: <FaCalendarAlt size={22} /> },
    { label: "Messages", icon: <FaEnvelope size={22} /> },
    { label: "Upload Reports", icon: <FaFileUpload size={22} /> },
    { label: "Child Photos", icon: <FaCamera size={22} /> },
  ];

  return (
    <aside className="h-full bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 flex flex-col flex-grow">
      <div className="flex flex-col items-center py-8 px-4 border-b border-blue-600">
        <img
          src={profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-lg"
        />
        <h2 className="text-xl font-semibold">{user?.name || "Teacher Name"}</h2>
        <p className="text-sm opacity-80">{user?.email || "teacher@example.com"}</p>

        <button
          onClick={onUploadPhoto}
          className="mt-4 flex items-center gap-2 text-sm px-4 py-2 bg-white text-blue-800 rounded hover:bg-blue-100"
        >
          <FaUpload size={16} />
          Upload Photo
        </button>
      </div>

      <nav className="flex-grow px-6 py-8 space-y-6 overflow-y-auto">
        {navItems.map(({ label, icon }) => (
          <button
            key={label}
            onClick={closeSidebar}
            className="flex items-center gap-4 text-lg hover:text-blue-300 w-full"
          >
            {icon}
            {label}
          </button>
        ))}

      </nav>
      <div className="p-4 space-y-4">
      <Link to="/view-attendance" className="block">View Attendance</Link>
      {/* Add more links here */}
    </div>

      <div className="px-6 py-4 border-t border-blue-600">
      <button
          onClick={() => {
            onLogout();
            if (closeSidebar) closeSidebar();
          }}
          className="w-full py-2 text-center text-white bg-red-500 hover:bg-red-700 rounded-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
