import React, { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '../firebase';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const NotificationPermission = () => {
  // Temporarily disabled for testing to prevent rate limiting
  return null;
  
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    const currentPermission = Notification.permission;
    setPermissionStatus(currentPermission);

    if (currentPermission === 'default') {
      // Show permission prompt after a delay
      setTimeout(() => {
        setShowPermissionPrompt(true);
      }, 5000);
    } else if (currentPermission === 'granted') {
      initializeMessaging();
    }
  };

  const initializeMessaging = async () => {
    try {
      const messaging = getMessaging(app);
      
      // Get registration token
      // Get registration token with VAPID key
      const token = await getToken(messaging, {
        vapidKey: 'BO2hxrIVytQl5yxMOTx1IZ1HouNRQoU-55remyWPPDHmhaWTnv2dm6v-45TCjng0DdQAjSbzbp5FLTtIIDDl0mQ'
      });
      
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        
        // Send token to your server to associate with user
        await sendTokenToServer(token);
        
        toast.success('Notifications enabled!', {
          description: 'You will receive important updates'
        });
      } else {
        console.log('No registration token available.');
      }

      // Handle foreground messages
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        
        // Show notification toast for foreground messages
        toast.info(payload.notification?.title || 'New Notification', {
          description: payload.notification?.body || 'You have a new message',
          duration: 5000
        });
        
        // Optional: Show browser notification even in foreground
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'Young Eagles', {
            body: payload.notification?.body,
            tag: payload.data?.type || 'default'
          });
        }
      });
      
    } catch (error) {
      console.error('Error initializing messaging:', error);
      toast.error('Failed to enable notifications', {
        description: 'Please check your browser settings'
      });
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      // Check if we've already sent this token recently (rate limiting)
      const lastTokenSent = localStorage.getItem('lastFCMTokenSent');
      const lastTokenValue = localStorage.getItem('lastFCMTokenValue');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      // Skip if same token was sent within last 5 minutes
      if (lastTokenSent && lastTokenValue === token && (now - parseInt(lastTokenSent)) < fiveMinutes) {
        console.log('FCM token already sent recently, skipping...');
        return;
      }
      
      // Always use the production server for FCM token registration
      const apiUrl = API_BASE_URL.replace(/\/api$/, ''); // Remove trailing /api if present
      
      const authToken = localStorage.getItem('accessToken');
      const parentId = localStorage.getItem('parent_id');
      
      if (!authToken) {
        console.warn('No auth token found, skipping FCM token registration');
        return;
      }
      
      if (!parentId) {
        console.warn('No parent ID found, skipping FCM token registration');
        return;
      }
      
      console.log('Sending FCM token to server:', apiUrl);
      const response = await fetch(`${apiUrl}/api/homeworks/fcm/token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          token,
          parentId: parentId ? parseInt(parentId) : undefined
        }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          console.warn('Rate limited - will retry FCM token registration later');
          // Set a longer delay before next attempt
          localStorage.setItem('lastFCMTokenSent', (now + fiveMinutes).toString());
          return;
        }
        
        console.error("FCM token POST failed:", response.status, text);
        throw new Error(`Failed to send token to server: ${response.status} ${text}`);
      }
      
      // Store successful send time and token value
      localStorage.setItem('lastFCMTokenSent', now.toString());
      localStorage.setItem('lastFCMTokenValue', token);
      
      console.log("FCM token sent to server successfully");
    } catch (err) {
      // Log the error but don't show user-facing errors for FCM registration
      console.warn("Could not send FCM token to server. Notifications may not work.", err.message);
      // Don't show toast error for non-critical FCM registration failures
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setShowPermissionPrompt(false);
      
      if (permission === 'granted') {
        await initializeMessaging();
      } else if (permission === 'denied') {
        toast.error('Notifications disabled', {
          description: 'You can enable them later in browser settings'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request permissions', {
        description: 'Please try again or check browser settings'
      });
    }
  };

  const handleDismiss = () => {
    setShowPermissionPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('notification-permission-dismissed', 'true');
  };

  // Don't show if permission already granted, denied, or dismissed in this session
  if (permissionStatus !== 'default' || 
      sessionStorage.getItem('notification-permission-dismissed')) {
    return null;
  }

  if (!showPermissionPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg border border-blue-400">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Enable Notifications</h3>
            <p className="text-xs text-blue-100 mb-3">
              Get instant alerts for homework, events, and important school updates!
            </p>
            <div className="flex space-x-2">
              <button
                onClick={requestNotificationPermission}
                className="bg-white text-blue-600 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Enable Notifications
              </button>
              <button
                onClick={handleDismiss}
                className="bg-blue-400 hover:bg-blue-300 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-200 hover:text-white"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;

