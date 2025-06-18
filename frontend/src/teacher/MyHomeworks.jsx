import React, { useEffect, useState } from "react";
import axios from "axios";

const MyHomeworks = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                const res = await axios.get(
                    `https://youngeagles-api-server.up.railway.app/api/homeworks/for-teacher/${teacherId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setHomeworks(res.data.homeworks || []);
            } catch (error) {
                console.error("Failed to fetch homeworks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeworks();
    }, [teacherId]);

    if (loading) {
        return <div className="text-center mt-20">Loading your homeworks...</div>;
    }
    console.log('fetched homeworks:', homeworks);
    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">📚 My Uploaded Homeworks</h2>

            {homeworks.length === 0 ? (
                <p className="text-center text-gray-500">No homework uploaded yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Title</th>
                                <th className="py-2 px-4 border-b">Due Date</th>
                                <th className="py-2 px-4 border-b">Grade</th>
                                <th className="py-2 px-4 border-b">Class</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {homeworks.map((hw) => (
                                <tr key={hw.id}>
                                    <td className="py-2 px-4 border-b">{hw.title}</td>
                                    <td className="py-2 px-4 border-b">{hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'No due date'}</td>
                                    <td className="py-2 px-4 border-b">{hw.grade}</td>
                                    <td className="py-2 px-4 border-b">{hw.class_name || hw.className}</td>
                                    <td className="py-2 px-4 border-b capitalize">{hw.status}</td>
                                    <td className="py-2 px-4 border-b">{hw.type || '-'}</td>
                                    <td className="py-2 px-4 border-b">
                                        {(hw.file_url || hw.fileUrl) ? (
                                            <a href={hw.file_url || hw.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                View File
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">No file</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyHomeworks;
