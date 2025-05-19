import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";

export default function PatientHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between shadow-lg font-outfit">
      {/* Left Section: Company Logo and Name */}
      <div className="flex items-center gap-3">
        <img className="w-12 h-12" src={logo} alt="logo" />
        <p className="text-[20px] font-medium text-[#5AC5C8]">
          <span className="text-[25px] font-extrabold text-[#04353D]">Med</span>
          Sync
        </p>
      </div>

      {/* Right Section: Profile and Book Appointment Button */}
      <div className="flex items-center gap-6">
        {/* Profile Section */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <AccountCircleIcon
            fontSize="large"
            className="text-gray-600 cursor-pointer hover:text-[#5AC5C8] transition transform scale-125"
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <p className="px-4 py-2 text-gray-700 hover:bg-[#5AC5C8] hover:text-white cursor-pointer transition">
                Account Info
              </p>
              <p className="px-4 py-2 text-gray-700 hover:bg-[#5AC5C8] hover:text-white cursor-pointer transition">
                Logout
              </p>
            </div>
          )}
        </div>

        {/* Book Appointment Button */}
        <button className="bg-[#5AC5C8] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#4DA5A8] transition duration-300 shadow-md">
        <NavLink to='/book'>Book Appointment</NavLink>
        </button>
      </div>
    </div>
  );
}
