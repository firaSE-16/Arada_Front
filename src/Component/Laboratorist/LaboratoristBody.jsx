import React, { useState, useEffect } from "react";
import appointmentsIcon from "../../assets/icons/appointments.png";
import patientsIcon from "../../assets/icons/patients.png";
import axios from "axios"; // Assuming axios is used for API calls

export default function LaboratoristBody() {
  const [activeTab, setActiveTab] = useState("Patients");
  const [patients, setPatients] = useState([]); // Initialize as an empty array to avoid undefined error
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch all patients when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:7001/api/laboratorist/patients-with-lab-requests", {
          withCredentials: true, // Include credentials (cookies) in the request
        });
        setPatients(response.data.patients); // Assuming the response contains a 'patients' field
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePatientClick = (patientId) => {
    // Find the selected patient details and set it
    const patient = patients.find((patient) => patient._id === patientId);
    setSelectedPatient(patient);
    setActiveTab("Patient Detail"); // Navigate to patient detail view
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { results, status, notes } = e.target.elements;

    try {
      const response = await axios.put(`http://localhost:7001/api/laboratorist/${selectedPatient._id}/results`, {
        labRequestId: selectedPatient._id,
        results: results.value,
        status: status.value,
        notes: notes.value,
      }, {
        withCredentials: true, // Include credentials (cookies) in the request
      });

      alert("Form submitted successfully.");
      // Optionally, you can handle the updated patient data after submission
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };

  const renderContent = () => {
    if (!patients || patients.length === 0) {
      return <div>No patients available.</div>; // Show message if there are no patients or if data is still being fetched
    }

    switch (activeTab) {
      case "Patients":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Patients</h2>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="p-4 border-b cursor-pointer rounded-lg hover:bg-gray-100 transition-all"
                  onClick={() => handlePatientClick(patient._id)}
                >
                  <p className="font-semibold text-lg">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Patient Detail":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Patient Detail</h2>
            {selectedPatient && (
              <div>
                <p className="text-lg font-semibold">Patient Name: {selectedPatient.fullName}</p>
                <p className="text-sm text-gray-500">Email: {selectedPatient.email}</p>

                {/* Render the form to fill lab results here */}
                <form onSubmit={handleSubmitForm} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Results</label>
                    <input
                      type="text"
                      name="results"
                      placeholder="Enter results"
                      required
                      className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      defaultValue="Pending"
                      required
                      className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In-progress">In-progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      name="notes"
                      placeholder="Enter notes"
                      required
                      className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 py-3 px-4 bg-[#5AC5C8] text-white font-semibold rounded-lg hover:bg-[#4DA5A8] transition-all"
                  >
                    Save Results
                  </button>
                </form>
              </div>
            )}
          </div>
        );
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen outfit">
      {/* Sidebar */}
      <div className="bg-[#5AC5C8] w-64 flex flex-col p-4 text-white">
        <h1 className="text-xl font-bold mb-6">Laboratorist Dashboard</h1>
        <div className="flex flex-col gap-4">
          {[ 
            { name: "Patients", icon: patientsIcon },
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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="text-2xl font-semibold mb-4">{activeTab}</div>
        {renderContent()}
      </div>
    </div>
  );
}
