import React from "react";
import doctorsicon from "../../assets/doctorsicon.png";
import doc1 from "../../assets/doc1.jpg";
import doc2 from "../../assets/doc2.jpg";
import doc3 from "../../assets/doc3.jpg";

const Home = () => {
  return (
    <div className="flex flex-col gap-16 items-center font-outfit px-4">
      {/* Hero Section - Expanded */}
      <div className="flex flex-col lg:flex-row justify-around w-full max-w-screen-xl h-auto lg:h-[600px] mt-8 pt-8 lg:pt-20 rounded-lg bg-[#5AC5C8] w-full">
        <div className="lg:w-[60%] w-full px-6 lg:pl-10 text-white flex flex-col gap-6">
          <p className="text-5xl lg:text-7xl font-semibold mt-4 lg:mt-10">
            Book Appointment with Trusted Doctors
          </p>
          <p className="text-lg lg:text-xl">
            Find top-rated Ethiopian doctors and schedule appointments
            effortlessly for better healthcare.
          </p>
          <div className="flex flex-col sm:flex-row mt-4 gap-4 items-center">
            <div className="flex space-x-[-8px]">
              <img
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full"
                src={doc1}
                alt="Doctor 1"
              />
              <img
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full"
                src={doc2}
                alt="Doctor 2"
              />
              <img
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full"
                src={doc3}
                alt="Doctor 3"
              />
            </div>
            <div className="text-sm lg:text-base text-center lg:text-left">
              Get access to specialists and primary care providers at your
              convenience.
            </div>
          </div>
          <button className="z-[1] h-12 lg:h-14 w-48 lg:w-56 text-base lg:text-lg rounded-full bg-white mt-5 text-[#5f6666] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 ">
            Book Appointment
          </button>
        </div>
        <div className="flex items-end justify-center lg:justify-end w-full lg:w-[40%] mt-6 lg:mt-0">
          <img
            className="w-[85%] lg:w-[95%] h-auto"
            src={doctorsicon}
            alt="Doctors Icon"
          />
        </div>
      </div>

      {/* Featured Doctors Section */}
      <div className="w-full max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold text-[#5AC5C8]">
          Top Rated Doctors
        </h2>
        <p className="text-lg mt-4 text-gray-600">
          Highly experienced professionals at your service
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {[doc1, doc2, doc3].map((doctor, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg w-64 text-center"
            >
              <img
                className="w-24 h-24 rounded-full mx-auto"
                src={doctor}
                alt={`Doctor ${index + 1}`}
              />
              <h3 className="mt-4 font-semibold">Dr. John Doe</h3>
              <p className="text-sm text-gray-600">Cardiologist</p>
              <button className="mt-4 bg-[#5AC5C8] text-white px-4 py-2 rounded-lg">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials & Success Stories */}
      <div className="w-full max-w-screen-xl text-center bg-gray-100 py-12 px-6 rounded-lg">
        <h2 className="text-4xl font-semibold text-[#5AC5C8]">
          What Our Patients Say
        </h2>
        <p className="text-lg mt-4 text-gray-600">
          Real experiences from our happy patients
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {[
            "Amazing service!",
            "Easy & quick booking!",
            "Highly recommended!",
          ].map((review, index) => (
            <div key={index} className="bg-white shadow-md p-6 rounded-lg w-72">
              <p className="italic text-gray-700">"{review}"</p>
              <p className="mt-2 text-sm text-gray-500">- Happy Patient</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Blog & Articles Section */}
      <div className="w-full max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold text-[#5AC5C8]">
          Health Blog & Articles
        </h2>
        <p className="text-lg mt-4 text-gray-600">
          Stay informed with expert health tips
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {[
            "How to Stay Healthy",
            "5 Signs You Need a Doctor",
            "The Importance of Regular Checkups",
          ].map((article, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-6 rounded-lg w-72 text-left"
            >
              <h3 className="font-semibold">{article}</h3>
              <p className="text-sm text-gray-600 mt-2">
                Read about the best practices for a healthier life.
              </p>
              <button className="mt-4 text-[#5AC5C8] font-semibold">
                Read More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
