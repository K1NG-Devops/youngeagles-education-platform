import React, { useState, useEffect } from "react";
import axios from "axios";
import { decodeToken } from "../utils/decodeToken";
import { API_BASE_URL } from '../config/api';

const TeacherAttendance = ({ onBack }) => {
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in");
      return;
    }
  
    const decoded = decodeToken(token);
    if (!decoded?.id) {
      console.warn("No teacher ID found in token");
      return;
    }
  
    setTeacherId(decoded.id);
  
    // ✅ Fetch children using the authenticated route
    axios.get(`${API_BASE_URL}/children`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache",
      }
    })
    .then((res) => {
      console.log("API response:", res.data);
    
      const fetchedChildren = res.data.children || res.data;
      console.log("Fetched children:", fetchedChildren);
    
      if (!Array.isArray(fetchedChildren)) {
        throw new Error("Children list not returned properly.");
      }
    
      setChildren(fetchedChildren);
    
      const initialAttendance = {};
      fetchedChildren.forEach((child) => {
        initialAttendance[child.id] = { status: "none", late: false };
      });
      setAttendance(initialAttendance);
    })
    
      
      .catch((err) => {
        console.error("Error fetching children:", err.response?.data || err.message);
        alert("Could not load children list.");
      })
      .finally(() => setLoading(false));
  }, []);
  

  const markAttendance = (childId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!teacherId) {
      alert("Teacher ID missing.");
      return;
    }

    const records = [];
    for (const child of children) {
      const record = attendance[child.id];
      if (record?.status && record.status !== "none") {
        records.push({
          teacherId,
          childId: child.id,
          date,
          status: record.status.toLowerCase(),
          late: !!record.late,
        });
      }
    }

    if (records.length === 0) {
      alert("Please mark attendance for at least one child.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/attendance/mark-attendance`,
        records,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Attendance submitted successfully.");
    } catch (error) {
      console.error("Error submitting attendance:", error.response?.data || error.message);
      alert("Failed to submit attendance. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-purple-700 dark:text-white">Loading children...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700 dark:text-white">
        Today's Attendance
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          min="2023-01-01"
          max={new Date().toISOString().split("T")[0]}
          data-testid="attendance-date-input"
          data-cy="attendance-date-input"
          aria-label="Attendance Date"
          aria-required="true"
          aria-describedby="attendance-date-description"
          id="attendance-date-input"
        />
      </div>

      {children.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No children found for this teacher.</p>
      ) : (
        children.map((child) => (
          <div
            key={child.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200 mb-2 sm:mb-0">
              {child.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {["Present", "Absent", "Late"].map((status) => (
                <button
                  key={status}
                  onClick={() => markAttendance(child.id, status)}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    attendance[child.id]?.status === status
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`px-4 py-2 text-white rounded ${
            isSubmitting ? "bg-gray-500" : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendance;
