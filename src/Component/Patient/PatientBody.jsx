import React, { useState, useEffect } from "react";
import axios from "axios";
import bookingIcon from "../../assets/icons/booking.png";
import appointmentsIcon from "../../assets/icons/appointments.png";
import doctorsIcon from "../../assets/icons/doctors.png";
import prescriptionIcon from "../../assets/icons/prescription.png";
import historyIcon from "../../assets/icons/history.png";
import billingIcon from "../../assets/icons/billing.png";
import { useNavigate } from "react-router-dom";

export default function PatientBody() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Booked Appointments");
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    amount: "",
  });

 
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Payment Successful! Thank you for your payment.");
      setFormData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolderName: "",
        amount: "",
      });
    }, 2000); // Simulate a 2-second delay for processing
  };

  // Fetch profile data (prescriptions and medical history)
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/user/profile", {
        withCredentials: true,
      });
      setPrescriptions(response.data.prescriptions || []);
      setMedicalHistory(response.data.medicalHistory || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch booked appointments
  const fetchBookedAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/user/booked-appointment", {
        withCredentials: true,
      });
      setBookedAppointments(response.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching booked appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/user/appointment", {
        withCredentials: true,
      });
      setAppointments(response.data.appointment || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (activeTab === "Booked Appointments") {
      fetchBookedAppointments();
    } else if (activeTab === "Appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    switch (activeTab) {
      case "Booked Appointments":
        return bookedAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white shadow-lg rounded-2xl p-6 relative overflow-hidden border border-gray-200"
              >
                <div className="absolute top-0 left-0 w-full bg-[#5AC5C8] text-white py-3 px-4 flex justify-between items-center rounded-t-2xl">
                  <h3 className="text-lg font-bold">Appointment Ticket</h3>
                  <span className="text-sm bg-white text-[#5AC5C8] px-2 py-1 rounded-full">
                    {appointment.status}
                  </span>
                </div>
                <div className="mt-12">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Date: {new Date(appointment.appointmentDate).toDateString()}
                  </h4>
                  <p className="text-gray-600 text-lg">
                    Time: <span className="font-semibold">{appointment.appointmentTime}</span>
                  </p>
                  <p className="text-gray-600 text-lg">
                    Appointment ID:{" "}
                    <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {appointment._id}
                    </span>
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">
                    This ticket is valid only for the selected date and time.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No booked appointments found.</div>
        );

      case "Appointments":
        return appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white shadow-lg rounded-2xl p-6 relative overflow-hidden border border-gray-200"
              >
                <div className="absolute top-0 left-0 w-full bg-[#5AC5C8] text-white py-3 px-4 flex justify-between items-center rounded-t-2xl">
                  <h3 className="text-lg font-bold">Doctor Appointment</h3>
                  <span className="text-sm bg-white text-[#5AC5C8] px-2 py-1 rounded-full">
                    {appointment.status}
                  </span>
                </div>
                <div className="mt-12">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Date: {new Date(appointment.date).toDateString()}
                  </h4>
                  <p className="text-gray-600 text-lg">
                    Time: <span className="font-semibold">{appointment.time}</span>
                  </p>
                  <p className="text-gray-600 text-lg">
                    Doctor: <span className="font-semibold">{appointment.doctorId.name}</span>
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">
                    For changes or cancellations, contact support.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No appointments found.</div>
        );

      case "Prescription":
        return prescriptions.length > 0 ? (
          <div>
            {prescriptions.map((prescription, index) => (
              <div key={index} className="mb-4 p-4 bg-white shadow rounded">
                <h4 className="font-bold">Prescribed by: {prescription.doctorName}</h4>
                <p>{prescription.details}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(prescription.date).toDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>No prescriptions found.</div>
        );

      case "Medical History":
        return medicalHistory.length > 0 ? (
          <div>
            {medicalHistory.map((history, index) => (
              <div key={index} className="mb-4 p-4 bg-white shadow rounded">
                <h4 className="font-bold">Condition: {history.condition}</h4>
                <p>Treatment: {history.treatment}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(history.date).toDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>No medical history found.</div>
        );

      case "Doctors":
        return navigate("/chat");
      case "Billing":
        return(
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Payment Gateway
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="16"
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* CVV */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">CVV</label>
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="3"
              placeholder="123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 text-green-600 font-bold text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
        )

      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen outfit">
      <div className="bg-[#5AC5C8] w-64 flex flex-col p-4 text-white pt-16">
        <div className="flex flex-col gap-4">
          {[
            { name: "Booked Appointments", icon: bookingIcon },
            { name: "Appointments", icon: appointmentsIcon },
            { name: "Doctors", icon: doctorsIcon },
            { name: "Prescription", icon: prescriptionIcon },
            { name: "Medical History", icon: historyIcon },
            { name: "Billing", icon: billingIcon },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                activeTab === item.name
                  ? "bg-white text-[#5AC5C8] font-bold"
                  : "hover:bg-[#4DA5A8]"
              }`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="text-2xl font-semibold mb-4">{activeTab}</div>
        {renderContent()}
      </div>
    </div>
  );
}
