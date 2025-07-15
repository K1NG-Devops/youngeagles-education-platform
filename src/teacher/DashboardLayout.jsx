import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TeacherNav from "./TeacherNav";

const DashboardLayout = ({ children, user, onLogout, onUploadPhoto }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with responsive slide-in/out */}
      <div
        className={`fixed top-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          user={parent_id}
          onLogout={onLogout}
          onUploadPhoto={onUploadPhoto}
          closeSidebar={closeSidebar}
        />
      </div>

      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <TeacherNav user={user} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
