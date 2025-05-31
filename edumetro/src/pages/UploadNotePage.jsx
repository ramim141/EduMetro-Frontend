// src/pages/UploadNotePage.jsx (Updated with Success Modal and Redirect)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import DragAndDropFileInput from '../components/DragAndDropFileInput';
import api from '../utils/api';

// Match Django backend department choices
const DEPARTMENT_CHOICES = [
  { value: 'CSE', label: 'Computer Science and Engineering' },
  { value: 'EEE', label: 'Electrical and Electronic Engineering' },
  { value: 'BBA', label: 'Bachelor of Business Administration' },
  { value: 'SWE', label: 'Software Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Architecture', label: 'Architecture' },
  { value: 'Textile', label: 'Textile Engineering' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'ENG', label: 'English' },
  { value: 'ECN', label: 'Economics' },
  { value: 'PHY', label: 'Physics' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
  { value: 'IPE', label: 'Industrial and Production Engineering' },
  { value: 'Other', label: 'Other' }
];

const UploadNotePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setDepartment(newDepartment);
  };

  const handleCourseChange = (e) => {
    setCourseName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!title || !courseName || !description || !department || !selectedFile) {
      setError('All fields including the note file are required.');
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('title', title);
      formData.append('course_name', courseName); // Use course_name field name
      formData.append('description', description);
      formData.append('department_name', department); // Use department_name field name
      formData.append('file', selectedFile);

      // Make API request
      const response = await api.post('/api/notes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      console.log('Note uploaded successfully:', response.data);
      setShowSuccessModal(true);
      
      // Clear form
      setTitle('');
      setCourseName('');
      setDescription('');
      setDepartment('');
      setSelectedFile(null);
      setError(null);

      // Redirect will happen after modal is closed
      
    } catch (err) {
      console.error('Note upload error:', err.response ? err.response.data : err.message);
      let errorMessage = 'Failed to upload note. Please try again.';
      
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          // Handle validation errors
          errorMessage = Object.entries(errors)
            .map(([field, messages]) => {
              // Check if messages is an array before joining
              const formattedMessages = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field}: ${formattedMessages}`;
            })
            .join('\n');
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        } else if (errors.detail) {
          errorMessage = errors.detail;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/my-notes');
  };

  return (
    <AuthLayout>
      <div className="container max-w-2xl p-4 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <Heading level={1} className="mb-6 text-center">
            Upload New Note
          </Heading>

          {error && (
            <Message 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
              duration={5000}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department
              </label>
              <Dropdown
                options={DEPARTMENT_CHOICES}
                value={department}
                onChange={handleDepartmentChange}
                placeholder="Select a department"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Course Name
              </label>
              <Input
                type="text"
                value={courseName}
                onChange={handleCourseChange}
                placeholder="Enter course code and name (e.g. CSE-301 Database)"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter note description"
                required
                rows="4"
                className="w-full p-3 transition-all duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Note File (PDF)
              </label>
              <DragAndDropFileInput
                onFileSelect={setSelectedFile}
                acceptedFileTypes={['pdf']}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner className="mr-2" /> Uploading...
                </div>
              ) : (
                'Upload Note'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleCloseSuccessModal}
        className="w-full max-w-md p-6"
      >
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Note Uploaded Successfully!
          </h3>
          <p className="mb-6 text-gray-600">
            Your note has been uploaded and is now available in your notes collection.
          </p>

          {/* Action Button */}
          <Button
            onClick={handleCloseSuccessModal}
            className="w-full transition-all duration-200"
          >
            View My Notes
          </Button>
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default UploadNotePage;