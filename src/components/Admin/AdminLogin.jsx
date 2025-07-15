import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { adminLogin } from "../../auth/auth.js";
import useAuth from "../../hooks/useAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, isAdmin, isAuthenticated } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

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
      const result = await adminLogin(email, password);
      console.log('Admin login result:', result);
    
      if (result.success) {
        // Update auth context with admin data
        const authData = {
          token: result.token,
          user: result.user,
          role: 'admin'
        };
        
        console.log('Setting auth data:', authData);
        login(authData);
        
        setSuccess("Login successful!");
        
        // Show success message based on environment
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.success("Login successful!");
        } else {
          toast.success("Login successful!");
        }
        
        // Navigate with replace to prevent back button issues
        setTimeout(() => {
          console.log('Navigating to admin dashboard');
          navigate("/admin-dashboard", { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 text-gray-800 dark:text-white flex items-center justify-center px-4 safe-area-inset">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute right-3 top-[50%] transform -translate-y-[50%] text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="mt-6 w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition cursor-pointer"
          >
            Back to Parent Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          If you don't have an account, please contact the system administrator to create one.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

