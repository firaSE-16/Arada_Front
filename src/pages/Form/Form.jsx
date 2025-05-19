import React, { useState } from "react";
import axios from "../../service/api"; // Ensure axios is set up correctly
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [formData, setFormData] = useState({
    age: "",
    nationality: "",
    city: "",
    fatherName: "",
    motherName: "",
    emergencyContact: { name: "", relationship: "", phone: "" }, // Nested object
    bloodType: "",
    profilePic: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); // For navigation

  const questions = [
    { label: "Age", name: "age", type: "number", placeholder: "Enter your age" },
    { label: "Nationality", name: "nationality", type: "text", placeholder: "Enter your nationality" },
    { label: "City", name: "city", type: "text", placeholder: "Enter your city" },
    { label: "Father's Name", name: "fatherName", type: "text", placeholder: "Enter your father's name" },
    { label: "Mother's Name", name: "motherName", type: "text", placeholder: "Enter your mother's name" },
    { label: "Emergency Contact Name", name: "emergencyContact.name", type: "text", placeholder: "Enter emergency contact name" },
    { label: "Emergency Contact Relationship", name: "emergencyContact.relationship", type: "text", placeholder: "Enter relationship" },
    { label: "Emergency Contact Phone", name: "emergencyContact.phone", type: "text", placeholder: "Enter phone number" },
    { label: "Blood Type", name: "bloodType", type: "text", placeholder: "Enter your blood type" },
    { label: "Profile Picture", name: "profilePic", type: "file", placeholder: "Upload your profile picture" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("emergencyContact")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("profilePic", formData.profilePic);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("nationality", formData.nationality);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("fatherName", formData.fatherName);
    formDataToSend.append("motherName", formData.motherName);
    formDataToSend.append("emergencyContact.name", formData.emergencyContact.name);
    formDataToSend.append("emergencyContact.relationship", formData.emergencyContact.relationship);
    formDataToSend.append("emergencyContact.phone", formData.emergencyContact.phone);
    formDataToSend.append("bloodType", formData.bloodType);

    try {
      const response = await axios.put("http://localhost:7001/api/user/updateProfile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      navigate("/auth");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#04353D] mb-6">
          Update Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              {questions[currentStep].label}
            </label>

            {questions[currentStep].type === "file" ? (
              <input
                type="file"
                name={questions[currentStep].name}
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700"
                required
              />
            ) : (
              <input
                type={questions[currentStep].type}
                name={questions[currentStep].name}
                placeholder={questions[currentStep].placeholder}
                value={
                  questions[currentStep].name.startsWith("emergencyContact")
                    ? formData.emergencyContact[questions[currentStep].name.split(".")[1]]
                    : formData[questions[currentStep].name]
                }
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
                required
              />
            )}
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="py-2 px-4 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition duration-200"
              disabled={currentStep === 0}
            >
              Previous
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-4 bg-[#5AC5C8] text-white rounded-lg shadow-md hover:bg-[#4DA5A8] transition duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="py-2 px-4 bg-[#5AC5C8] text-white rounded-lg shadow-md hover:bg-[#4DA5A8] transition duration-200"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
