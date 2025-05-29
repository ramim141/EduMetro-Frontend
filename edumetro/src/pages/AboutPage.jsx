import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About EduMetro
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            EduMetro is dedicated to enhancing the educational experience by providing a centralized platform for note-sharing and collaboration among students.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3 mb-6">
            <li>Seamless note-sharing between students</li>
            <li>Organized study materials and resources</li>
            <li>Collaborative learning environment</li>
            <li>Easy access to educational content</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have questions or suggestions? Reach out to us at support@edumetro.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;