import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaTrophy, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProgressTracker = ({ teacherId }) => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchHomeworkProgress();
  }, [teacherId]);

  const fetchHomeworkProgress = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://youngeagles-api-server.up.railway.app/api/homework/for-teacher/${teacherId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHomeworks(data.homeworks || []);
        calculateStats(data.homeworks || []);
      }
    } catch (error) {
      console.error('Error fetching homework progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (homeworkList) => {
    const total = homeworkList.length;
    const completed = homeworkList.filter(hw => hw.status === 'Completed').length;
    const pending = homeworkList.filter(hw => hw.status === 'Pending').length;
    const overdue = homeworkList.filter(hw => {
      const dueDate = new Date(hw.due_date);
      return hw.status === 'Pending' && dueDate < new Date();
    }).length;

    setStats({ total, completed, pending, overdue });
  };

  const getStatusIcon = (status, dueDate) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'Pending';
    
    if (status === 'Completed') return <FaCheckCircle className="text-green-500" />;
    if (isOverdue) return <FaExclamationTriangle className="text-red-500" />;
    return <FaClock className="text-yellow-500" />;
  };

  const getCompletionRate = () => {
    return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Homework Progress</h2>
        <FaTrophy className="text-yellow-500 text-2xl" />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          className="bg-blue-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">Total Assignments</div>
        </motion.div>
        
        <motion.div 
          className="bg-green-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-700">Completed</div>
        </motion.div>
        
        <motion.div 
          className="bg-yellow-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-700">Pending</div>
        </motion.div>
        
        <motion.div 
          className="bg-red-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-700">Overdue</div>
        </motion.div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-sm font-medium text-gray-700">{getCompletionRate()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-green-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionRate()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>

      {/* Recent Homework List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Assignments</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {homeworks.slice(0, 5).map((homework, index) => (
            <motion.div 
              key={homework.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(homework.status, homework.due_date)}
                <div>
                  <div className="font-medium text-gray-800">{homework.title}</div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(homework.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {homework.status === 'Completed' && (
                  <FaStar className="text-yellow-400" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  homework.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : new Date(homework.due_date) < new Date()
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {homework.status === 'Completed' ? 'Complete' : 
                   new Date(homework.due_date) < new Date() ? 'Overdue' : 'Pending'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Badge */}
      {getCompletionRate() >= 80 && (
        <motion.div 
          className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-center text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <FaTrophy className="text-2xl mx-auto mb-2" />
          <div className="font-bold">Outstanding Performance!</div>
          <div className="text-sm">Your class has excellent homework completion rates!</div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTracker;

