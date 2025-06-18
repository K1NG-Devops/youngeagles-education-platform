import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaUser, FaBook, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const NotificationToast = ({ notification, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Slide in animation - start immediately
    const slideTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-hide after 6 seconds
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'homework': return <FaBook className="text-blue-500" />;
      case 'submission': return <FaClipboardList className="text-green-500" />;
      case 'calendar': return <FaCalendarAlt className="text-purple-500" />;
      case 'user': return <FaUser className="text-orange-500" />;
      default: return <FaBell className="text-blue-500" />;
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case 'homework': return 'border-l-blue-500 bg-blue-50';
      case 'submission': return 'border-l-green-500 bg-green-50';
      case 'calendar': return 'border-l-purple-500 bg-purple-50';
      case 'user': return 'border-l-orange-500 bg-orange-50';
      case 'urgent': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div 
      className={`w-80 transform transition-all duration-300 ease-out pointer-events-auto ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
      style={{ 
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '400px'
      }}
    >
      <div className={`${getNotificationColors(notification.type)} border-l-4 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden`}>
        {/* Notification Header */}
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              {notification.avatar ? (
                <img 
                  src={notification.avatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                getNotificationIcon(notification.type)
              )}
            </div>
          </div>
          
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {notification.title || 'Young Eagles'}
              </p>
              <button
                onClick={handleClose}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
              {notification.message}
            </p>
            
            {notification.time && (
              <p className="text-xs text-gray-500 mt-1">
                {notification.time}
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onAction(action);
                    handleClose();
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    action.primary 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Progress Bar for Auto-dismiss */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-6000 ease-linear"
            style={{
              width: isVisible && !isLeaving ? '0%' : '100%',
              transitionDuration: '6s'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;

