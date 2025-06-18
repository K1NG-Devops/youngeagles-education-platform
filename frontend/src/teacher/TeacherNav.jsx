import React from "react";

const TeacherNav = ({ user, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-md p-4 md:p-6">
      {/* Mobile hamburger toggle button */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Page title or logo */}
      <h1 className="text-xl font-semibold text-gray-800">Teacher Dashboard</h1>

      {/* User info on the right */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-gray-600">{user?.name || "Teacher"}</span>
        <img
          src={user?.profilePic || "https://www.gravatar.com/avatar/?d=mp"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      </div>
    </header>
  );
};

export default TeacherNav;
