import React, { useEffect, useState } from 'react';
import { FaBell, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useMessaging from '../hooks/useMessaging';
import useAuth from '../hooks/useAuth';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const { 
    fetchNotifications, 
    markNotificationAsRead, 
    notifications: realNotifications 
  } = useMessaging();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.user) {
      // Fetch real notifications when user is authenticated
      fetchNotifications();
      
      // Set up periodic refresh every 30 seconds
      const notificationRefresh = setInterval(() => {
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(notificationRefresh);
    }
  }, [auth?.user, fetchNotifications]);

  useEffect(() => {
    // Update local state when real notifications change
    if (realNotifications && realNotifications.length > 0) {
      setNotifications(realNotifications);
      
      // Show notification popup if there are unread notifications
      const unreadCount = realNotifications.filter(n => !n.is_read).length;
      if (unreadCount > 0) {
        setIsVisible(true);
      }
    }
  }, [realNotifications]);

  useEffect(() => {
    // Setup notification system
    const setupNotifications = () => {
      console.log('🔔 Setting up real notification system...');
      
      // Global notification function for testing
      window.youngEaglesNotifications = {
        test: () => {
          // Test by fetching latest notifications
          fetchNotifications();
          setIsVisible(true);
          toast.info('Refreshed notifications!');
          console.log('🧪 Notification system tested');
        },
        
        refresh: () => {
          fetchNotifications();
          console.log('🔄 Notifications refreshed');
        },
        
        markAsRead: async (id) => {
          await markNotificationAsRead(id);
          console.log('✅ Notification marked as read:', id);
        },
        
        clear: () => {
          setNotifications([]);
          setIsVisible(false);
          console.log('🗑️ Notification panel cleared (server notifications remain)');
        }
      };
      
      console.log('✅ Real notification system ready!');
    };

    setupNotifications();

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }

    return () => {
      delete window.youngEaglesNotifications;
    };
  }, [fetchNotifications, markNotificationAsRead]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 max-w-sm w-full" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FaBell className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Notifications ({notifications.filter(n => !n.is_read).length})
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 last:border-b-0 ${
                notification.is_read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
                
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-shrink-0 p-1 text-green-600 hover:text-green-700"
                    title="Mark as read"
                  >
                    <FaCheck size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length > 5 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;

