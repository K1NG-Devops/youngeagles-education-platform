import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AutoLogout = ({ children }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const { logout } = useAuth();

  const logoutAndNavigate = async () => {
    await logout();
    navigate('/login');
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowWarning(false);

    // Show warning after 4 minutes
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, 4 * 60 * 1000);

    // Auto logout after 5 minutes
    timeoutRef.current = setTimeout(logoutAndNavigate, 5 * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, []);

  const stayLoggedIn = () => {
    resetTimer();
  };

  return (
    <>
      {showWarning && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Inactive Session</h3>
            <p>You will be logged out in 1 minute due to inactivity.</p>
            <button onClick={stayLoggedIn}>Stay Logged In</button>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default AutoLogout;

// Basic modal styles
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalContentStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  textAlign: 'center',
};
