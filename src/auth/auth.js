import axios from "axios";
import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../config/api';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = (authData) => {
    setIsAuthenticated(true);
    setUser(authData.user);
    setRole(authData.role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.clear();
  };

  const value = {
    isAuthenticated,
    user,
    role,
    login,
    logout,
    isTeacher: role === 'teacher',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export async function teacherLogin(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/teacher-login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const token = response.data.token;

    // JWT decode function
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(token);

    if (decodedToken.role !== "teacher") {
      throw new Error("You are not authorized to access this page.");
    }

    // Set localStorage once here with consistent keys
    localStorage.setItem("accessToken", token);
    localStorage.setItem("teacherId", decodedToken.id);  // consistent key
    localStorage.setItem("role", decodedToken.role);
    localStorage.setItem("user", JSON.stringify(decodedToken));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isTeacher", "true");

    return {
      success: true,
      teacherId: decodedToken.id,
      message: "Login successful",
      token: token,
      user: decodedToken,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Login failed";
    return { success: false, message };
  }
}

export async function adminLogin(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/admin-login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    // Check if token exists in response
    const token = response.data.accessToken;
    if (!token) {
      console.error('No token in response:', response.data);
      return { success: false, message: "Login failed: No token returned from server" };
    }

    // JWT decode function
    function parseJwt(token) {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format');
      }
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(token);

    if (decodedToken.role !== "admin") {
      throw new Error("You are not authorized to access this page.");
    }

    // Set localStorage once here with consistent keys
    localStorage.setItem("accessToken", token);
    localStorage.setItem("adminId", decodedToken.id);  // consistent key
    localStorage.setItem("role", decodedToken.role);
    localStorage.setItem("user", JSON.stringify(decodedToken));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", "true");

    return {
      success: true,
      adminId: decodedToken.id,
      message: "Login successful",
      token: token,
      user: decodedToken,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Login failed";
    return { success: false, message };
  }
}
