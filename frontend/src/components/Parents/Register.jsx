import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../../auth/AuthFormLayout';
import { API_BASE_URL } from '../../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', workAddress: '', password: '', confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      return setErrors('Passwords do not match');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);

      localStorage.removeItem('accessToken');
      
      // login using the same credentials
      const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      // Store credentials consistently
      localStorage.setItem('accessToken', loginRes.data.token);
      localStorage.setItem('parent_id', loginRes.data.user.id);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      
      setMessage('Registration successful!');
      setFormData({
        name: '', email: '', phone: '', address: '', workAddress: '', password: '', confirmPassword: ''
      });
      setErrors('');
      
      // Navigate with replace to prevent back button issues
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error(err); // Helpful for debugging
      if (err.response?.data?.errors) {
        const allErrors = err.response.data.errors.map(e => e.msg).join(', ');
        setErrors(allErrors);
      } else {
        setErrors(err.response?.data?.message || 'Registration failed');
      }
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout imageUrl="https://i.pinimg.com/736x/9d/9f/18/9d9f18a89989da838bbc6f63bec8967b.jpg">
      <h2 className="text-2xl font-bold mb-4 text-center">Parent Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'name', label: 'Full Name' },
          { name: 'email', label: 'Email Address', type: 'email' },
          { name: 'phone', label: 'Phone Number' },
          { name: 'address', label: 'Home Address' },
          { name: 'workAddress', label: 'Work Address' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm mb-1">{label}</label>
            <input
              id={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              autoComplete={name === 'password' || name === 'confirmPassword' ? 'new-password' : name}
              className="w-full border px-3 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black focus:ring-2 focus:ring-blue-500"
              placeholder={name === "workAddress" ? "If applicable" : undefined}
            />
          </div>
        ))}

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          By registering, you agree to our <a href="/terms" className="text-blue-600">Terms</a> and <a href="/privacy" className="text-blue-600">Privacy</a>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white py-2 rounded hover:bg-blue-700`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {errors && <p className="text-red-600 text-center">{errors}</p>}

        <p className="text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>
        </p>
        <p className="text-center">
          <Link to="/home" className='text-white'>Back to Home</Link>
        </p>
      </form>
    </AuthFormLayout>
  );
};

export default Register;
