import React from "react";
import DashboardCard from "./DashboardCard";
import { useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaCamera,
} from "react-icons/fa";

const TeacherDashboard = ({ user = {} }) => {
  const navigate = useNavigate();

  // Cards with navigation on click
  const cards = [
    {
      title: "Attendance",
      icon: <FaChalkboardTeacher size={48} className="text-blue-700" />,
      description: "View and manage student attendance",
      bgColor: "bg-blue-200",
      onClick: () => navigate("/teacher/attendance"),
    },
    {
      title: "Calendar",
      icon: <FaCalendarAlt size={48} className="text-purple-700" />,
      description: "Check upcoming events and holidays",
      bgColor: "bg-purple-200",
      onClick: () => navigate("/teacher/calendar"),
    },
    {
      title: "Messages",
      icon: <FaEnvelope size={48} className="text-pink-600" />,
      description: "View messages from parents and staff",
      bgColor: "bg-pink-200",
      onClick: () => navigate("/teacher/messages"),
    },
    {
      title: "Upload Reports",
      icon: <FaFileUpload size={48} className="text-green-700" />,
      description: "Upload daily reports or PDFs",
      bgColor: "bg-green-200",
      onClick: () => <Link to="/teacher-dashboard/learners">Go to Learners</Link>,
    },
    {
      title: "Child Photos",
      icon: <FaCamera size={48} className="text-yellow-700" />,
      description: "Upload and manage child photos",
      bgColor: "bg-yellow-200",
      onClick: () => navigate("/teacher/child-photos"),
    },
    {
        title: "My Children",
        icon: <FaChalkboardTeacher size={48} className="text-teal-700" />,
        description: "View and manage your assigned children",
        bgColor: "bg-teal-200",
        onClick: () => navigate("/teacher-dashboard/learners"),
      },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default TeacherDashboard;
