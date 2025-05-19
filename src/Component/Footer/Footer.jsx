import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="font-outfit bg-[#04353D] text-white py-12 px-6 w-full">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img className="w-12 h-12" src={logo} alt="logo" />
            <p className="text-[22px] font-bold">
              <span className="text-[#5AC5C8]">Med</span>Sync
            </p>
          </div>
          <p className="text-sm text-gray-300">
            MedSync enhances doctor-patient communication by simplifying
            appointment scheduling, medical history tracking, and secure online
            follow-ups. Experience healthcare efficiency like never before.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-[#5AC5C8] mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:text-[#5AC5C8] cursor-pointer">Home</li>
            <li className="hover:text-[#5AC5C8] cursor-pointer">About Us</li>
            <li className="hover:text-[#5AC5C8] cursor-pointer">Services</li>
            <li className="hover:text-[#5AC5C8] cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-semibold text-[#5AC5C8] mb-4">
            Get in Touch
          </h2>
          <div className="flex items-center gap-2 text-gray-300">
            <FaPhoneAlt className="text-[#5AC5C8]" />
            <p>+0-000-000-000</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-300">
            <FaEnvelope className="text-[#5AC5C8]" />
            <p>webdev5@gmail.com</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-300">
            <FaMapMarkerAlt className="text-[#5AC5C8]" />
            <p>Addis Ababa, Ethiopia</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-xl font-semibold text-[#5AC5C8] mb-4">
            Follow Us
          </h2>
          <div className="flex space-x-4">
            <FaFacebookF className="text-gray-300 hover:text-[#5AC5C8] text-2xl cursor-pointer" />
            <FaTwitter className="text-gray-300 hover:text-[#5AC5C8] text-2xl cursor-pointer" />
            <FaInstagram className="text-gray-300 hover:text-[#5AC5C8] text-2xl cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        <hr className="border-gray-600 mb-4" />
        <p>© 2025 MedSync. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
