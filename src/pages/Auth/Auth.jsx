import React from "react";
import AuthCard from "../../Component/AuthCard/AuthCard.jsx";
import backgroundImage from "../../assets/images/groupdoctors.jpeg"; // Import the background image

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF7F8]">
      <div className="flex w-full max-w-6xl rounded-lg shadow-lg overflow-hidden">
        {/* Left Side: Background Image */}
        <div
          className="flex-1 bg-cover bg-center hidden md:block"
          style={{
            backgroundImage: `url(${backgroundImage})`, // Use the imported image here
          }}
        ></div>

        {/* Right Side: Auth Card */}
        <div className="flex-1 bg-[#ffffff] flex justify-center items-center p-6 md:p-12">
          <AuthCard />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
