import React, { useState } from "react";
import axios from "axios";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../config/api';

const PopUploadForm = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        studentName: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
        bankName: "",

    });

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/dashboard");
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            return setMessage("Please upload a file.");
        }

        try {
            setLoading(true);

            const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
            await uploadBytes(fileRef, file);
            const fileUrl = await getDownloadURL(fileRef);

            const response = await axios.post(
                `${API_BASE_URL}/public/pop-submission`,
                {
                    ...formData,
                    popFilePath: fileUrl,
                }
            );

            setMessage(response.data.message || "POP submitted successfully!");
            setFormData({
                fullname: "",
                email: "",
                phone: "",
                studentName: "",
                amount: "",
                paymentDate: "",
                paymentMethod: "",
                bankName: "",
            });
            setFile(null);
        } catch (error) {
    console.error("Upload error details:", error.response || error.message || error);
    setMessage(
        error.response?.data?.message || "Error uploading POP. Please try again."
    );
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "mt-2 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500";

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-white shadow-md rounded">
            <h2 className="text-lg font-bold mb-4">Upload Payment Proof</h2>
            <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required className={inputClass} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className={inputClass} />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required className={inputClass} />
            <input type="text" name="studentName" placeholder="Student Name (optional)" onChange={handleChange} className={inputClass} />
            <input type="number" name="amount" placeholder="Amount Paid" onChange={handleChange} required className={inputClass} />
            <input type="date" name="paymentDate" onChange={handleChange} required className={inputClass} />
            <select name="paymentMethod" onChange={handleChange} required className={inputClass}>
                <option value="">Select Payment Method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
            </select>
            <input type="text" name="bankName" placeholder="Bank Name (optional)" onChange={handleChange} className={inputClass} />
            <input type="file" name="file" onChange={handleFileChange} required className={inputClass} />
            <button
                className="bg-pink-600 p-2 rounded-lg w-full cursor-pointer text-white text-lg hover:bg-blue-500 flex items-center justify-center"
                type="submit"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting...
                    </>
                ) : (
                    "Submit POP"
                )}
            </button>
            <button
                className="bg-gray-600 mt-2 p-2 rounded-lg w-full cursor-pointer text-white text-lg hover:bg-blue-500 flex items-center justify-center"
                onClick={handleBack}
                type="button"
            >
                Back to Dashboard
            </button>
            {message && <p className="text-red-500 text-lg mt-2">{message}</p>}
        </form>
    );
};

export default PopUploadForm;
