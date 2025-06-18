import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
    const { isAuthenticated, auth } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role'); // Get role from localStorage for consistency

    const userRole = auth?.role || role; // Prefer role from auth context, fallback to localStorage

    // Debug logging
    console.log('PrivateRoute - Auth state:', {
        isAuthenticated,
        userRole,
        currentPath: location.pathname,
        token: !!token,
    });
    
    // Check if the user is logged in
    const isLoggedIn = isAuthenticated || !!token;

    if (!isLoggedIn) {
        console.log('PrivateRoute - User not logged in, redirecting to login page...');
        // Redirect to a generic login page or specific based on context if available
        return <Navigate to='/login' replace />;
    }

    // Define routes and their required roles
    const requiresAdmin = ['/admin-dashboard'];
    const requiresTeacherOrAdmin = [
      '/teacher-dashboard',
      '/teacher-children-list',
      '/view-attendance',
      '/homework/upload',
      '/teacher-dashboard/activity-builder',
    ];
    const requiresParent = [
      '/dashboard',
      '/popupload',
      '/notifications',
      '/student/homework',
      '/submit-work',
      '/lessons',
      '/resources',
      '/videos',
      '/messages',
      '/register-child',
    ];

    // Check if the current path requires admin access
    if (requiresAdmin.includes(location.pathname)) {
        if (userRole === 'admin') {
            console.log('PrivateRoute - Admin access granted for', location.pathname);
            return <Outlet />;
        } else {
            console.log('PrivateRoute - Access denied for', location.pathname, ', redirecting non-admin.');
            if (userRole === 'teacher') {
              return <Navigate to='/teacher-dashboard' replace />;
            } else if (userRole === 'parent' || userRole === 'user') {
              return <Navigate to='/dashboard' replace />;
            } else {
              return <Navigate to='/unauthorized' replace />;
            }
        }
    }

    // Check if the current path requires teacher or admin access
    if (requiresTeacherOrAdmin.includes(location.pathname)) {
        if (userRole === 'teacher' || userRole === 'admin') {
            console.log('PrivateRoute - Teacher/Admin access granted for', location.pathname);
            return <Outlet />;
        } else {
            console.log('PrivateRoute - Access denied for', location.pathname, ', redirecting non-teacher/non-admin.');
            if (userRole === 'parent' || userRole === 'user') {
              return <Navigate to='/dashboard' replace />;
            } else {
              return <Navigate to='/unauthorized' replace />;
            }
        }
    }

    // Check if the current path requires parent access
    if (requiresParent.includes(location.pathname)) {
      if (userRole === 'parent' || userRole === 'user') {
        console.log('PrivateRoute - Parent access granted for', location.pathname);
        return <Outlet />;
      } else {
        console.log('PrivateRoute - Access denied for', location.pathname, ', redirecting non-parent.');
        if (userRole === 'teacher') {
          return <Navigate to='/teacher-dashboard' replace />;
        } else if (userRole === 'admin') {
          return <Navigate to='/admin-dashboard' replace />;
        } else {
          return <Navigate to='/unauthorized' replace />;
        }
      }
  }

    // If none of the specific role-based paths match, but user is logged in, allow access (for general private routes)
    console.log('PrivateRoute - General authenticated access granted for', location.pathname);
    return <Outlet />;
};

export default PrivateRoute;
