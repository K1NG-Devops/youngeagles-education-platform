// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardTile from '../../components/DashboardTile';
import useAuth from '../../hooks/useAuth';
import { FaBook, FaCalendarCheck, FaClipboardList, FaVideo, FaChalkboardTeacher, FaBell, FaSpinner, FaChevronUp, FaComments } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsCalendar from '../../components/Calendar/EventsCalendar';
// Lazy import MessagingSystem with fallback
const MessagingSystem = React.lazy(() => 
  import('../../components/Messaging/MessagingSystem').catch(() => ({ 
    default: ({ isOpen, onClose }) => isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-2">Messaging Coming Soon!</h3>
          <p className="text-gray-600 mb-4">The messaging system is currently being updated. Please check back later.</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    ) : null
  }))
);
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const linkStyles = "block mb-2 px-4 py-2 rounded hover:bg-slate-600 hover:bg-opacity-20 transition-colors duration-200 text-white hover:text-white";
const linkStyles2 = "bg-cyan-600 font-bold text-white hover:bg-cyan-700 transition-colors duration-200";
const linkStylesActive = "bg-slate-600 bg-opacity-30 font-bold text-white";

const className = localStorage.getItem('className') || 'Class 1';
const grade = localStorage.getItem('grade') || 'Grade 1';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(() => {
    // Load from localStorage on initialization
    return localStorage.getItem('selectedChild') || '';
  });
  const [homeworkList, setHomeworkList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [homeworkProgress, setHomeworkProgress] = useState({
    total: 0,
    submitted: 0,
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState({
    children: false,
    homework: false,
    notifications: false
  });
  const [errors, setErrors] = useState({
    children: null,
    homework: null,
    notifications: null
  });
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  // Fetch children for the dropdown with enhanced error handling
  const fetchChildren = useCallback(async () => {
    if (!parent_id || !token) return;
    
    setIsLoading(prev => ({ ...prev, children: true }));
    setErrors(prev => ({ ...prev, children: null }));
    
    try {
      console.log('Fetching children for parent ID:', parent_id);
      const res = await axios.get(
        `${API_BASE_URL}/auth/parents/${parent_id}/children`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Children response:', res.data);
      const childrenData = Array.isArray(res.data) ? res.data : res.data.children || [];
      setChildren(childrenData);
      
      // Auto-select first child if no child is selected
      if (childrenData.length > 0 && !selectedChild) {
        const firstChildId = childrenData[0].id.toString();
        setSelectedChild(firstChildId);
        localStorage.setItem('selectedChild', firstChildId);
      }
    } catch (err) {
      console.error('Error fetching children:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load children';
      setErrors(prev => ({ ...prev, children: errorMessage }));
      setChildren([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(prev => ({ ...prev, children: false }));
    }
  }, [parent_id, token, selectedChild]);

// Fetch homework data for progress tracking with enhanced error handling
  const fetchHomeworkData = useCallback(async () => {
    if (!parent_id || !token || !selectedChild) return;
    
    setIsLoading(prev => ({ ...prev, homework: true }));
    setErrors(prev => ({ ...prev, homework: null }));
    
    try {
      const res = await axios.get(
        `${API_BASE_URL}/homeworks/for-parent/${parent_id}?child_id=${selectedChild}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const hwList = Array.isArray(res.data) ? res.data : res.data.homeworks || [];
      setHomeworkList(hwList);
      
      // Calculate progress
      const total = hwList.length;
      const submitted = hwList.filter(hw => hw.submitted).length;
      const percentage = total > 0 ? (submitted / total) * 100 : 0;
      
      setHomeworkProgress({
        total,
        submitted,
        percentage
      });
      
      // Clear any previous errors since fetch was successful
      setErrors(prev => ({ ...prev, homework: null }));
    } catch (err) {
      console.error('Error fetching homework:', err);
      const errorMessage = err.response?.data?.message || 'Unable to load homework data';
      setErrors(prev => ({ ...prev, homework: errorMessage }));
      
      // Don't show error toast for 404 or empty data - this is normal
      if (err.response?.status !== 404) {
        toast.error(errorMessage);
      }
      
      // Reset to empty state on error
      setHomeworkList([]);
      setHomeworkProgress({
        total: 0,
        submitted: 0,
        percentage: 0
      });
    } finally {
      setIsLoading(prev => ({ ...prev, homework: false }));
    }
  }, [parent_id, token, selectedChild]);

  useEffect(() => {
    fetchChildren();
  }, [parent_id, token]);

  // Fetch homework data when selectedChild changes
  useEffect(() => {
    if (selectedChild) {
      fetchHomeworkData();
    }
  }, [selectedChild, parent_id, token]);

  // Refresh homework data every 30 seconds to catch updates
  useEffect(() => {
    if (selectedChild) {
      const interval = setInterval(fetchHomeworkData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchHomeworkData, selectedChild]);

  // Fetch real notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with actual API call when notification system is implemented
        // For now, keep empty to avoid placeholder data
        setNotifications([]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
    
    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;


  // Handle scroll for back-to-top button and reduced animations on mobile
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Detect if user prefers reduced motion or is on mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    AOS.init({
      duration: prefersReducedMotion || isMobile ? 300 : 1000,
      easing: 'ease-in-out',
      once: false,
      disable: prefersReducedMotion ? true : false,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (!auth?.user) {
      toast.error('Please log in to access the dashboard.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      navigate('/login');
    }
  }, [auth, navigate]);

  const userName = auth?.user?.name || 'Parent';
  const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp';
  const userProfilePic =
    auth?.user?.profilePic && auth.user.profilePic !== 'null'
      ? auth.user.profilePic
      : defaultAvatar;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
      window.location.reload();
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Hamburger menu (mobile only) - Moved to nav bar */}


      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 shadow transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
      >
        <div className="h-full p-4 flex flex-col justify-between">
          <div>
            {/* Close button for mobile */}
            <button
              onClick={closeSidebar}
              className="sm:hidden absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:text-gray-200 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 z-50 shadow-lg border-2 border-white"
              style={{ aspectRatio: '1/1' }}
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={userProfilePic}
                alt="User Avatar"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <p className="mt-2 font-semibold text-white text-lg">{userName}</p>
              <div className="relative mt-2" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-sm text-gray-600 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-1"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User options menu"
                >
                  ▼ Options
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50 animate-fadeIn">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors text-sm md:text-base rounded-t-lg"
                      role="menuitem"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors text-sm md:text-base"
                      role="menuitem"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors text-sm md:text-base rounded-b-lg"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Links */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className={`${linkStyles} ${linkStylesActive} ${location.pathname === '/dashboard' ? linkStyles2 : ''
                      }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/submit-work"
                    className={`${linkStyles} ${location.pathname === '/submit-work' ? linkStyles2 : ''}`}
                  >
                    📤 Submit Work
                  </Link>
                </li>

                <li>
                  <Link
                    to="/resources"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="200"
                  >
                    📂 Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/videos"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="400"
                  >
                    🎥 Videos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lessons"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="600"
                  >
                    📚 Lessons
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register-child"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''
                      }`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="800"
                  >
                    👶 Register Child
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      <main className="sm:ml-64 min-h-screen bg-gray-50 transition-all duration-300 ease-in-out overflow-x-hidden">
        {/* Sticky Top Navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex justify-between items-center p-4">
            {/* Mobile hamburger button */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 text-cyan-800 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Parent Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Link
                to="/home"
                className="hidden sm:inline-block text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 md:px-4 text-sm md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors min-h-[44px] touch-manipulation"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
            <p className="text-sm sm:text-base text-cyan-100">Track your child's learning progress and stay connected with their education journey.</p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Children */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Children</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{children.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Homework Completion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Homework Rate</p>
                  {isLoading.homework ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(homeworkProgress.percentage)}%</p>
                  )}
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                  <FaBook className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${homeworkProgress.percentage}%`}}
                    role="progressbar"
                    aria-valuenow={homeworkProgress.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`Homework completion: ${Math.round(homeworkProgress.percentage)}%`}
                  ></div>
                </div>
                {errors.homework && (
                  <p className="text-xs text-orange-500 mt-2">Unable to load latest data</p>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{unreadNotifications}</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                  <FaBell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
              {unreadNotifications > 0 && (
                <p className="text-xs sm:text-sm text-yellow-600 mt-2">You have new updates</p>
              )}
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Assignments</p>
                  {isLoading.homework ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{homeworkProgress.total}</p>
                  )}
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                  <FaClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {homeworkProgress.submitted} completed
                {homeworkProgress.total === 0 && !isLoading.homework && !errors.homework && (
                  <span className="text-blue-500 ml-1">• No assignments yet</span>
                )}
              </p>
            </div>
          </div>

          {/* Child Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Child Selection</h3>
            <div className="mb-4">
              {isLoading.children ? (
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <FaSpinner className="animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Loading children...</span>
                </div>
              ) : (
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black text-sm md:text-base focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 min-h-[44px]"
                  value={selectedChild}
                  onChange={(e) => {
                    setSelectedChild(e.target.value);
                    localStorage.setItem('selectedChild', e.target.value);
                  }}
                  aria-label="Select child"
                >
                  <option value="">Select a child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {child.className || 'No Class'}
                    </option>
                  ))}
                </select>
              )}
              {errors.children && (
                <p className="text-xs text-red-500 mt-2">{errors.children}</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link
                to={selectedChild ? `/student/homework?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}&child_id=${selectedChild}` : '#'}
                className={`flex items-center p-4 rounded-lg transition-colors group min-h-[80px] touch-manipulation ${
                  selectedChild 
                    ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' 
                    : 'bg-gray-100 cursor-not-allowed opacity-60'
                }`}
                aria-label={selectedChild ? "View homework assignments" : "Select a child first"}
                onClick={(e) => {
                  if (!selectedChild) {
                    e.preventDefault();
                    toast.warning('Please select a child first');
                  }
                }}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  selectedChild 
                    ? 'bg-blue-100 group-hover:bg-blue-200' 
                    : 'bg-gray-200'
                }`}>
                  <FaBook className={`w-5 h-5 ${
                    selectedChild ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm sm:text-base font-medium ${
                        selectedChild ? 'text-gray-900' : 'text-gray-500'
                      }`}>View Homework</p>
                      <p className={`text-xs sm:text-sm ${
                        selectedChild ? 'text-gray-600' : 'text-gray-400'
                      }`}>{selectedChild ? 'Check assignments' : 'Select child first'}</p>
                    </div>
                    {homeworkProgress.total > 0 && (
                      <div className="ml-3">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {homeworkProgress.total}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              <Link
                to="/submit-work"
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group min-h-[80px] touch-manipulation"
                aria-label="Submit work assignments"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200">
                  <FaClipboardList className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">Submit Work</p>
                  <p className="text-xs sm:text-sm text-gray-600">Upload assignments</p>
                </div>
              </Link>

              <Link
                to="/register-child"
                className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group min-h-[80px] touch-manipulation"
                aria-label="Register a new child"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">Add Child</p>
                  <p className="text-xs sm:text-sm text-gray-600">Register new child</p>
                </div>
              </Link>
              
              <button
                onClick={() => {
                  if (!selectedChild) {
                    toast.warning('Please select a child first');
                    return;
                  }
                  setIsMessagingOpen(true);
                }}
                className={`flex items-center p-4 rounded-lg transition-colors group min-h-[80px] touch-manipulation ${
                  selectedChild 
                    ? 'bg-indigo-50 hover:bg-indigo-100 cursor-pointer' 
                    : 'bg-gray-100 cursor-not-allowed opacity-60'
                }`}
                aria-label={selectedChild ? "Message teachers" : "Select a child first"}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  selectedChild 
                    ? 'bg-indigo-100 group-hover:bg-indigo-200' 
                    : 'bg-gray-200'
                }`}>
                  <FaComments className={`w-5 h-5 ${
                    selectedChild ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm sm:text-base font-medium ${
                    selectedChild ? 'text-gray-900' : 'text-gray-500'
                  }`}>Message Teachers</p>
                  <p className={`text-xs sm:text-sm ${
                    selectedChild ? 'text-gray-600' : 'text-gray-400'
                  }`}>{selectedChild ? 'Chat with teachers' : 'Select child first'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Child Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 max-h-96 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Child Progress</h3>
              {selectedChild && (
                <div className="text-sm text-gray-600">
                  Current child: <span className="font-medium text-gray-900">
                    {children.find(child => child.id.toString() === selectedChild)?.name || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
            
            {selectedChild ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">Overall Progress</p>
                    <p className="text-xs sm:text-sm text-gray-600">{homeworkProgress.submitted} of {homeworkProgress.total} assignments completed</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-cyan-600">{Math.round(homeworkProgress.percentage)}%</p>
                    <p className="text-xs sm:text-sm text-gray-500">Completion rate</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-green-800">Completed</p>
                        <p className="text-lg sm:text-xl font-bold text-green-900">{homeworkProgress.submitted}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-orange-800">Pending</p>
                        <p className="text-lg sm:text-xl font-bold text-orange-900">{homeworkProgress.total - homeworkProgress.submitted}</p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-sm sm:text-base text-gray-600">Select a child to view their progress</p>
              </div>
            )}
          </div>

          {/* Events Calendar */}
          <div className="max-h-96 overflow-y-auto">
            <EventsCalendar />
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-5 h-5" />
          </button>
        )}
      </main>

      {/* Messaging System Modal */}
      <React.Suspense fallback={null}>
        <MessagingSystem 
          isOpen={isMessagingOpen}
          onClose={() => setIsMessagingOpen(false)}
          selectedChild={children.find(child => child.id.toString() === selectedChild) || null}
        />
      </React.Suspense>

      {/* Custom CSS for animations and mobile optimizations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Touch optimization */
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        /* Improved scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          /* Ensure minimum touch target size */
          button, a, select {
            min-height: 44px;
          }
          
          /* Optimize font sizes for readability */
          .text-xs { font-size: 0.75rem; }
          .text-sm { font-size: 0.875rem; }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
