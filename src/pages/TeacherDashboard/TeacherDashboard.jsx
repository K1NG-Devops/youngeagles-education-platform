import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../teacher/Sidebar";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DashboardCard from "../../teacher/DashboardCard";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaCamera,
  FaBars,
  FaTimes,
  FaEye,
  FaFileAlt,
} from "react-icons/fa";
import TeacherChildrenList from "../../teacher/TeacherChildrenList";
import TeacherAttendance from "../../teacher/TeacherAttendance";
import TeacherSubmissionsView from "../../components/TeacherSubmissionsView";
import TeacherReportsView from "../../components/TeacherReportsView";

const TeacherDashboard = ({ user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, submissions, reports
  const navigate = useNavigate();

  const sidebarRef = useRef();

  const { logout } = useAuth();

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileUpload = () => {
    alert("Profile picture upload coming soon!");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchChildren = () => {
    const children = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
    ];
    setChildrenList(children);
    setShowChildren(true);
  };

  const cards = [
    {
      title: "Attendance",
      icon: <FaChalkboardTeacher size={48} className="text-blue-700" />,
      description: "View and manage student attendance",
      bgColor: "bg-blue-200",
      onClick: () => setShowAttendance(true),
    },    
    {
      title: "Calendar",
      icon: <FaCalendarAlt size={48} className="text-purple-700" />,
      description: "Check upcoming events and holidays",
      bgColor: "bg-purple-200",
    },
    {
      title: "Messages",
      icon: <FaEnvelope size={48} className="text-pink-600" />,
      description: "View messages from parents and staff",
      bgColor: "bg-pink-200",
    },
    {
      title: "Upload Reports",
      icon: <FaFileUpload size={48} className="text-green-700" />,
      description: "Upload daily reports or PDFs",
      bgColor: "bg-green-200",
    },
    {
      title: "Post Homework",
      icon: <FaFileUpload size={48} className="text-orange-700" />,
      description: "Post homework assignments for students",
      bgColor: "bg-orange-200",
      onClick: () => navigate("/homework/upload"),
    },
    {
      title: "My Children",
      icon: <FaChalkboardTeacher size={48} className="text-teal-700" />,
      description: "View and manage your assigned children",
      bgColor: "bg-teal-200",
      onClick: fetchChildren,
    },
    {
      title: "Create Activity",
      icon: <FaFileUpload size={48} className="text-indigo-700" />,
      description: "Build interactive activities for your class",
      bgColor: "bg-indigo-200",
      onClick: () => navigate("/teacher-dashboard/activity-builder"),
    },
    {
      title: "View Submissions",
      icon: <FaEye size={48} className="text-emerald-700" />,
      description: "View homework submissions from students",
      bgColor: "bg-emerald-200",
      onClick: () => setActiveView('submissions'),
    },
    {
      title: "Send Reports",
      icon: <FaFileAlt size={48} className="text-cyan-700" />,
      description: "Generate and send reports to parents",
      bgColor: "bg-cyan-200",
      onClick: () => setActiveView('reports'),
    },
  ];

  

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
      }`}
    >
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <Sidebar
          user={user}
          onLogout={handleLogout}
          onUploadPhoto={handleProfileUpload}
        />
      </aside>

      {/* Overlay on mobile when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0  bg-opacity-10 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Hamburger / X Button */}
      <button
        className="sidebar-toggle md:hidden fixed top-2 left-2 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Dark Mode Toggle */}
      <button
        className="p-2 text-yellow-500 bg-gray-800 rounded-md shadow-md fixed top-2 right-2 z-50"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 overflow-y-auto p-8 mt-12 md:mt-0">
        {activeView === 'submissions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Student Homework Submissions</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
            <TeacherSubmissionsView />
          </div>
        ) : activeView === 'reports' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Send Reports to Parents</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
            <TeacherReportsView />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {showChildren ? (
              <TeacherChildrenList onBack={() => setShowChildren(false)} />
            ) : showAttendance ? (
              <TeacherAttendance onBack={() => setShowAttendance(false)} />
            ) : (
              cards.map((card) => (
                <DashboardCard
                  key={card.title}
                  {...card}
                  onClick={() => {
                    setShowSidebar(false); // Close sidebar when tile clicked
                    card.onClick && card.onClick();
                  }}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
