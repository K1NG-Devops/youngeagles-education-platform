import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const HomeworkDebugger = () => {
  const [debugResult, setDebugResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    homeworkId: '',
    parentId: '',
    childId: ''
  });

  const handleDebug = async () => {
    if (!formData.homeworkId || !formData.parentId) {
      alert('Please provide at least Homework ID and Parent ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        homeworkId: formData.homeworkId,
        parentId: formData.parentId,
        ...(formData.childId && { childId: formData.childId })
      });

      const response = await axios.get(
        `${API_BASE_URL}/homeworks/debug?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDebugResult(response.data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugResult({
        error: true,
        message: error.response?.data?.message || 'Debug request failed',
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">
        🔍 Homework Submission Debugger
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Homework ID
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 123"
            value={formData.homeworkId}
            onChange={(e) => setFormData(prev => ({ ...prev, homeworkId: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent ID
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 456"
            value={formData.parentId}
            onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child ID (optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 789"
            value={formData.childId}
            onChange={(e) => setFormData(prev => ({ ...prev, childId: e.target.value }))}
          />
        </div>
      </div>
      
      <button
        onClick={handleDebug}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Debugging...' : 'Debug Submission'}
      </button>
      
      {debugResult && (
        <div className="mt-4">
          <h4 className="font-bold text-gray-800 mb-2">Debug Results:</h4>
          
          {debugResult.error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {debugResult.message}
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <h5 className="font-semibold mb-2">Summary:</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>Homework: {debugResult.debug_info?.homework ? '✅ Found' : '❌ Not found'}</div>
                  <div>All Submissions: {debugResult.debug_info?.allSubmissions || 0}</div>
                  <div>Parent Submissions: {debugResult.debug_info?.parentSubmissions || 0}</div>
                  <div>Child Submissions: {debugResult.debug_info?.childSubmissions || 0}</div>
                  <div>Completions: {debugResult.debug_info?.allCompletions || 0}</div>
                  <div>Child Details: {debugResult.debug_info?.childDetails ? '✅ Found' : '❌ Not found'}</div>
                </div>
              </div>
              
              {/* Detailed Data */}
              <div className="bg-gray-50 border rounded p-3">
                <h5 className="font-semibold mb-2">Detailed Data:</h5>
                <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
                  {JSON.stringify(debugResult.detailed_data, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeworkDebugger;

