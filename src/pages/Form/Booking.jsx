import React, { useState } from "react";
import axios from "../../service/api"; // Import your centralized Axios instance
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { appointmentDate, appointmentTime } = formData;

    if (!appointmentDate || !appointmentTime) {
      setError("Please select both a date and a time slot.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:7001/api/user/book-appointment",
        formData,
        { withCredentials: true } // Ensures cookies are sent for authentication
      );

      setMessage(response.data.message);
      setFormData({ appointmentDate: "", appointmentTime: "" });

      // Redirect to patient page after 3 seconds
      setTimeout(() => {
        navigate("/patient");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <h2 className="text-4xl font-bold text-[#04353D] mb-6 text-center">
        Book Your Appointment
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 text-center">
          {message}
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appointment Date */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            required
          />
        </div>

        {/* Appointment Time */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Appointment Time
          </label>
          <select
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            required
          >
            <option value="">-- Select Time Slot --</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#5AC5C8] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#4DA5A8] transition duration-200"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
