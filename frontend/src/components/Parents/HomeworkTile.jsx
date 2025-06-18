import React from "react";

const HomeworkTile = ({ title, dueDate, status, fileURL }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${status === "Completed"
              ? "bg-green-100 text-green-600"
              : status === "In Progress"
                ? "bg-blue-100 text-blue-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
        >
          {status || "Pending"}
        </span>
      </div>
      <div className="text-gray-600 text-sm mb-2">Due: {new Date(dueDate).toLocaleDateString()}</div>

      {fileURL && (
        <a
          href={fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline hover:text-blue-800"
        >
          📥 Download Homework
        </a>
      )}
    </div>
  );
};

export default HomeworkTile;
