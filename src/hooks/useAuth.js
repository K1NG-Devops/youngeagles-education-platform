import { useState, useEffect } from 'react';
import { auth } from '../firebase';

const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    // Check for auth data in localStorage
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsedAuth = JSON.parse(stored);
        // Ensure role is set in localStorage
        if (parsedAuth.role) {
          localStorage.setItem('role', parsedAuth.role);
          // Set role-specific flags
          localStorage.setItem('isTeacher', parsedAuth.role === 'teacher');
          localStorage.setItem('isAdmin', parsedAuth.role === 'admin');
        }
        return parsedAuth;
      } catch (e) {
        console.error('Error parsing stored auth:', e);
      }
    }
    
    // Fallback: construct auth from individual localStorage items
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const authData = {
          token,
          user: userData,
          role: role || userData.role
        };
        // Ensure role is set in localStorage
        if (authData.role) {
          localStorage.setItem('role', authData.role);
          // Set role-specific flags
          localStorage.setItem('isTeacher', authData.role === 'teacher');
          localStorage.setItem('isAdmin', authData.role === 'admin');
        }
        return authData;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
      // Ensure role is set in localStorage
      if (auth.role) {
        localStorage.setItem('role', auth.role);
        // Set role-specific flags
        localStorage.setItem('isTeacher', auth.role === 'teacher');
        localStorage.setItem('isAdmin', auth.role === 'admin');
      }
    } else {
      localStorage.removeItem('auth');
      localStorage.removeItem('role');
      localStorage.removeItem('isTeacher');
      localStorage.removeItem('isAdmin');
    }
  }, [auth]);

  const login = (userData) => {
    console.log('useAuth - Setting auth data:', userData);
    // Ensure role is set in localStorage
    if (userData.role) {
      localStorage.setItem('role', userData.role);
      // Set role-specific flags
      localStorage.setItem('isTeacher', userData.role === 'teacher');
      localStorage.setItem('isAdmin', userData.role === 'admin');
    }
    setAuth(userData);
  };

  const logout = async () => {
    try {
      // Only sign out if auth is available and user is signed in
      if (auth && auth.currentUser) {
        await auth.signOut(); // Sign out from Firebase
      }
    } catch (e) {
      console.error('Error signing out from Firebase:', e);
    }
    setAuth(null);
    // Clear all auth-related localStorage items
    localStorage.removeItem('auth');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('parent_id');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isTeacher');
    localStorage.removeItem('isAdmin');
  };

  return {
    auth,
    login,
    logout,
    isAuthenticated: !!auth,
    isTeacher: auth?.role === 'teacher' || localStorage.getItem('isTeacher') === 'true',
    isAdmin: auth?.role === 'admin' || localStorage.getItem('isAdmin') === 'true',
    isParent: auth?.role === 'parent' || auth?.role === 'user' || (!auth?.role && localStorage.getItem('parent_id'))
  };
};

export default useAuth;
