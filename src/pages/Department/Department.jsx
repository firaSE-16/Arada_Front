import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Department = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  const handleDoctor = (department) => {
    try {
      navigate("/showDoctor", { state: { department } });
    } catch (error) {
      console.log("There seems to be a problem");
    }
  };

  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const response = await fetch("/Data/Department.json");
        const data = await response.json();
        if (!response.ok) {
          console.log("Something went wrong");
        }
        setDepartments(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeps();
  }, []);

  return (
    <div className="font-outfit min-h-screen bg-gray-100 py-12 px-6">
      {/* Title */}
      <h1 className="text-center text-4xl font-bold text-[#5AC5C8] mb-8 animate-fade-in">
        Our Medical Departments
      </h1>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {departments.map((dep, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in"
            onClick={() => handleDoctor(dep.name)}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                src={dep.image}
                alt={dep.name}
              />
            </div>

            {/* Text Content */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{dep.name}</h2>
              <h3 className="text-lg font-semibold text-[#5AC5C8] mt-2">
                {dep.specialization}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">{dep.description}</p>
              <p className="mt-2 text-gray-500 text-xs">{dep.history}</p>

              {/* Button */}
              <button className="mt-4 bg-[#5AC5C8] text-white px-5 py-2 rounded-lg transition-all duration-300 hover:bg-[#04838F]">
                View Doctors
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
