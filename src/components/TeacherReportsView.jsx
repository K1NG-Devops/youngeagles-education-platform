import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FaUser, FaPaperPlane, FaFileAlt, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

const TeacherReportsView = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reportData, setReportData] = useState({
    title: '',
    message: '',
    type: 'general', // general, progress, behavioral, attendance
    priority: 'medium' // low, medium, high
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sentReports, setSentReports] = useState([]);

  const token = localStorage.getItem('accessToken');
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    fetchStudents();
    fetchSentReports();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://youngeagles-api-server.up.railway.app/api/children',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data.children || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchSentReports = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reports/teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSentReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching sent reports:', error);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const sendReport = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    if (!reportData.title.trim() || !reportData.message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    try {
      setSending(true);
      
      // Send report to each selected student's parent
      const promises = selectedStudents.map(studentId => {
        const student = students.find(s => s.id === studentId);
        return axios.post(
          'https://youngeagles-api-server.up.railway.app/api/reports/send',
          {
            parentId: student.parent_id,
            studentId: studentId,
            title: reportData.title,
            message: reportData.message,
            type: reportData.type,
            priority: reportData.priority,
            teacherId: teacherId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      await Promise.all(promises);
      
      toast.success(`Report sent to ${selectedStudents.length} parent(s) successfully!`);
      
      // Reset form
      setReportData({
        title: '',
        message: '',
        type: 'general',
        priority: 'medium'
      });
      setSelectedStudents([]);
      
      // Refresh sent reports
      fetchSentReports();
      
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error('Failed to send report. Please try again.');
    } finally {
      setSending(false);
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

  const getReportTypeColor = (type) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      progress: 'bg-green-100 text-green-800',
      behavioral: 'bg-orange-100 text-orange-800',
      attendance: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || colors.general;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mobile-container">
      {/* Header */}
      <Card className="mobile-card">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardTitle className="mobile-heading">Send Reports to Parents</CardTitle>
          <div className="text-sm text-purple-100">
            Create and send progress reports, behavioral updates, and notifications to parents
          </div>
        </CardHeader>
      </Card>

      {/* Report Form */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle>Create New Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Progress Update"
                value={reportData.title}
                onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="type">Report Type</Label>
              <select
                id="type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={reportData.type}
                onChange={(e) => setReportData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="general">General Update</option>
                <option value="progress">Academic Progress</option>
                <option value="behavioral">Behavioral Report</option>
                <option value="attendance">Attendance Concern</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <select
              id="priority"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={reportData.priority}
              onChange={(e) => setReportData(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority - Urgent</option>
            </select>
          </div>

          <div>
            <Label htmlFor="message">Report Message</Label>
            <Textarea
              id="message"
              placeholder="Write your detailed report message here..."
              value={reportData.message}
              onChange={(e) => setReportData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Student Selection */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Select Students</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllStudents}
            >
              {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {selectedStudents.length} of {students.length} students selected
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentSelection(student.id)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedStudents.includes(student.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedStudents.includes(student.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedStudents.includes(student.id) && (
                      <FaCheck className="text-white text-xs" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Class: {student.className}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Send Button */}
      <div className="flex justify-center">
        <Button
          onClick={sendReport}
          disabled={sending || selectedStudents.length === 0 || !reportData.title.trim() || !reportData.message.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              Send Report to {selectedStudents.length} Parent(s)
            </>
          )}
        </Button>
      </div>

      {/* Recently Sent Reports */}
      {sentReports.length > 0 && (
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Recently Sent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentReports.slice(0, 10).map((report) => (
                <div
                  key={report.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{report.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        To: {report.student_name} • {report.parent_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                        <Badge className={getPriorityColor(report.priority)}>
                          {report.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(report.sent_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherReportsView;

