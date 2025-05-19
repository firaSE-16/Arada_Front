import React, { useState, useEffect } from "react";
import appointmentsIcon from "../../assets/icons/appointments.png";
import patientsIcon from "../../assets/icons/patients.png";
import axios from "axios";

export default function DoctorBody() {
  const [activeTab, setActiveTab] = useState("Appointments");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState({
    _id: "",
    fullName: "",
    email: "",
    profilePic: "",
    medicalHistory: [], // Initialize as an empty array
    prescriptions: [],
    labRequests: [],
  });
  const [newMedicalHistory, setNewMedicalHistory] = useState({ condition: "", treatment: "" });
  const [newPrescription, setNewPrescription] = useState({ doctorName: "", details: "" });
  const [newLabRequest, setNewLabRequest] = useState({ testType: "", details: "" });

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:7001/api/doctor/getAppointment", {
        withCredentials: true,
      });
      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient details including medical history, prescriptions, and lab results
  const fetchPatientData = async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:7001/api/doctor/getPatientData/${patientId}`, {
        withCredentials: true,
      });
      setPatientData(response.data.patient);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to fetch patient data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add medical history for the patient
  const addMedicalHistory = async () => {
    if (!newMedicalHistory.condition || !newMedicalHistory.treatment) return;
    try {
      const response = await axios.post(
        "http://localhost:7001/api/doctor/addMedicalHistory",
        {
          patientId: patientData._id,
          condition: newMedicalHistory.condition,
          treatment: newMedicalHistory.treatment,
        },
        { withCredentials: true }
      );      
      setPatientData((prevData) => ({
        ...prevData,
        medicalHistory: [...prevData.medicalHistory, {
          patientId: patientData._id,
          condition: newMedicalHistory.condition,
          treatment: newMedicalHistory.treatment,
        }],
      }));
      
      // Reset input fields after adding the medical history
      setNewMedicalHistory({ condition: "", treatment: "" });
    } catch (err) {
      console.error("Error adding medical history:", err);
      setError("Failed to add medical history.");
    }
  };

  // Add prescription for the patient
  const addPrescription = async () => {
    if (!newPrescription.doctorName || !newPrescription.details) return;
    try {
      const response = await axios.post(
        "http://localhost:7001/api/doctor/addPrescription",
        {
          patientId: patientData._id,
          doctorName: newPrescription.doctorName,
          details: newPrescription.details,
        },
        { withCredentials: true }
      );

      setPatientData((prevData) => ({
        ...prevData,
        prescriptions: [...prevData.prescriptions, {
          patientId: patientData._id,
          doctorName: newPrescription.doctorName,
          details: newPrescription.details,
        }],
      }));
      setNewPrescription({ doctorName: "", details: "" }); // Reset input after adding
    } catch (err) {
      console.error("Error adding prescription:", err);
      setError("Failed to add prescription.");
    }
  };

  const addLabRequest = async () => {
    if (!newLabRequest.testType) return;
    try {
      const response = await axios.post(
        "http://localhost:7001/api/doctor/addLabRequest",
        {
          patientId: patientData._id,
          testType: newLabRequest.testType,
          details: newLabRequest.details,
        },
        { withCredentials: true }
      );
  
      console.log("Lab request added:", response.data); // Add this line to log the response
  
      // Update the patient data with the new lab request
      setPatientData((prevData) => ({
        ...prevData,
        labRequests: [...prevData.labRequests, response.data.newLabRequest],
      }));
  
      // Reset the newLabRequest state
      setNewLabRequest({ testType: "", details: "" });
  
    } catch (err) {
      console.error("Error adding lab request:", err);
      setError("Failed to add lab request.");
    }
  };
  
  
  // Fetch appointments when the component loads or when the "Appointments" tab is active
  useEffect(() => {
    if (activeTab === "Appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  // Render appointments
  const renderAppointments = () => {
    if (loading) return <div>Loading appointments...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (appointments.length === 0) {
      return <div>No appointments found.</div>;
    }

    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            onClick={() => {
              fetchPatientData(appointment.patientId._id); // Fetch patient data on click
              setActiveTab("Patients"); // Switch to Patients tab
            }}
          >
            <div>
              <div className="font-semibold text-lg">
                Patient: {appointment.patientId?.fullName || "Unknown"}
              </div>
              <div>Date: {new Date(appointment.date).toLocaleDateString()}</div>
              <div>Time: {appointment.time}</div>
              <div>Status: {appointment.status}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render patient details, medical history, prescriptions, and lab results
  const renderPatientDetails = () => {
    if (loading) return <div>Loading patient data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!patientData) {
      return <div>No patient data found.</div>;
    }

    return (
      <div>
        <div className="flex items-center">
          <img
            src={patientData.profilePic || "default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div className="ml-4">
            <div className="text-xl font-semibold">{patientData.fullName}</div>
            <div>{patientData.email}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Medical History</h3>
          <ul>
            {patientData.medicalHistory?.map((history) => (
              <li key={history._id}>{history.condition} - {history.treatment}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newMedicalHistory.condition}
            onChange={(e) => setNewMedicalHistory({ ...newMedicalHistory, condition: e.target.value })}
            placeholder="Condition"
            className="w-full p-2 border mt-4"
          />
          <input
            type="text"
            value={newMedicalHistory.treatment}
            onChange={(e) => setNewMedicalHistory({ ...newMedicalHistory, treatment: e.target.value })}
            placeholder="Treatment"
            className="w-full p-2 border mt-4"
          />
          <button
            onClick={addMedicalHistory}
            className="bg-blue-500 text-white p-2 mt-2 rounded"
          >
            Add Medical History
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Prescriptions</h3>
          <ul>
            {patientData.prescriptions?.map((prescription) => (
              <li key={prescription._id}>{prescription.doctorName} - {prescription.details}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newPrescription.doctorName}
            onChange={(e) => setNewPrescription({ ...newPrescription, doctorName: e.target.value })}
            placeholder="Doctor Name"
            className="w-full p-2 border mt-4"
          />
          <input
            type="text"
            value={newPrescription.details}
            onChange={(e) => setNewPrescription({ ...newPrescription, details: e.target.value })}
            placeholder="Prescription Details"
            className="w-full p-2 border mt-4"
          />
          <button
            onClick={addPrescription}
            className="bg-green-500 text-white p-2 mt-2 rounded"
          >
            Add Prescription
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Lab Requests</h3>
          <ul>
            {patientData.labRequests.map((request) => (
              <li key={request._id}>
                {request.testType} - {request.details}
              </li>
            ))}
          </ul>
          <select
            value={newLabRequest.testType}
            onChange={(e) => setNewLabRequest({ ...newLabRequest, testType: e.target.value })}
            className="w-full p-2 border mt-4"
          >
            <option value="">Select Lab Test</option>
            <option value="Blood Test">Blood Test</option>
            <option value="X-Ray">X-Ray</option>
            <option value="MRI">MRI</option>
            <option value="Urine Test">Urine Test</option>
          </select>
          <textarea
            value={newLabRequest.details}
            onChange={(e) => setNewLabRequest({ ...newLabRequest, details: e.target.value })}
            placeholder="Details about the lab request"
            className="w-full p-2 border mt-4"
          />
          <button
            onClick={addLabRequest}
            className="bg-purple-500 text-white p-2 mt-2 rounded"
          >
            Add Lab Request
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Appointments":
        return renderAppointments();
      case "Patients":
        return renderPatientDetails();
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen outfit">
      {/* Sidebar */}
      <div className="bg-[#5AC5C8] w-64 flex flex-col p-4 text-white">
        <div className="flex flex-col gap-4">
          {[{ name: "Appointments", icon: appointmentsIcon }, { name: "Patients", icon: patientsIcon }].map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === item.name ? "bg-white text-[#5AC5C8] font-bold" : "hover:bg-[#4DA5A8]"}`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="text-2xl font-semibold mb-4">{activeTab}</div>
        {renderContent()}
      </div>
    </div>
  );
}
