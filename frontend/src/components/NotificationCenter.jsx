import React, { useState, useEffect } from 'react';
import { FaBell, FaBookOpen, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { toast as sonnerToast } from 'sonner';

const NotificationCenter = ({ parentId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    // Poll for new homeworks every 60 seconds
    const homeworkInterval = setInterval(async () => {
      const parent_id = localStorage.getItem('parent_id');
      const token = localStorage.getItem('accessToken');
      if (!parent_id || !token) return;
      try {
        const res = await fetch(`https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        const newHomeworks = (data.homeworks || []).filter(hw => !localStorage.getItem(`notified-homework-${hw.id}`));
        newHomeworks.forEach(hw => {
          sonnerToast(`New homework posted: ${hw.title}`, { description: hw.instructions || '', duration: 8000 });
          localStorage.setItem(`notified-homework-${hw.id}`, 'true');
        });
      } catch (err) {
        // ignore
      }
    }, 60000);
    return () => {
      clearInterval(interval);
      clearInterval(homeworkInterval);
    };
  }, [parentId]);

  const fetchNotifications = async () => {
    if (!parentId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch homework notifications
      const homeworkResponse = await fetch(`https://youngeagles-api-server.up.railway.app/api/homework/for-parent/${parentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (homeworkResponse.ok) {
        const data = await homeworkResponse.json();
        const homeworkNotifications = createHomeworkNotifications(data.homeworks || []);
        setNotifications(homeworkNotifications);
        
        // Count unread notifications
        const unread = homeworkNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
        
        // Show toast for urgent notifications
        homeworkNotifications.forEach(notification => {
          if (notification.urgent && !notification.read) {
            toast.warning(notification.message, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHomeworkNotifications = (homeworks) => {
    const notifications = [];
    const now = new Date();
    
    homeworks.forEach(homework => {
      const dueDate = new Date(homework.due_date);
      const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      // New homework notification
      if (!homework.submitted) {
        if (daysDiff < 0) {
          // Overdue
          notifications.push({
            id: `overdue-${homework.id}`,
            type: 'overdue',
            title: 'Homework Overdue!',
            message: `"${homework.title}" was due ${Math.abs(daysDiff)} day(s) ago`,
            homework: homework,
            urgent: true,
            read: false,
            timestamp: new Date(homework.created_at),
            icon: <FaExclamationTriangle className="text-red-500" />
          });
        } else if (daysDiff <= 1) {
          // Due soon
          notifications.push({
            id: `due-soon-${homework.id}`,
            type: 'due-soon',
            title: 'Homework Due Soon!',
            message: `"${homework.title}" is due ${daysDiff === 0 ? 'today' : 'tomorrow'}`,
            homework: homework,
            urgent: true,
            read: false,
            timestamp: new Date(homework.created_at),
            icon: <FaCalendarAlt className="text-orange-500" />
          });
        } else if (daysDiff <= 7) {
          // New homework
          notifications.push({
            id: `new-${homework.id}`,
            type: 'new-homework',
            title: 'New Homework Assigned',
            message: `"${homework.title}" - Due in ${daysDiff} days`,
            homework: homework,
            urgent: false,
            read: localStorage.getItem(`read-${homework.id}`) === 'true',
            timestamp: new Date(homework.created_at),
            icon: <FaBookOpen className="text-blue-500" />
          });
        }
      } else {
        // Completed homework
        notifications.push({
          id: `completed-${homework.id}`,
          type: 'completed',
          title: 'Homework Completed',
          message: `"${homework.title}" has been submitted`,
          homework: homework,
          urgent: false,
          read: true,
          timestamp: new Date(homework.created_at),
          icon: <FaCheckCircle className="text-green-500" />
        });
      }
    });
    
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Store read status locally
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.homework) {
      localStorage.setItem(`read-${notification.homework.id}`, 'true');
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    
    notifications.forEach(notification => {
      if (notification.homework) {
        localStorage.setItem(`read-${notification.homework.id}`, 'true');
      }
    });
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'overdue': return 'border-l-red-500 bg-red-50';
      case 'due-soon': return 'border-l-orange-500 bg-orange-50';
      case 'new-homework': return 'border-l-blue-500 bg-blue-50';
      case 'completed': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <FaBell className="text-2xl mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        getNotificationColor(notification.type)
                      } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                      onClick={() => markAsRead(notification.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                            )}
                          </div>
                          <p className={`text-sm ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50 rounded-b-lg text-center">
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Refresh notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;

