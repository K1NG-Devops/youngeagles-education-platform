import React, { useEffect, useState } from "react";

const TeacherChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/children", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch children");
        }

        const data = await res.json();
        setChildren(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (loading) return <p>Loading children...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Children</h2>
      <ul>
        {children.length === 0 && <p>No children found.</p>}
        {children.map((child) => (
          <li key={child.id}>
            {child.name} — Grade: {child.grade} — DOB: {child.dob}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherChildrenList;
