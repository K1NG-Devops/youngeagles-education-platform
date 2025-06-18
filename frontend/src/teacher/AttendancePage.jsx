import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendancePage = () => {
    
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [groupBy, setGroupBy] = useState("");
    const [includeMissing, setIncludeMissing] = useState(false);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [teacherId, setTeacherId] = useState(localStorage.getItem("teacherId"));
    
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
    });
    
    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`https://youngeagles-api-server.up.railway.app/api/attendance/${teacherId}`, {
                params: {
                    search,
                    start,
                    end,
                    status,
                    includeMissing,
                    groupBy,
                    page,
                },
            });
    
            console.log("Fetched attendance response:", res.data);
    
            // Extract only the attendance records
            const records = res.data.data;
            const pagination = res.data.pagination;
    
            setRecords(records);
            setHasMore(pagination?.has_next || false);
    
            setStats({
                present: records.filter(r => r.status === "present").length,
                absent: records.filter(r => r.status === "absent").length,
                late: records.filter(r => r.status === "late").length,
            });
        } catch (err) {
            console.error("Error fetching attendance:", err);
        }
    };
    
    

    useEffect(() => {
        if (teacherId) {
            fetchAttendance();
        }
    }, [page, teacherId, search, start, end, status, includeMissing, groupBy]);

    const handleExport = async () => {
        try {
            const res = await axios.get(
                `https://youngeagles-api-server.up.railway.app/api/attendance/${teacherId}`,
                {
                    params: {
                        search,
                        start,
                        end,
                        status,
                        includeMissing,
                        groupBy,
                        format: "csv",
                    },
                    responseType: "blob",
                }
            );
            const blob = new Blob([res.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `attendance_teacher_${teacherId}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-xl font-bold mb-4">View Attendance</h1>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search child name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={start}
                    placeholder="Start Date"
                    onChange={(e) => setStart(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={end}
                    placeholder="End Date"
                    onChange={(e) => setEnd(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                </select>
                <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">No Grouping</option>
                    <option value="child">Group by Child</option>
                    <option value="date">Group by Date</option>
                </select>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={includeMissing}
                        onChange={(e) => setIncludeMissing(e.target.checked)}
                    />
                    Include Missing
                </label>
                <button
                    onClick={() => setPage(1)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleExport}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Export CSV
                </button>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
                {Array.isArray(records) && records.length > 0 ? (
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">Child Name</th>
                                <th className="border px-2 py-1">Date</th>
                                <th className="border px-2 py-1">Status</th>
                                <th className="border px-2 py-1">Late</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.flatMap((record) =>
                                record.records ? (
                                    record.records.map((r, idx) => (
                                        <tr key={`${record.child_id}_${idx}`}>
                                            <td className="border px-2 py-1">{record.child_name}</td>
                                            <td className="border px-2 py-1">{r.date || "N/A"}</td>
                                            <td className="border px-2 py-1">{r.status}</td>
                                            <td className="border px-2 py-1">
                                                {r.late ? "Yes" : "No"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={record.id}>
                                        <td className="border px-2 py-1">{record.child_name}</td>
                                        <td className="border px-2 py-1">{record.date || "N/A"}</td>
                                        <td className="border px-2 py-1">{record.status}</td>
                                        <td className="border px-2 py-1">
                                            {record.late ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center mt-4">No records found.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>Page {page}</span>
                <button
                    disabled={!hasMore}
                    onClick={() => setPage(page + 1)}
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AttendancePage;
