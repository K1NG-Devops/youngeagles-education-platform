import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config/api';

const TeacherChildrenList = ({ onBack }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("You are not logged in. Please log in to view your children.");
        }

        const res = await axios.get(
          `${API_BASE_URL}/auth/children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched children response:", res.data);

        // Normalize data: ensure it's always an array
        if (Array.isArray(res.data.children)) {
          setChildren(res.data.children);
        } else if (res.data.children) {
          setChildren([res.data.children]); // wrap single object in array
        } else {
          setChildren([]); // fallback
        }

      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (loading) return <p>Loading children...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <h2 className="text-2xl font-bold mb-4">My Children</h2>

      {Array.isArray(children) && children.length > 0 ? (
        <ul className="space-y-2">
          {children.map((child) => (
            <li
              key={child.id}
              className="bg-blue-100 px-4 py-2 rounded-md text-blue-800 font-semibold"
            >
              {child.name} — Grade: {child.grade} — DOB:{" "}
              {new Date(child.dob).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No children found.</p>
      )}

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TeacherChildrenList;
