import React, { useState, useEffect } from 'react';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';

const PasswordlessLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is completing the sign-in process
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleEmailLinkSignIn();
    }
  }, []);

  const handleEmailLinkSignIn = async () => {
    setVerifying(true);
    try {
      // Get email from localStorage or prompt user
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      // Complete the sign-in
      const result = await signInWithEmailLink(auth, email, window.location.href);
      
      // Clear the email from storage
      window.localStorage.removeItem('emailForSignIn');
      
      // Create user session with your backend
      await createUserSession(result.user);
      
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Email link sign-in error:', error);
      toast.error('Failed to sign in with email link');
    } finally {
      setVerifying(false);
    }
  };

  const createUserSession = async (firebaseUser) => {
    try {
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Use the centralized API URL
      const apiUrl = API_BASE_URL;
      // Send to your backend for session creation
      const response = await fetch(`${apiUrl}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName
        })
      });

      if (response.ok) {
        const data = await response.json();
        login(data);
        localStorage.setItem('parent_id', data.user.id);
        localStorage.setItem('accessToken', data.token);
      }
    } catch (error) {
      console.error('Session creation error:', error);
      // Even if backend fails, user is authenticated with Firebase
    }
  };

  const handleSendSignInLink = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const actionCodeSettings = {
        // URL you want to redirect back to
        url: `${window.location.origin}/passwordless-login`,
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.youngeagles.app'
        },
        android: {
          packageName: 'com.youngeagles.app',
          installApp: true,
          minimumVersion: '12'
        },
        dynamicLinkDomain: 'yourdomain.page.link' // Optional: if you have Firebase Dynamic Links
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email locally so you can complete the sign-in
      window.localStorage.setItem('emailForSignIn', email);
      
      setEmailSent(true);
      toast.success('Sign-in link sent to your email!');
    } catch (error) {
      console.error('Send sign-in link error:', error);
      
      let errorMessage = 'Failed to send sign-in link';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/missing-email':
          errorMessage = 'Email address is required';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Verifying your sign-in...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto rounded-full"
          src="/app-icons/yehc_logo.png"
          alt="Young Eagles"
        />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Sign-in Link Sent!</strong>
                <p className="block sm:inline mt-2">
                  We've sent a sign-in link to <strong>{email}</strong>
                </p>
              </div>
              
              <p className="text-gray-600 mb-4">
                Click the link in the email to sign in. The link will work on any device.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send to Different Email
                </button>
                
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        className="mx-auto h-12 w-auto rounded-full"
        src="/app-icons/yehc_logo.png"
        alt="Young Eagles"
      />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with Email Link
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a secure sign-in link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSendSignInLink}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Sign-in Link'
                )}
              </button>
            </div>

            <div className="text-center space-y-2">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Password Login
              </Link>
              <br />
              <Link
                to="/phone-login"
                className="text-sm text-green-600 hover:text-green-500"
              >
                Sign in with Phone Number
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordlessLogin;

