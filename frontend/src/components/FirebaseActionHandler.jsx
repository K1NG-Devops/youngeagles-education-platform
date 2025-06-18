import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  applyActionCode, 
  confirmPasswordReset, 
  verifyPasswordResetCode,
  checkActionCode 
} from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const FirebaseActionHandler = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const modeParam = urlParams.get('mode');
    const oobCodeParam = urlParams.get('oobCode');
    const continueUrl = urlParams.get('continueUrl');
    
    setMode(modeParam);
    setActionCode(oobCodeParam);
    
    if (!modeParam || !oobCodeParam) {
      setError('Invalid action link');
      setLoading(false);
      return;
    }
    
    handleInitialAction(modeParam, oobCodeParam);
  }, [location]);

  const handleInitialAction = async (actionMode, code) => {
    try {
      switch (actionMode) {
        case 'resetPassword':
          // Verify the password reset code and get email
          const email = await verifyPasswordResetCode(auth, code);
          setEmail(email);
          setLoading(false);
          break;
          
        case 'verifyEmail':
          // Apply the email verification code
          await applyActionCode(auth, code);
          setSuccess('Email verified successfully! You can now sign in.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
          break;
          
        case 'recoverEmail':
          // Get the restored email address
          const info = await checkActionCode(auth, code);
          setEmail(info.data.email);
          setSuccess(`Email recovery initiated for ${info.data.email}`);
          setLoading(false);
          break;
          
        default:
          setError('Unknown action mode');
          setLoading(false);
      }
    } catch (error) {
      console.error('Action handler error:', error);
      setError(getErrorMessage(error.code));
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Password reset successfully! You can now sign in with your new password.');
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(getErrorMessage(error.code));
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/expired-action-code':
        return 'This action link has expired. Please request a new one.';
      case 'auth/invalid-action-code':
        return 'This action link is invalid. Please request a new one.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'An error occurred. Please try again or contact support.';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Processing...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      );
    }

    if (success) {
      return (
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">{success}</span>
          </div>
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
        </div>
      );
    }

    if (mode === 'resetPassword') {
      return (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Reset Your Password
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Enter a new password for <strong>{email}</strong>
          </p>
          
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-gray-600">Processing your request...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto rounded-full"
          src="/app-icons/yehc_logo.png"
          alt="Young Eagles"
        />
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Action
        </h1>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FirebaseActionHandler;

