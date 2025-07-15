import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const from = `${year}-${month.toString().padStart(2, '0')}-01`;
      const to = `${year}-${month.toString().padStart(2, '0')}-31`;
      
      const response = await axios.get(
        `${API_BASE_URL}/events?status=approved&from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarDay className="text-blue-600" />
              Events Calendar
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-700 min-w-[150px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(dayName => (
              <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-500">
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day && 
                new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() && 
                new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                    ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                    ${day ? 'hover:bg-gray-100' : 'cursor-default'}
                  `}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="lg:w-80">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedDate ? formatDate(selectedDate) : 'Select a date'}
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : selectedDate ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate.getDate()).length === 0 ? (
                  <p className="text-gray-500 text-sm">No events on this date</p>
                ) : (
                  getEventsForDate(selectedDate.getDate()).map((event, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{formatTime(event.startDate)}</span>
                          {event.endDate && (
                            <span> - {formatTime(event.endDate)}</span>
                          )}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.type && (
                          <div className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {event.type}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Click on a date to view events</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
            <div className="space-y-2">
              {events
                .filter(event => new Date(event.startDate) >= new Date())
                .slice(0, 5)
                .map((event, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-medium text-gray-800 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              }
              {events.filter(event => new Date(event.startDate) >= new Date()).length === 0 && (
                <p className="text-gray-500 text-sm">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;

