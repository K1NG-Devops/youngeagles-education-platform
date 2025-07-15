import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

const getClassByAge = (age) => {
  if (age >= 1 && age <= 3) return 'Curious Cubs';
  if (age === 4 || age === 5 || age === 6) return 'Panda';
  return '';
};

const getGradeByAge = (age) => {
  if (age >= 1 && age <= 3) return 'Nursery';
  if (age === 4 || age === 5) return 'RR';
  if (age === 6) return 'R';
  return '';
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const RegisterChild = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: '',
    grade: '',
    className: '',
    parent_id: null,
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const storedParentId = localStorage.getItem('parent_id');
    const parsedParentId =
      storedParentId && !isNaN(parseInt(storedParentId, 10))
        ? parseInt(storedParentId, 10)
        : null;

    if (parsedParentId) {
      setFormData((prev) => ({ ...prev, parent_id: parsedParentId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dob') {
      const age = calculateAge(value);
      const className = getClassByAge(age);
      const grade = getGradeByAge(age);
      setFormData((prev) => ({
        ...prev,
        dob: value,
        age,
        className,
        grade,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    const parentId =
      formData.parent_id && Number.isInteger(formData.parent_id)
        ? formData.parent_id
        : null;

    if (!parentId) {
      setResponseMessage('Parent ID is missing or invalid. Please log in again.');
      setLoading(false);
      return;
    }

    if (
      !formData.name ||
      !formData.dob ||
      !formData.gender ||
      !formData.age ||
      !formData.grade ||
      !formData.className
    ) {
      setResponseMessage('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    const data = {
      name: formData.name,
      dob: formData.dob,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      grade: formData.grade,
      className: formData.className,
      parent_id: parentId,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register-child`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setResponseMessage('Child registered successfully!');
        setFormData({
          name: '',
          dob: '',
          age: '',
          gender: '',
          grade: '',
          className: '',
          parent_id: parentId,
        });
      } else {
        const errorData = await response.json();
        const errorText = errorData.errors
          ? errorData.errors.map((e) => e.msg).join(', ')
          : errorData.message || 'Registration failed. Please try again.';
        setResponseMessage(errorText);
      }
    } catch (error) {
      setResponseMessage('Error submitting form: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Register My Child
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                readOnly
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                readOnly
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Class Name</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                readOnly
                required
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Child'}
          </button>
          <Link
            to="/dashboard"
            className="block text-center mt-4 bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition"
          >
            Back
          </Link>
        </form>
        {responseMessage && (
          <div className="mt-4 p-4 text-center text-white bg-blue-500 rounded-md">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterChild;