import React from "react";
import { useNavigate } from "react-router-dom";
const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="contact-page p-5 bg-gray-100 font-sans">
      {/* Header */}
      <header className="contact-header text-center mb-10">
        <h1 className="text-4xl font-bold text-myblack border-b-2 border-mywhite pb-2 inline-block">
          Contact Us
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-7 mx-7">
        {/* Left Section: Image */}
        <div className="flex-1">
          <img
            className="w-full rounded-xl shadow-md"
            src="/hospital.jpg" // Replace with the hospital image URL
            alt="Arada Hospital"
          />
        </div>

        {/* Right Section: Information */}
        <div className="contact-info flex-1 p-5 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Our Hospital
          </h2>
          <p className="text-gray-600">Arada Referral Hospital</p>
          <p className="text-gray-600">Addis Ababa, Ethiopia</p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +251 11 123 4567
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> info@aradahospital.et
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
            Services at Arada Hospital
          </h2>
          <p className="text-gray-600">
            Learn more about our teams and job openings.
          </p>
          <button
            className="mt-4 px-6 py-2 bg-mygreen text-white rounded-lg hover:bg-blue-600 transition"
            onClick={(e) => navigate("/department")}
          >
            Find Our Doctors
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="contact-map mt-10 mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Find Us Here
        </h2>
        <iframe
          title="Arada Hospital Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127867.90786500628!2d38.69513608425786!3d9.005401669175191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85c503b8e177%3A0x6c6a61b72dd4d36!2sMenelik%20II%20Referral%20Hospital!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
          className="w-full h-96 border border-gray-300 rounded-lg shadow-md"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
