import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://youngeagles-api-server.up.railway.app';

class DatabaseService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Don't log errors in development mode to reduce console noise
        if (!import.meta.env.DEV) {
          console.error('API Error:', error.response?.data || error.message);
        }
        
        // Return a resolved promise with error info instead of rejecting
        // This prevents unhandled promise rejections
        return Promise.resolve({
          error: true,
          status: error.response?.status || 500,
          message: error.response?.data?.message || error.message || 'Network error',
          data: null
        });
      }
    );
  }

  // Register for 2026 intake
  async register2026(data) {
    try {
      const response = await this.api.post('/api/register-2026', {
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        childName: data.childName,
        childAge: data.childAge,
        childGender: data.childGender,
        preferredProgram: data.preferredProgram,
        registrationDate: new Date().toISOString(),
        status: 'pending',
        source: 'website',
        additionalNotes: data.additionalNotes || ''
      });
      
      // Check if response indicates an error
      if (response.error) {
        return { success: false, error: response.message };
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Get registration status
  async getRegistrationStatus(email) {
    try {
      const response = await this.api.get(`/api/registration-status/${email}`);
      
      if (response.error) {
        return { success: false, error: response.message };
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Subscribe to newsletter
  async subscribeNewsletter(email, name = '') {
    try {
      const response = await this.api.post('/api/newsletter-subscribe', {
        email,
        name,
        subscribeDate: new Date().toISOString(),
        source: 'website'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Contact form submission
  async submitContactForm(data) {
    try {
      const response = await this.api.post('/api/contact', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        submissionDate: new Date().toISOString(),
        status: 'new'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get available programs
  async getPrograms() {
    try {
      const response = await this.api.get('/api/programs');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Submit waitlist application
  async submitWaitlist(data) {
    try {
      const response = await this.api.post('/api/waitlist', {
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        childName: data.childName,
        childAge: data.childAge,
        preferredStartDate: data.preferredStartDate,
        preferredProgram: data.preferredProgram,
        priority: data.priority || 'normal',
        submissionDate: new Date().toISOString(),
        status: 'active'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: -1
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/api/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new DatabaseService();
