import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to EduMetro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your platform for sharing and discovering educational notes
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 border border-purple-600"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Share Notes</h3>
            <p className="text-gray-600">Share your study notes with fellow students and help each other succeed.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaborate</h3>
            <p className="text-gray-600">Work together with your peers to create and improve study materials.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Learn</h3>
            <p className="text-gray-600">Access high-quality study materials from your peers and enhance your learning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;