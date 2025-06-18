import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import { teacherLogin } from './auth';

const AuthTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const { auth: authContext, login } = useAuth();

  const addResult = (test, result, error = null) => {
    setTestResults(prev => ({
      ...prev,
      [test]: { result, error, timestamp: new Date().toISOString() }
    }));
  };

  const testFirebaseConfig = () => {
    try {
      addResult('Firebase Config', {
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        status: 'Connected'
      });
    } catch (error) {
      addResult('Firebase Config', false, error.message);
    }
  };

  const testTeacherLogin = async () => {
    try {
      setLoading(true);
      const result = await teacherLogin('dima@youngeagles.org.za', 'teacher123');
      addResult('Teacher Login', result);
      
      if (result.success) {
        login({
          token: result.token,
          user: result.user,
          role: 'teacher'
        });
      }
    } catch (error) {
      addResult('Teacher Login', false, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      addResult('Google Sign-In', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified
      });
    } catch (error) {
      addResult('Google Sign-In', false, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/debug/data');
      const data = await response.json();
      addResult('API Connection', {
        status: response.ok ? 'Connected' : 'Failed',
        parentCount: data.parentCount,
        teacherCountSkydek: data.teacherCountSkydek,
        teacherCountRailway: data.teacherCountRailway
      });
    } catch (error) {
      addResult('API Connection', false, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthState = () => {
    localStorage.clear();
    sessionStorage.clear();
    auth.signOut();
    addResult('Clear Auth', 'Cleared all authentication state');
    window.location.reload();
  };

  useEffect(() => {
    testFirebaseConfig();
    testApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Authentication Test Dashboard</h1>
        
        {/* Current Auth State */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Current Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Auth Context:</strong> {JSON.stringify(authContext, null, 2)}</p>
            <p><strong>LocalStorage Token:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'None'}</p>
            <p><strong>LocalStorage Role:</strong> {localStorage.getItem('role') || 'None'}</p>
            <p><strong>Firebase User:</strong> {auth.currentUser ? auth.currentUser.email : 'None'}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={testFirebaseConfig}
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            Test Firebase Config
          </button>
          <button
            onClick={testApiConnection}
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            Test API Connection
          </button>
          <button
            onClick={testTeacherLogin}
            className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600 disabled:opacity-50"
            disabled={loading}
          >
            Test Teacher Login
          </button>
          <button
            onClick={testGoogleSignIn}
            className="bg-red-500 text-white p-3 rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Test Google Sign-In
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={clearAuthState}
            className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
          >
            Clear All Auth State
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gray-600 text-white p-3 rounded hover:bg-gray-700"
          >
            Go to Login Page
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Test Results</h2>
          {loading && <div className="text-blue-600 mb-3">Running test...</div>}
          <div className="space-y-3">
            {Object.entries(testResults).map(([test, data]) => (
              <div key={test} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">{test}</h3>
                <p className="text-sm text-gray-600">Time: {new Date(data.timestamp).toLocaleTimeString()}</p>
                {data.error ? (
                  <div className="bg-red-100 text-red-700 p-2 rounded mt-1">
                    <strong>Error:</strong> {data.error}
                  </div>
                ) : (
                  <div className="bg-green-100 text-green-700 p-2 rounded mt-1">
                    <pre className="text-xs overflow-auto">{JSON.stringify(data.result, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;

