import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
  const [newParent, setNewParent] = useState({ name: '', email: '', password: '' });
  const [editTeacher, setEditTeacher] = useState(null);
  const [editParent, setEditParent] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchTeachers();
    fetchParents();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchParents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/parents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/teachers`, newTeacher, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTeacher({ name: '', email: '', password: '' });
      fetchTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/admin/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/teachers/${editTeacher.id}`, editTeacher, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/parents`, newParent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewParent({ name: '', email: '', password: '' });
      fetchParents();
    } catch (error) {
      console.error('Error adding parent:', error);
    }
  };

  const handleDeleteParent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/admin/parents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchParents();
    } catch (error) {
      console.error('Error deleting parent:', error);
    }
  };

  const handleUpdateParent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/parents/${editParent.id}`, editParent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditParent(null);
      fetchParents();
    } catch (error) {
      console.error('Error updating parent:', error);
    }
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="tabs mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
          } hover:bg-blue-700 transition duration-300`}
          onClick={() => setActiveTab('teachers')}
        >
          Manage Teachers
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'parents' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
          } hover:bg-blue-700 transition duration-300`}
          onClick={() => setActiveTab('parents')}
        >
          Manage Parents
        </button>
      </div>

      {activeTab === 'teachers' && (
        <div className="teachers-management bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Teachers</h2>

          {/* Add Teacher Form */}
          <form onSubmit={handleAddTeacher} className="mb-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-xl font-medium mb-3 text-gray-600">Add New Teacher</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Add Teacher
            </button>
          </form>

          {/* Teacher List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{teacher.id}</td>
                    <td className="py-3 px-6 text-left">
                      {editTeacher?.id === teacher.id ? (
                        <input
                          type="text"
                          value={editTeacher.name}
                          onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        teacher.name
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editTeacher?.id === teacher.id ? (
                        <input
                          type="email"
                          value={editTeacher.email}
                          onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        teacher.email
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {editTeacher?.id === teacher.id ? (
                        <div className="flex item-center justify-center">
                          <button
                            onClick={handleUpdateTeacher}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 transition duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditTeacher(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex item-center justify-center">
                          <button
                            onClick={() => setEditTeacher({ id: teacher.id, name: teacher.name, email: teacher.email, password: '' })}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'parents' && (
        <div className="parents-management bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Parents</h2>

          {/* Add Parent Form */}
          <form onSubmit={handleAddParent} className="mb-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-xl font-medium mb-3 text-gray-600">Add New Parent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newParent.name}
                onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newParent.email}
                onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newParent.password}
                onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Add Parent
            </button>
          </form>

          {/* Parent List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {parents.map((parent) => (
                  <tr key={parent.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{parent.id}</td>
                    <td className="py-3 px-6 text-left">
                      {editParent?.id === parent.id ? (
                        <input
                          type="text"
                          value={editParent.name}
                          onChange={(e) => setEditParent({ ...editParent, name: e.target.value })}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        parent.name
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editParent?.id === parent.id ? (
                        <input
                          type="email"
                          value={editParent.email}
                          onChange={(e) => setEditParent({ ...editParent, email: e.target.value })}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        parent.email
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {editParent?.id === parent.id ? (
                        <div className="flex item-center justify-center">
                          <button
                            onClick={handleUpdateParent}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 transition duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditParent(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex item-center justify-center">
                          <button
                            onClick={() => setEditParent({ id: parent.id, name: parent.name, email: parent.email, password: '' })}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteParent(parent.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;