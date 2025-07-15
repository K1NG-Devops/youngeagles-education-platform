import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane, FaUser } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const ConversationView = ({ contact, messages, onBack, onSendMessage, loading }) => {
  const { auth } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      recipient_id: contact.id,
      recipient_type: contact.type,
      message: newMessage,
      subject: subject || undefined,
      is_urgent: isUrgent
    };

    const success = await onSendMessage(messageData);
    if (success) {
      setNewMessage('');
      setSubject('');
      setIsUrgent(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-medium">
              {contact.name ? contact.name.charAt(0).toUpperCase() : <FaUser />}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{contact.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{contact.type}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-600">Send your first message to {contact.name}</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === auth?.user?.id && message.sender_type === auth?.user?.role;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.subject && (
                      <div className={`font-semibold text-sm mb-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-700'
                      }`}>
                        {message.subject}
                      </div>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </span>
                      {message.is_urgent && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full ml-2">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <form onSubmit={handleSend} className="space-y-3">
            {/* Subject Line (Optional) */}
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            
            {/* Message Input */}
            <div className="flex space-x-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${contact.name}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
            
            {/* Urgent Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                Mark as urgent
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;

