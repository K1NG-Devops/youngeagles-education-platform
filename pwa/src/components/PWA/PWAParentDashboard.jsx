import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBook, FaBell, FaUser, FaClipboardList, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const PWAParentDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(() => {
    return localStorage.getItem('selectedChild') || '';
  });
  const [homeworkProgress, setHomeworkProgress] = useState({
    total: 0,
    submitted: 0,
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState({
    children: false,
    homework: false
  });
  const [errors, setErrors] = useState({
    children: null,
    homework: null
  });
  const [expandedSection, setExpandedSection] = useState(null);

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  // Fetch children for the dropdown
  const fetchChildren = useCallback(async () => {
    if (!parent_id || !token) return;
    
    setIsLoading(prev => ({ ...prev, children: true }));
    setErrors(prev => ({ ...prev, children: null }));
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/parents/${parent_id}/children`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
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
    } finally {
      setIsLoading(prev => ({ ...prev, children: false }));
    }
  }, [parent_id, token, selectedChild]);

  // Fetch homework data for progress tracking
  const fetchHomeworkData = useCallback(async () => {
    if (!parent_id || !token || !selectedChild) return;
    
    setIsLoading(prev => ({ ...prev, homework: true }));
    setErrors(prev => ({ ...prev, homework: null }));
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/homeworks/for-parent/${parent_id}?child_id=${selectedChild}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const hwList = Array.isArray(res.data) ? res.data : res.data.homeworks || [];
      
      // Calculate progress
      const total = hwList.length;
      const submitted = hwList.filter(hw => hw.submitted).length;
      const percentage = total > 0 ? (submitted / total) * 100 : 0;
      
      setHomeworkProgress({
        total,
        submitted,
        percentage
      });
      
      setErrors(prev => ({ ...prev, homework: null }));
    } catch (err) {
      console.error('Error fetching homework:', err);
      const errorMessage = err.response?.data?.message || 'Unable to load homework data';
      
      // Handle different error scenarios
      if (err.response?.status === 404) {
        // No homework found - this is normal, not an error
        console.log('No homework found for this child - this is normal');
        setErrors(prev => ({ ...prev, homework: null }));
      } else if (err.response?.status === 400 && errorMessage.includes('Child ID must be specified')) {
        // Child not selected
        setErrors(prev => ({ ...prev, homework: 'Please select a child first' }));
      } else {
        // Actual error
        setErrors(prev => ({ ...prev, homework: errorMessage }));
      }
      
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

  useEffect(() => {
    if (selectedChild) {
      fetchHomeworkData();
    }
  }, [selectedChild, parent_id, token]);

  const userName = auth?.user?.name || 'Parent';
  const selectedChildData = children.find(child => child.id.toString() === selectedChild);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const quickActions = [
    {
      id: 'homework',
      title: 'View Homework',
      description: 'Check assignments',
      icon: FaBook,
      color: 'blue',
      path: selectedChild ? `/homework?child_id=${selectedChild}` : '#',
      disabled: !selectedChild,
      badge: homeworkProgress.total,
      showBadgeWhenZero: false
    },
    {
      id: 'submit',
      title: 'Submit Work',
      description: 'Upload assignments',
      icon: FaClipboardList,
      color: 'green',
      path: '/submit-work',
      disabled: false,
      showBadgeWhenZero: false
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View updates',
      icon: FaBell,
      color: 'yellow',
      path: '/notifications',
      disabled: false,
      badge: 0, // TODO: Add notification count
      showBadgeWhenZero: false
    }
  ];

  return (
    <div className="p-4 space-y-4 max-w-full overflow-x-hidden pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <h2 className="text-xl font-bold mb-1">Welcome back, {userName}!</h2>
        <p className="text-sm text-blue-100">Track your child's learning progress</p>
      </div>

      {/* Child Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Child</h3>
        {isLoading.children ? (
          <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
            <FaSpinner className="animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Loading children...</span>
          </div>
        ) : (
          <>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
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
            {selectedChildData && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                Selected: <span className="font-medium">{selectedChildData.name}</span> ({selectedChildData.className})
              </div>
            )}
          </>
        )}
        {errors.children && (
          <p className="text-xs text-red-500 mt-2">{errors.children}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Children</p>
              <p className="text-2xl font-bold text-gray-900">{children.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FaUser className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Homework</p>
              {isLoading.homework ? (
                <FaSpinner className="animate-spin text-gray-400 text-lg" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{Math.round(homeworkProgress.percentage)}%</p>
              )}
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <FaBook className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${homeworkProgress.percentage}%`}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-700',
              green: 'bg-green-50 border-green-200 text-green-700',
              yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700'
            };
            
            return (
              <Link
                key={action.id}
                to={action.disabled ? '#' : action.path}
                className={`flex items-center p-4 rounded-lg border-2 transition-all min-h-[64px] ${
                  action.disabled 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : `${colorClasses[action.color]} hover:shadow-md cursor-pointer`
                }`}
                onClick={(e) => {
                  if (action.disabled) {
                    e.preventDefault();
                    if (typeof toast !== 'undefined') {
                      toast.warning('Please select a child first');
                    }
                  }
                }}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  action.disabled ? 'bg-gray-200' : `bg-${action.color}-100`
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm opacity-75">{action.description}</p>
                    </div>
                    {action.badge > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Progress Details - Collapsible */}
      {selectedChild && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => toggleSection('progress')}
            className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-lg font-semibold text-gray-900">Progress Details</h3>
            {expandedSection === 'progress' ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'progress' && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="pt-4 space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Overall Progress</p>
                      <p className="text-xs text-gray-600">{homeworkProgress.submitted} of {homeworkProgress.total} assignments completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{Math.round(homeworkProgress.percentage)}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-800">Completed</p>
                    <p className="text-lg font-bold text-green-900">{homeworkProgress.submitted}</p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs font-medium text-orange-800">Pending</p>
                    <p className="text-lg font-bold text-orange-900">{homeworkProgress.total - homeworkProgress.submitted}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PWAParentDashboard;
