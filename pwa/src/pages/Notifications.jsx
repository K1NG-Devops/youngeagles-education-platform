import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaClock, FaExclamationTriangle, FaSpinner, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Notifications = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem('accessToken');
  const userId = auth?.user?.id;
  const userRole = auth?.user?.role || localStorage.getItem('role');

  // Mock notifications for now since we don't have a notifications API
  const mockNotifications = [
    {
      id: 1,
      title: 'New Homework Assignment',
      message: 'Math homework has been assigned for tomorrow',
      type: 'homework',
      read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Assignment Submitted',
      message: 'Your homework submission has been received',
      type: 'submission',
      read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      priority: 'low'
    },
    {
      id: 3,
      title: 'Assignment Due Soon',
      message: 'Science project is due in 2 days',
      type: 'reminder',
      read: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      priority: 'high'
    },
    {
      id: 4,
      title: 'Grade Posted',
      message: 'Your English essay has been graded: B+',
      type: 'grade',
      read: false,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Class Announcement',
      message: 'Tomorrow\'s class will start 30 minutes early',
      type: 'announcement',
      read: true,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      priority: 'high'
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      try {
        // For now, use mock data. Replace with actual API call when available
        // const res = await axios.get(
        //   `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/notifications`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // setNotifications(res.data.notifications || []);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(mockNotifications);
        
      } catch (err) {
        console.error('Error fetching notifications:', err);
        toast.error('Failed to load notifications');
        // Use mock data as fallback
        setNotifications(mockNotifications);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [token, userId]);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  const markAsRead = async (notificationId) => {
    setIsUpdating(true);
    
    try {
      // For now, update locally. Replace with actual API call when available
      // await axios.patch(
      //   `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/notifications/${notificationId}/read`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to update notification');
    } finally {
      setIsUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    setIsUpdating(true);
    
    try {
      // For now, update locally. Replace with actual API call when available
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to update notifications');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    setIsUpdating(true);
    
    try {
      // For now, delete locally. Replace with actual API call when available
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    } finally {
      setIsUpdating(false);
    }
  };

  const getNotificationIcon = (type, priority) => {
    const iconClass = priority === 'high' ? 'text-red-500' : 
                     priority === 'medium' ? 'text-yellow-500' : 
                     'text-blue-500';
    
    switch (type) {
      case 'homework':
      case 'assignment':
        return <FaBell className={iconClass} />;
      case 'submission':
        return <FaCheckCircle className={iconClass} />;
      case 'reminder':
        return <FaClock className={iconClass} />;
      case 'grade':
        return <FaCheck className={iconClass} />;
      case 'announcement':
        return <FaExclamationTriangle className={iconClass} />;
      default:
        return <FaBell className={iconClass} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'homework':
      case 'assignment':
        return 'bg-blue-100 text-blue-800';
      case 'submission':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'grade':
        return 'bg-purple-100 text-purple-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 space-y-4 max-w-full overflow-x-hidden pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
        <h1 className="text-xl font-bold mb-1">Notifications</h1>
        <p className="text-sm text-purple-100">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {/* Filter and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={isUpdating}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-gray-400 text-2xl" />
            <span className="ml-2 text-gray-500">Loading notifications...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatTimeAgo(notification.created_at)}</span>
                        {notification.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={isUpdating}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Mark as read"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      disabled={isUpdating}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'You\'re all caught up! No notifications to display.'
                : `You have no ${filter} notifications at this time.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
