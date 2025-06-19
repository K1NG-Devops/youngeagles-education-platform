// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    TEACHER_LOGIN: `${API_BASE_URL}/api/auth/teacher-login`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  },
  HOMEWORK: {
    BASE: `${API_BASE_URL}/api/homework`,
    FOR_PARENT: (parentId) => `${API_BASE_URL}/api/homework/for-parent/${parentId}`,
    SUBMIT: `${API_BASE_URL}/api/homework/submit`,
  },
  FCM: {
    TOKEN: `${API_BASE_URL}/api/fcm/token`,
  },
  ATTENDANCE: {
    BASE: `${API_BASE_URL}/api/attendance`,
  }
};

// Helper function for making API requests
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

