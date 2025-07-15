import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaExclamationCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [loading, setLoading] = useState(true);

  // Mock notifications - replace with real API call
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const mockNotifications = [
          {
            id: 1,
            title: 'New Homework Assignment',
            message: 'Mathematics homework has been assigned for tomorrow',
            type: 'homework',
            read: false,
            date: new Date('2024-01-15T10:30:00'),
            priority: 'high'
          },
          {
            id: 2,
            title: 'Assignment Due Reminder',
            message: 'Science project is due tomorrow. Please ensure submission.',
            type: 'reminder',
            read: false,
            date: new Date('2024-01-15T09:15:00'),
            priority: 'high'
          },
          {
            id: 3,
            title: 'Grade Updated',
            message: 'Your child\'s English essay has been graded: A-',
            type: 'grade',
            read: true,
            date: new Date('2024-01-14T14:20:00'),
            priority: 'medium'
          },
          {
            id: 4,
            title: 'School Event Announcement',
            message: 'Parent-teacher conference scheduled for next week',
            type: 'event',
            read: true,
            date: new Date('2024-01-14T11:45:00'),
            priority: 'low'
          },
          {
            id: 5,
            title: 'Fee Payment Reminder',
            message: 'Monthly fee payment is due in 3 days',
            type: 'payment',
            read: false,
            date: new Date('2024-01-13T16:00:00'),
            priority: 'high'
          }
        ];
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success('Notification deleted');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'homework':
        return <FaExclamationCircle className="text-orange-500" />;
      case 'reminder':
        return <FaBell className="text-red-500" />;
      case 'grade':
        return <FaCheckCircle className="text-green-500" />;
      case 'event':
        return <FaInfoCircle className="text-blue-500" />;
      case 'payment':
        return <FaExclamationCircle className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <FaBell className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaCheck />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaBell className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No {filter !== 'all' ? filter : ''} notifications
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "You have no notifications at this time."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-md border-l-4 ${getPriorityColor(notification.priority)} transition-all hover:shadow-lg ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <span className="text-sm text-gray-500 ml-4">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        <p className={`mt-2 ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {notification.priority} priority
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                              {notification.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1 text-sm"
                              >
                                <FaCheck className="text-xs" />
                                <span>Mark Read</span>
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1 text-sm"
                            >
                              <FaTrash className="text-xs" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
