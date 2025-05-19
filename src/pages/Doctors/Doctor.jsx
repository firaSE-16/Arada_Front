import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Doctor = () => {
  const location = useLocation();
  const department = location.state?.department || "Unknown";
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/Data/Doctors.json");
        if (!response.ok) {
          console.error("Error fetching data");
          return;
        }
        const data = await response.json();
        const filteredDoctors = data[department] || [];
        setDoctors(filteredDoctors);
      } catch (error) {
        console.error("Something went wrong, please try again");
      }
    };
    fetchDoctors();
  }, [department]);

  const generateStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="font-outfit min-h-screen bg-gray-100 py-12 px-6">
      {/* Title */}
      <h1 className="text-center text-4xl font-bold text-[#5AC5C8] mb-8 animate-fade-in">
        {department} Specialists
      </h1>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {doctors.map((doc, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                src={doc.profile_image}
                alt={doc.name}
              />
              <span className="absolute top-4 left-4 bg-[#5AC5C8] text-white px-3 py-1 rounded-md text-sm font-bold">
                {doc.years_of_experience} Years Exp
              </span>
            </div>

            {/* Text Content */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{doc.name}</h2>
              <h3 className="text-lg font-semibold text-[#5AC5C8] mt-2">
                {doc.specialization}
              </h3>

              {/* Rating */}
              <div className="flex justify-center mt-2">
                <h1 className="font-bold pr-2">{doc.rating}</h1>
                {generateStars(doc.rating)}
              </div>

              <p className="mt-3 text-gray-600 text-sm">
                Dr. {doc.name} specializes in {doc.specialization} with{" "}
                {doc.years_of_experience} years of experience. Contact:{" "}
                <span className="font-bold">{doc.contact}</span>.
              </p>

              {/* Button */}
              <button className="mt-4 bg-[#5AC5C8] text-white px-5 py-2 rounded-lg transition-all duration-300 hover:bg-[#04838F]">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctor;
