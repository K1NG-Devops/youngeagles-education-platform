import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

const NewMessageModal = ({ contacts, onSend, onClose, loading }) => {
  const [selectedContact, setSelectedContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContact || !message.trim()) return;

    const contactData = contacts.find(c => `${c.id}-${c.type}` === selectedContact);
    if (!contactData) return;

    const messageData = {
      recipient_id: contactData.id,
      recipient_type: contactData.type,
      subject: subject || undefined,
      message: message,
      is_urgent: isUrgent
    };

    await onSend(messageData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contact Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to
            </label>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            />
            
            {/* Contact List */}
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No contacts found' : 'No contacts available'}
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <label
                    key={`${contact.id}-${contact.type}`}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="radio"
                      name="contact"
                      value={`${contact.id}-${contact.type}`}
                      checked={selectedContact === `${contact.id}-${contact.type}`}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      className="mr-3"
                    />
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 text-sm font-medium">
                        {contact.name ? contact.name.charAt(0).toUpperCase() : <FaUser className="text-xs" />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{contact.type}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject (optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Urgent Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="urgent-modal"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="urgent-modal" className="ml-2 text-sm text-gray-700">
              Mark as urgent
            </label>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedContact || !message.trim() || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <FaPaperPlane className="mr-2" />
              )}
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMessageModal;

