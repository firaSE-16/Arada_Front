import React, { useState, useEffect, useRef } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/logo.png";

export default function DoctorHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState({ right: false, top: false });
  const profileRef = useRef(null);

  // Toggle visibility of profile card on click
  const handleProfileClick = () => {
    setIsOpen((prev) => !prev);  // Toggle state between true/false
  };

  // Check if the card is overflowing the viewport
  useEffect(() => {
    if (profileRef.current) {
      const profilePosition = profileRef.current.getBoundingClientRect();

      // Check if it's overflowing top and right
      const isOutOfViewportRight = profilePosition.right > window.innerWidth;
      setIsOverflowing({ right: isOutOfViewportRight, top: profilePosition.top < 0 });
    }
  }, [isOpen]);

  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-2">
        <img className="w-10 h-10" src={logo} alt="logo" />
        <p className="text-[20px] font-medium text-[#5AC5C8]">
          <span className="text-[25px] font-bold text-[#04353D]">Med</span>Sync
        </p>
      </div>

      {/* Right Section: Profile Icon with Clickable Profile Card */}
      <div
        className="relative flex items-center gap-4 cursor-pointer"
        onClick={handleProfileClick} // Use onClick to toggle visibility
        ref={profileRef}
      >
        <AccountCircleIcon
          fontSize="large"
          className="text-gray-600 hover:text-[#5AC5C8] transition transform scale-125"
        />

        {isOpen && (
          <div
            className={`absolute mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 ${
              isOverflowing.right ? "left-0" : "right-0"
            } ${isOverflowing.top ? "top-16" : "top-12"}`}
          >
            <div className="p-4">
              {/* Doctor's Information */}
              <div className="text-lg font-semibold text-[#04353D]">Dr. John Doe</div>
              <div className="text-sm text-gray-600">Experience: 10 years</div>
              <div className="text-sm text-gray-600">Specialization: Cardiology</div>

              {/* Feedback Section */}
              <div className="mt-2 text-sm text-gray-600">
                <strong>Feedback:</strong> "Highly recommend. Excellent care."
              </div>

              {/* Logout Button */}
              <button
                className="mt-4 w-full px-4 py-2 bg-[#5AC5C8] text-white rounded-lg hover:bg-[#4DA5A8] transition"
                onClick={() => {
                  // Handle logout logic here
                  alert("Logging out...");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
