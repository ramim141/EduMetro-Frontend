import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import Footer from '@/components/footer';

const AboutPage = () => {
  return (
    <div className="">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-800"
          >
            <FaHome className="mr-2" />
            Home
          </Link>
          <Link 
            to="/note" 
            className="flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Notes
          </Link>
        </div>

        <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
          About EduMetro
        </h1>
        
        <div className="p-8 mb-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Our Mission
          </h2>
          <p className="mb-6 text-gray-600">
            EduMetro is dedicated to enhancing the educational experience by providing a centralized platform for note-sharing and collaboration among students.
          </p>
          
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            What We Offer
          </h2>
          <ul className="mb-6 space-y-3 list-disc list-inside text-gray-600">
            <li>Seamless note-sharing between students</li>
            <li>Organized study materials and resources</li>
            <li>Collaborative learning environment</li>
            <li>Easy access to educational content</li>
          </ul>
          
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have questions or suggestions? Reach out to us at support@edumetro.com
          </p>
        </div>
      </div>

      <Footer/>
    </div>

    
  );
};

export default AboutPage;