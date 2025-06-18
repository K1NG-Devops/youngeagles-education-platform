import { useState, useEffect } from 'react';
import authService from '../services/authService.js';

const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    // Initialize from authService
    if (authService.isLoggedIn()) {
      return {
        token: authService.getToken(),
        user: authService.getCurrentUser(),
        role: authService.getUserRole()
      };
    }
    return null;
  });

  // Sync with authService
  useEffect(() => {
    const syncAuth = () => {
      if (authService.isLoggedIn()) {
        const currentAuth = {
          token: authService.getToken(),
          user: authService.getCurrentUser(),
          role: authService.getUserRole()
        };
        setAuth(currentAuth);
      } else {
        setAuth(null);
      }
    };

    // Initial sync
    syncAuth();

    // Listen for auth changes (optional: could implement event system)
    const interval = setInterval(syncAuth, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const login = async (emailOrUserData, password, role = 'parent') => {
    try {
      let result;
      
      if (typeof emailOrUserData === 'string') {
        // Called with email, password, role
        result = await authService.login(emailOrUserData, password, role);
      } else {
        // Called with userData object (legacy support)
        const userData = emailOrUserData;
        result = authService.handleLoginSuccess(userData);
      }
      
      // Update local state
      setAuth({
        token: result.token,
        user: result.user,
        role: result.role
      });
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuth(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force local logout even if API call fails
      setAuth(null);
    }
  };

  return {
    auth,
    login,
    logout,
    isAuthenticated: !!auth && authService.isLoggedIn(),
    isTeacher: auth?.role === 'teacher',
    isAdmin: auth?.role === 'admin',
    isParent: auth?.role === 'parent',
    user: auth?.user,
    token: auth?.token,
    role: auth?.role,
    // Additional helper methods
    getCurrentUser: () => authService.getCurrentUser(),
    getToken: () => authService.getToken(),
    hasRole: (role) => authService.hasRole(role),
    updateProfile: (userData) => authService.updateProfile(userData)
  };
};

export default useAuth;

