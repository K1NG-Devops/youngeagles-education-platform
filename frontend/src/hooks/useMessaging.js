import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../config/api';
import { toast } from 'react-toastify';

const useMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch messages
  const fetchMessages = useCallback(async (page = 1, type = 'all') => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/messages?page=${page}&type=${type}`);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (messageData) => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/messages/send', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
      
      if (response.success) {
        toast.success('Message sent successfully!');
        fetchMessages(); // Refresh messages
        return true;
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
    return false;
  }, [fetchMessages]);

  // Get conversation with specific user
  const getConversation = useCallback(async (otherUserId, otherUserType) => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/messages/conversation/${otherUserId}/${otherUserType}`);
      if (response.success) {
        return response.messages;
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch conversation');
    } finally {
      setLoading(false);
    }
    return [];
  }, []);

  // Mark message as read
  const markAsRead = useCallback(async (messageId) => {
    try {
      await apiRequest(`/api/messages/${messageId}/read`, {
        method: 'PUT'
      });
      fetchUnreadCount(); // Update unread count
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await apiRequest('/api/messages/unread-count');
      if (response.success) {
        setUnreadCount(response.unread_count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await apiRequest('/api/messages/contacts');
      if (response.success) {
        setContacts(response.contacts);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch contacts');
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, unreadOnly = false) => {
    try {
      const response = await apiRequest(`/api/messages/notifications?page=${page}&unread_only=${unreadOnly}`);
      if (response.success) {
        setNotifications(response.notifications);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch notifications');
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await apiRequest(`/api/messages/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [fetchNotifications]);

  // Initialize data on mount
  useEffect(() => {
    fetchUnreadCount();
    fetchContacts();
  }, [fetchUnreadCount, fetchContacts]);

  return {
    messages,
    conversations,
    contacts,
    notifications,
    unreadCount,
    loading,
    error,
    sendMessage,
    fetchMessages,
    getConversation,
    markAsRead,
    fetchUnreadCount,
    fetchContacts,
    fetchNotifications,
    markNotificationAsRead
  };
};

export default useMessaging;

