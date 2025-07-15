import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const FullScreenHomework = () => {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([]);

  // Get user and child data from localStorage or context
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const childrenData = JSON.parse(localStorage.getItem('children') || '[]');
    
    setChildren(childrenData);
    if (childrenData.length > 0) {
      setSelectedChild(childrenData[0]);
    }
  }, []);

  // Fetch homework data
  useEffect(() => {
    if (!selectedChild) return;

    const fetchHomework = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/homeworks/for-parent/${selectedChild.parent_id}?child_id=${selectedChild.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHomeworks(data.homeworks || []);
      } catch (error) {
        console.error('Error fetching homework:', error);
        toast.error('Failed to load homework');
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [selectedChild]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleStartHomework = (homeworkId) => {
    navigate(`/submit-work?homework_id=${homeworkId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homework...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Homework</h1>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Child selector */}
      {children.length > 1 && (
        <div className="p-4 bg-white border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Child:
          </label>
          <select
            value={selectedChild?.id || ''}
            onChange={(e) => {
              const child = children.find(c => c.id === parseInt(e.target.value));
              setSelectedChild(child);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.first_name} {child.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Homework content */}
      <div className="p-4 space-y-4">
        {homeworks.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Homework Available</h3>
            <p className="text-gray-500">There are no homework assignments at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedChild?.first_name}'s Homework
            </h2>
            
            {homeworks.map((homework) => {
              const isCompleted = homework.completed_at;
              const dueDate = new Date(homework.due_date);
              const isOverdue = !isCompleted && dueDate < new Date();
              
              return (
                <div
                  key={homework.id}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-200 ${
                    isCompleted
                      ? 'border-green-200 bg-green-50'
                      : isOverdue
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {homework.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {homework.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Due: {dueDate.toLocaleDateString()}
                          </span>
                        </div>
                        
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                        
                        {isOverdue && (
                          <span className="text-red-600 font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <button
                      onClick={() => handleStartHomework(homework.id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isOverdue
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Start Homework
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenHomework;

