import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaEye, FaDownload, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'sonner';

const TeacherSubmissionsView = () => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [studentsWithStatus, setStudentsWithStatus] = useState([]);
  const [stats, setStats] = useState({ total: 0, submitted: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const token = localStorage.getItem('accessToken');
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    fetchAllSubmissions();
    fetchTeacherHomeworks();
  }, []);

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true);
      console.log('Fetching all submissions for teacher:', teacherId);
      
      const response = await axios.get(
        'https://youngeagles-api-server.up.railway.app/api/homeworks/teacher/all-submissions',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('All submissions response:', response.data);
      setAllSubmissions(response.data.submissions || response.data || []);
      
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      
      if (error.response) {
        const status = error.response.status;
        console.error('API Error:', {
          status,
          message: error.response.data?.message,
          url: error.config?.url
        });
        
        if (status === 500) {
          toast.error('Server error: Unable to fetch submissions. Please try again later.');
        } else if (status === 404) {
          toast.error('No submissions found for this teacher.');
        } else {
          toast.error(`Failed to load submissions: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else {
        toast.error('Network error: Could not connect to server');
      }
      
      setAllSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherHomeworks = async () => {
    try {
      const response = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/for-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHomeworks(response.data.homeworks || []);
    } catch (error) {
      console.error('Error fetching homeworks:', error);
    }
  };

  const fetchSubmissionsForHomework = async (homeworkId) => {
    try {
      console.log('Fetching submissions for homework ID:', homeworkId);
      
      const response = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/${homeworkId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Submissions API response:', response.data);
      
      // Handle different possible response structures
      const responseData = response.data;
      
      // Check if response has the expected structure
      if (responseData && typeof responseData === 'object') {
        const {
          homework = null,
          submissions = [],
          studentsWithStatus = [],
          totalStudents = 0,
          submittedCount = 0,
          pendingCount = 0
        } = responseData;
        
        setSelectedHomework(homework);
        setStudentsWithStatus(studentsWithStatus);
        setStats({
          total: totalStudents,
          submitted: submittedCount,
          pending: pendingCount
        });
        
        console.log('Successfully loaded submissions:', {
          homework: homework?.title,
          totalSubmissions: submissions.length,
          studentsCount: studentsWithStatus.length
        });
      } else {
        console.warn('Unexpected response structure:', responseData);
        toast.error('Received unexpected data format from server');
      }
      
    } catch (error) {
      console.error('Error fetching submissions for homework:', error);
      
      // Provide more specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown error';
        
        console.error('API Error Details:', {
          status,
          message,
          url: error.config?.url,
          data: error.response.data
        });
        
        if (status === 404) {
          toast.error('Homework not found or no submissions available');
        } else if (status === 403) {
          toast.error('You do not have permission to view these submissions');
        } else if (status === 401) {
          toast.error('Please log in again to view submissions');
        } else {
          toast.error(`Failed to load submissions: ${message}`);
        }
      } else if (error.request) {
        console.error('Network error:', error.request);
        toast.error('Network error: Could not connect to server');
      } else {
        console.error('Request setup error:', error.message);
        toast.error('Error setting up request');
      }
      
      // Reset states on error
      setSelectedHomework(null);
      setStudentsWithStatus([]);
      setStats({ total: 0, submitted: 0, pending: 0 });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mobile-container">
      {/* Header */}
      <Card className="mobile-card">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="mobile-heading">Student Homework Submissions</CardTitle>
          <div className="text-sm text-blue-100">
            View and manage homework submissions from your students
          </div>
        </CardHeader>
      </Card>

      {/* Homework Selection */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle>Select Homework to View Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeworks.map((hw) => {
              const submissionsForHw = allSubmissions.filter(s => s.homework_id === hw.id);
              return (
                <div
                  key={hw.id}
                  onClick={() => fetchSubmissionsForHomework(hw.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedHomework?.id === hw.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{hw.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Class: {hw.class_name}</div>
                    <div>Due: {formatDate(hw.due_date)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {hw.type || 'Written'}
                      </span>
                      <Badge className={`text-xs ${
                        submissionsForHw.length > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {submissionsForHw.length} submissions
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Show detailed view when homework is selected */}
      {selectedHomework && (
        <>
          {/* Selected Homework Info */}
          <Card className="mobile-card">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardTitle className="mobile-heading">{selectedHomework.title}</CardTitle>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Class: {selectedHomework.class_name}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Due: {formatDate(selectedHomework.due_date)}
                </Badge>
                {selectedHomework.type && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Type: {selectedHomework.type}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

        {/* Students List with Submission Status */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Student Submission Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentsWithStatus.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border transition-all ${
                  student.hasSubmitted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      student.hasSubmitted ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium mobile-body">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600 mobile-caption">
                        Class: {student.className}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {student.hasSubmitted ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" />
                          Submitted
                        </Badge>
                        {student.submission && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(student.submission)}
                            className="touch-target"
                          >
                            <FaEye className="mr-1" />
                            View
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1" />
                        Not Submitted
                      </Badge>
                    )}
                  </div>
                </div>
                
                {student.submission && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p className="text-gray-600">
                          {formatDate(student.submission.submitted_at)}
                        </p>
                      </div>
                      {student.submission.completion_answer && (
                        <div>
                          <span className="font-medium">Answer:</span>
                          <p className="text-gray-600 truncate">
                            {student.submission.completion_answer.substring(0, 50)}...
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {student.submission.file_url && (
                      <div className="mt-2">
                        <a
                          href={student.submission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FaFileAlt className="mr-1" />
                          View Submitted File
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </>
      )}

      {/* All Recent Submissions Overview */}
      {!selectedHomework && allSubmissions.length > 0 && (
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Recent Submissions (All Homework)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allSubmissions.slice(0, 10).map((submission) => (
                <div
                  key={`${submission.homework_id}-${submission.parent_id}`}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {submission.student_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {submission.homework_title} • {submission.class_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {formatDate(submission.submitted_at)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <FaEye className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Submission View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Submission Details</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-medium">Student:</label>
                  <p>{selectedSubmission.student_name}</p>
                </div>
                
                <div>
                  <label className="font-medium">Submitted At:</label>
                  <p>{formatDate(selectedSubmission.submitted_at)}</p>
                </div>
                
                {selectedSubmission.completion_answer && (
                  <div>
                    <label className="font-medium">Answer/Work:</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <pre className="whitespace-pre-wrap">
                        {selectedSubmission.completion_answer}
                      </pre>
                    </div>
                  </div>
                )}
                
                {selectedSubmission.comment && (
                  <div>
                    <label className="font-medium">Student Comment:</label>
                    <p className="mt-1 p-3 bg-blue-50 rounded border">
                      {selectedSubmission.comment}
                    </p>
                  </div>
                )}
                
                {selectedSubmission.file_url && (
                  <div>
                    <label className="font-medium">Submitted File:</label>
                    <div className="mt-2">
                      <a
                        href={selectedSubmission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <FaDownload className="mr-2" />
                        Download File
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissionsView;

