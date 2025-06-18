// components/Parents/StudentSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentSelector = ({ students }) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const student = students.find(s => s.id.toString() === selectedId);

    if (student) {
      localStorage.setItem('selectedStudent', JSON.stringify({
        className: student.className,
        grade: student.grade,
        name: student.name,
        studentId: student.id
      }));

      navigate('/homeworks');
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Select a student:</label>
      <select onChange={handleChange} className="p-2 border rounded w-full">
        <option value="">-- Choose --</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.name} (Grade {student.grade})
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;
