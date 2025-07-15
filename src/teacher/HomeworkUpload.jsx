import React, { useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const HomeworkUpload = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !dueDate || !file) {
      toast.error("Please fill in all fields.");
      return;
    }

    const fileId = uuidv4();
    const fileRef = ref(storage, `homeworks/${fileId}-${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const homeworkData = {
        id: fileId,
        title,
        dueDate,
        fileURL,
        uploadedAt: new Date().toISOString(),
      };

      // Save metadata to Firestore (next step)
      await fetch("/api/homeworks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeworkData),
      });

      toast.success("Homework uploaded successfully!");
      setTitle("");
      setDueDate("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload homework.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Homework</h2>
      <input
        type="text"
        placeholder="Homework Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-2 mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
};

export default HomeworkUpload;
