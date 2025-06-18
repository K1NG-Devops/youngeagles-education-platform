import { api } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';
import { toast } from 'react-toastify';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.token = null;
  }

  // Initialize auth state from localStorage
  init() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
        
        // Verify token is still valid
        this.verifyToken().catch(() => {
          this.logout();
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    }
  }

  // Login with email and password
  async login(email, password, role = 'parent') {
    try {
      console.log('🔐 Attempting login:', { email, role });

      // For development mode, still allow mock login as fallback
      if (API_CONFIG.isDevelopment) {
        try {
          // Try real API first
          const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
            email,
            password,
            role
          });

          return this.handleLoginSuccess(response.data);
        } catch (apiError) {
          console.warn('🔄 API login failed, using mock data:', apiError.message);
          
          // Fallback to mock login in development
          const mockData = this.createMockUser(email, role);
          return this.handleLoginSuccess(mockData);
        }
      } else {
        // Production mode - only use real API
        const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
          email,
          password,
          role
        });

        return this.handleLoginSuccess(response.data);
      }
    } catch (error) {
      console.error('🚨 Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Handle successful login
  handleLoginSuccess(data) {
    const { token, user, refreshToken } = data;
    
    // Store auth data
    this.token = token;
    this.user = user;
    this.isAuthenticated = true;

    // Save to localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Set role-specific localStorage items
    if (user.role === 'parent') {
      localStorage.setItem('parent_id', user.id);
    } else if (user.role === 'teacher') {
      localStorage.setItem('teacherId', user.id);
    } else if (user.role === 'admin') {
      localStorage.setItem('adminId', user.id);
    }

    console.log('✅ Login successful:', user.email, user.role);
    toast.success(`Welcome back, ${user.name || user.email}!`);

    return { token, user, role: user.role };
  }

  // Create mock user for development
  createMockUser(email, role) {
    const mockUsers = {
      parent: {
        id: 1,
        email: email,
        name: 'Test Parent',
        role: 'parent'
      },
      teacher: {
        id: 2,
        email: email,
        name: 'Test Teacher',
        role: 'teacher'
      },
      admin: {
        id: 3,
        email: email,
        name: 'Test Admin',
        role: 'admin'
      }
    };

    return {
      token: `mock-${role}-token-${Date.now()}`,
      user: mockUsers[role] || mockUsers.parent,
      refreshToken: `mock-refresh-token-${Date.now()}`
    };
  }

  // Register new user
  async register(userData) {
    try {
      console.log('📝 Attempting registration:', userData.email);

      const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
      
      toast.success('Registration successful! Please log in.');
      return response.data;
    } catch (error) {
      console.error('🚨 Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated && this.token) {
        await api.post(API_CONFIG.ENDPOINTS.LOGOUT);
      }
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('parent_id');
      localStorage.removeItem('teacherId');
      localStorage.removeItem('adminId');

      console.log('👋 User logged out');
      toast.info('You have been logged out.');
    }
  }

  // Verify token validity
  async verifyToken() {
    try {
      if (!this.token) {
        throw new Error('No token available');
      }

      const response = await api.get(API_CONFIG.ENDPOINTS.VERIFY_TOKEN);
      return response.data;
    } catch (error) {
      console.warn('🔐 Token verification failed:', error.message);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update stored tokens
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      this.token = accessToken;
      console.log('🔄 Token refreshed successfully');
      
      return accessToken;
    } catch (error) {
      console.error('🔄 Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isLoggedIn() {
    return this.isAuthenticated && this.token && this.user;
  }

  // Get user role
  getUserRole() {
    return this.user?.role || localStorage.getItem('role');
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Get auth token
  getToken() {
    return this.token || localStorage.getItem('accessToken');
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, userData);
      
      // Update local user data
      this.user = { ...this.user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(this.user));
      
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      console.error('🚨 Profile update failed:', error);
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Create singleton instance
const authService = new AuthService();

// Initialize on module load
authService.init();

export default authService;

