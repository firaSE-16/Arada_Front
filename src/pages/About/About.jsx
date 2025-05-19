// File: about.jsx
import React from "react";
import aboutImage from "../../assets/team/team-member-2.jpg";
import missionImage from "../../assets/team/mission.jpg";
import visionImage from "../../assets/team/vission.jpg";
import teamImage from "../../assets/team/team-member-1.jpg";

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700">
        <img
          src={teamImage}
          alt="About Us"
          className="w-full h-[400px] object-cover "
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            About Us
          </h1>
          <p className="text-lg max-w-xl">
            Revolutionizing healthcare through technology. We connect patients
            and doctors in a seamless and trusted way.
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-black mb-4">Who We Are</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We are a tech-driven healthcare platform committed to enhancing
              patient care by simplifying doctor-patient communication. With a
              team of dedicated professionals, we strive to create an innovative
              and accessible healthcare experience.
            </p>
          </div>
          <div>
            <img
              src={aboutImage}
              alt="Who We Are"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-8">
            <img
              src={missionImage}
              alt="Mission"
              className="w-32 h-32 rounded-full mb-6"
            />
            <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
            <p className="text-gray-600 text-center">
              To deliver accessible and high-quality healthcare to everyone,
              breaking barriers through technology and innovation.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-8">
            <img
              src={visionImage}
              alt="Vision"
              className="w-32 h-32 rounded-full mb-6"
            />
            <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
            <p className="text-gray-600 text-center">
              To lead the digital healthcare revolution and make virtual
              consultations as reliable as in-person visits.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">
            Meet Our Amazing Team
          </h2>
          <p className="text-gray-700 mt-4">
            Our team is comprised of dedicated professionals committed to
            ensuring the best healthcare experience for you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            "Biruk A.",
            "Fraol A.",
            "Lamesgin D.",
            "Abdulkerim N.",
            "Biruk S.",
          ].map((id) => (
            <div
              key={id}
              className="flex flex-col items-center bg-gray-50 rounded-lg shadow-md p-6"
            >
              <img
                src={teamImage}
                alt={`Team Member ${id}`}
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-bold text-black">{id}</h3>
              <p className="text-gray-500"></p>Collaborator
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
