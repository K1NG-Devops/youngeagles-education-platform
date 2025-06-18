import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaChalkboardTeacher, FaTimes, FaCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const MessagingSystem = ({ isOpen, onClose, selectedChild }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('accessToken');
  const parentId = localStorage.getItem('parent_id');

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch teachers when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      fetchMessages();
    }
  }, [isOpen, selectedChild]);

  const fetchTeachers = async () => {
    try {
      // This would be an actual API call to get teachers
      // For now, using mock data
      setTeachers([
        { id: 1, name: 'Mrs. Sarah Johnson', subject: 'Mathematics', online: true },
        { id: 2, name: 'Mr. David Smith', subject: 'English', online: false },
        { id: 3, name: 'Ms. Emily Brown', subject: 'Science', online: true },
      ]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedTeacher || !selectedChild) return;
    
    setIsLoading(true);
    try {
      // This would be an actual API call to get messages
      // For now, using mock data
      const mockMessages = [
        {
          id: 1,
          senderId: parentId,
          senderType: 'parent',
          message: 'Hello, how is my child doing in class?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        },
        {
          id: 2,
          senderId: selectedTeacher,
          senderType: 'teacher',
          message: 'Your child is doing very well! They are very engaged in class activities.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: true
        },
        {
          id: 3,
          senderId: parentId,
          senderType: 'parent',
          message: 'That\'s wonderful to hear! Any areas we should focus on at home?',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          read: true
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTeacher) return;
    
    const messageData = {
      id: Date.now(),
      senderId: parentId,
      senderType: 'parent',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    try {
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      
      // Here you would make an API call to send the message
      // await axios.post('/api/messages', messageData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove the message from local state if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== messageData.id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Messages</h2>
            {selectedChild && (
              <p className="text-blue-100 text-sm">
                Regarding: {selectedChild.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            aria-label="Close messaging"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Teacher Selection */}
        <div className="p-4 border-b bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Teacher:
          </label>
          <select
            value={selectedTeacher}
            onChange={(e) => {
              setSelectedTeacher(e.target.value);
              setMessages([]); // Clear messages when switching teachers
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a teacher...</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} - {teacher.subject}
                {teacher.online && ' 🟢'}
              </option>
            ))}
          </select>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedTeacher ? (
            <div className="text-center text-gray-500 mt-10">
              <FaUser className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a teacher to start messaging</p>
            </div>
          ) : isLoading ? (
            <div className="text-center text-gray-500 mt-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <FaChalkboardTeacher className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with your teacher!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderType === 'parent' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderType === 'parent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderType === 'parent'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selectedTeacher && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="2"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;

