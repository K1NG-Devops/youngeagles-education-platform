import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: (response) => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        toast.error('reCAPTCHA expired. Please try again.');
      }
    });
    
    setRecaptchaVerifier(verifier);
    
    return () => {
      if (verifier) {
        verifier.clear();
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatPhoneNumber = (number) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10) {
      return `+27${cleaned}`; // South Africa country code
    } else if (cleaned.length === 11 && cleaned.startsWith('27')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return number;
    }
    
    return `+${cleaned}`;
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

  const sendVerificationCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      console.log('Sending code to:', formattedPhoneNumber);
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );
      
      setVerificationId(confirmationResult.verificationId);
      setCodeSent(true);
      setResendCooldown(60); // 60 seconds cooldown
      toast.success('Verification code sent to your phone!');
    } catch (error) {
      console.error('Send verification code error:', error);
      
      let errorMessage = 'Failed to send verification code';
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'reCAPTCHA verification failed';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Reset reCAPTCHA
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        window.location.reload(); // Reload to reset reCAPTCHA
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const result = await signInWithCredential(auth, credential);
      
      // Create user session with your backend
      await createUserSession(result.user);
      
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify code error:', error);
      
      let errorMessage = 'Invalid verification code';
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid verification code';
          break;
        case 'auth/code-expired':
          errorMessage = 'Verification code has expired';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );
      
      setVerificationId(confirmationResult.verificationId);
      setResendCooldown(60);
      toast.success('New verification code sent!');
    } catch (error) {
      console.error('Resend code error:', error);
      toast.error('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  if (codeSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/app-icons/yehc_logo.png"
            alt="Young Eagles"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a code to <strong>{phoneNumber}</strong>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={verifyCode}>
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-center text-lg font-mono"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </div>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setVerificationCode('');
                    setPhoneNumber('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        className="mx-auto h-12 w-auto"
        src="/app-icons/yehc_logo.png"
        alt="Young Eagles"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with Phone
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your phone number to receive a verification code
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={sendVerificationCode}>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="+27 123 456 7890 or 0123456789"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                South African numbers: +27 or 0 prefix
              </p>
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container" className="flex justify-center"></div>

            <div>
              <button
                type="submit"
                disabled={loading || !phoneNumber}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
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
                to="/passwordless-login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Sign in with Email Link
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;

