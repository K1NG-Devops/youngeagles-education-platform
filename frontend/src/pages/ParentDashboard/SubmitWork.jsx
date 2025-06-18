import React, { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from '../../config/api';

const SubmitWork = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);
    const [homeworkList, setHomeworkList] = useState([]);
    const [selectedHomework, setSelectedHomework] = useState("");
    const [loading, setLoading] = useState(true);

    const parent_id = localStorage.getItem('parent_id');
    const token = localStorage.getItem('accessToken');
    
    // Debug logging
    console.log('SubmitWork Component - Debug Info:');
    console.log('parent_id:', parent_id);
    console.log('token exists:', !!token);
    console.log('token length:', token ? token.length : 'N/A');

    // Fetch available homework on component mount
    useEffect(() => {
        const fetchHomework = async () => {
            try {
                console.log('Fetching homework for parent_id:', parent_id);
                const res = await axios.get(
                    `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Homework API response:', res.data);
                console.log('Response status:', res.status);
                
                const hwList = Array.isArray(res.data) ? res.data : res.data.homeworks || [];
                console.log('Processed homework list:', hwList);
                
                const unsubmittedHw = hwList.filter(hw => !hw.submitted);
                console.log('Unsubmitted homework:', unsubmittedHw);
                
                setHomeworkList(unsubmittedHw); // Only show unsubmitted homework
            } catch (err) {
                toast.error('Failed to load homework.');
                console.error('Error loading homework:', err);
            } finally {
                setLoading(false);
            }
        };
        if (parent_id && token) {
            fetchHomework();
        }
    }, [parent_id, token]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        console.log('Starting submission process...');
        console.log('Selected homework:', selectedHomework);
        console.log('File selected:', file);
        console.log('Comment:', comment);
        
        if (!file || !selectedHomework) {
            toast.error('Please select homework and upload a file.');
            console.error('Missing file or homework selection');
            return;
        }

        setUploading(true);
        console.log('Starting Firebase upload...');
        const storageRef = ref(storage, `submissions/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                toast(
                    <div>
                      <strong>Upload Failed:</strong>
                      <div>{error.message}</div>
                    </div>
                  );
                setUploading(false);
            },
            async () => {
                try {
                    console.log('Firebase upload completed successfully');
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('Download URL obtained:', downloadURL);

                    console.log('Submitting to backend with data:');
                    console.log('- homeworkId:', selectedHomework);
                    console.log('- fileURL:', downloadURL);
                    console.log('- comment:', comment);
                    console.log('- token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');

                    // Submit to backend
                    const response = await axios.post(
                        `${API_BASE_URL}/homeworks/submit`,
                        {
                            homeworkId: selectedHomework,
                            fileURL: downloadURL,
                            comment,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    
                    console.log('Backend submission response:', response.data);
                    console.log('Response status:', response.status);

                    toast.success('Homework submitted successfully!');
                    setFile(null);
                    setSelectedHomework("");
                    setComment("");
                    setUploading(false);

                    // Remove submitted homework from list
                    setHomeworkList(prev => prev.filter(hw => hw.id !== parseInt(selectedHomework)));
                } catch (err) {
                    console.error('Backend submission error:', err);
                    console.error('Error response:', err.response?.data);
                    console.error('Error status:', err.response?.status);
                    console.error('Error headers:', err.response?.headers);
                    
                    toast.error(`Submission failed: ${err.response?.data?.message || err.message}`);
                    setUploading(false);
                }
            }
        );
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold">Submit Your Child's Work</h2>

            {loading ? (
                <p>Loading homework...</p>
            ) : (
                <div>
                    <Label htmlFor="homework">Select Homework</Label>
                    <Select value={selectedHomework} onValueChange={setSelectedHomework}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select homework to submit" />
                        </SelectTrigger>
                        <SelectContent>
                            {homeworkList.map((hw) => (
                                <SelectItem key={hw.id} value={hw.id.toString()}>
                                    {hw.title} - Due: {new Date(hw.due_date || hw.dueDate).toLocaleDateString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {homeworkList.length === 0 && (
                        <p className="text-gray-500 mt-2">No pending homework available for submission.</p>
                    )}
                </div>
            )}

            <div>
                <Label htmlFor="comment">Comments (optional)</Label>
                <Textarea
                    placeholder="Add any notes for the teacher..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    onChange={handleFileChange}
                />
            </div>

            <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Submit Work"}
            </Button>
        </div>
    );
};

export default SubmitWork;
