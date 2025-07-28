import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { teacherLogin } from "../auth/auth.jsx";
import useAuth from "../hooks/useAuth";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, isTeacher, isAuthenticated } = useAuth();

  // Redirect if already logged in as teacher
  useEffect(() => {
    if (isAuthenticated && isTeacher) {
      navigate('/teacher-dashboard', { replace: true });
    }
  }, [isAuthenticated, isTeacher, navigate]);

  // Handles input changes for email and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // Toggles password visibility
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
  
    try {
      const result = await teacherLogin(email, password);
      console.log('Teacher login result:', result);
    
      if (result.success) {
        // Update auth context with teacher data
        const authData = {
          token: result.token,
          user: result.user,
          role: 'teacher'
        };
        
        console.log('Setting auth data:', authData);
        login(authData);
        
        // Save teacher role to localStorage
        localStorage.setItem('role', authData.role);

        setSuccess("Login successful!");
        
        // Show success message based on environment
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.success("Login successful!");
        } else {
          toast.success("Login successful!");
        }
        
        // Navigate with replace to prevent back button issues
        setTimeout(() => {
          console.log('Navigating to teacher dashboard');
          navigate("/teacher-dashboard", { replace: true });
        }, 500); // Increased timeout to ensure auth state is updated
      } else {
        const errorMessage = result.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Login failed. Please check your internet connection and try again.';
      setError(errorMessage);
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Teacher Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
