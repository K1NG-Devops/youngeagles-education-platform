import React, { useState, useEffect } from 'react';
import { FaUsers, FaEnvelope, FaPlus, FaBell, FaArrowLeft } from 'react-icons/fa';
import useMessaging from '../../hooks/useMessaging';
import useAuth from '../../hooks/useAuth';
import ConversationView from './ConversationView';
import NewMessageModal from './NewMessageModal';
import { toast } from 'react-toastify';

const MessagingCenter = () => {
  const { auth } = useAuth();
  const {
    messages,
    contacts,
    notifications,
    unreadCount,
    loading,
    sendMessage,
    fetchMessages,
    getConversation,
    markAsRead,
    fetchNotifications,
    markNotificationAsRead
  } = useMessaging();

  const [activeTab, setActiveTab] = useState('messages');
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab, fetchMessages, fetchNotifications]);

  const handleContactSelect = async (contact) => {
    setSelectedContact(contact);
    const conversation = await getConversation(contact.id, contact.type);
    setConversationMessages(conversation);
  };

  const handleSendMessage = async (messageData) => {
    const success = await sendMessage(messageData);
    if (success) {
      setShowNewMessage(false);
      // If we're in a conversation, refresh it
      if (selectedContact) {
        const updatedConversation = await getConversation(selectedContact.id, selectedContact.type);
        setConversationMessages(updatedConversation);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setConversationMessages([]);
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id);
    
    // Navigate to related content if action_url exists
    if (notification.action_url) {
      // Handle navigation based on notification type
      if (notification.notification_type === 'message') {
        // Find the contact and open conversation
        const relatedContact = contacts.find(c => c.id === notification.related_id);
        if (relatedContact) {
          handleContactSelect(relatedContact);
          setActiveTab('messages');
        }
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'homework': return '📚';
      case 'attendance': return '📅';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (selectedContact) {
    return (
      <ConversationView
        contact={selectedContact}
        messages={conversationMessages}
        onBack={handleBackToList}
        onSendMessage={handleSendMessage}
        loading={loading}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaEnvelope className="mr-3 text-blue-600" />
            Communication Center
          </h1>
          <button
            onClick={() => setShowNewMessage(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            New Message
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaEnvelope className="inline mr-2" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaUsers className="inline mr-2" />
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaBell className="inline mr-2" />
            Notifications
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md">
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && !loading && (
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600 mb-4">Start a conversation with your contacts</p>
                <button
                  onClick={() => setShowNewMessage(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send your first message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      !message.is_read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => markAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {message.sender_name || `${message.sender_type} #${message.sender_id}`}
                          </span>
                          {!message.is_read && (
                            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                          {message.is_urgent && (
                            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        {message.subject && (
                          <h4 className="font-medium text-gray-800 mb-1">{message.subject}</h4>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && !loading && (
          <div className="p-6">
            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts available</h3>
                <p className="text-gray-600">Contacts will appear here when they're available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <div
                    key={`${contact.id}-${contact.type}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">
                          {contact.name ? contact.name.charAt(0).toUpperCase() : contact.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{contact.type}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && !loading && (
          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3 mt-1">
                        {getNotificationIcon(notification.notification_type)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      {!notification.is_read && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full ml-2 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <NewMessageModal
          contacts={contacts}
          onSend={handleSendMessage}
          onClose={() => setShowNewMessage(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default MessagingCenter;

