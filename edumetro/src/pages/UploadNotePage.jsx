// src/pages/UploadNotePage.jsx (Updated POST API endpoint)

import React, { useState, useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Heading from '../components/Heading';
import Spinner from '../components/Spinner';
import Message from '../components/Message'; // তোমার Alert কম্পোনেন্টের নাম Message
import Dropdown from '../components/Dropdown';
import DragAndDropFileInput from '../components/DragAndDropFileInput';
import api from '../utils/api';

const UploadNotePage = () => {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [noteFile, setNoteFile] = useState(null);

  const [courseOptions, setCourseOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch courses and departments
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        // Fetch courses from existing notes (workaround if no dedicated endpoint)
        const notesRes = await api.get('/api/notes/');
        const uniqueCourses = [...new Set(notesRes.data.results.map(note => note.course_name))].filter(name => name);
        const courses = uniqueCourses.map(course => ({
          value: course,
          label: course
        }));
        setCourseOptions(courses);

        // Fetch department choices using OPTIONS request to /api/notes/
        const optionsRes = await api.options('/api/notes/');
        console.log('OPTIONS /api/notes/ response:', optionsRes.data);

        const departmentField = optionsRes.data.actions.POST.department_name;
        if (departmentField && departmentField.choices) {
          const departments = departmentField.choices.map(choice => ({
            value: choice.value,
            label: choice.display_name
          }));
          setDepartmentOptions(departments);
        } else {
          console.warn('Department choices not found in OPTIONS response.', optionsRes.data);
          // Fallback or error handling if choices are not available via OPTIONS
          setApiError('Could not load department options.');
        }

      } catch (err) {
        console.error('Failed to fetch dropdown options:', err.response ? err.response.data : err.message);
        setApiError('Failed to load courses or departments. Please try again.');
      }
    };
    fetchDropdownOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    // Validate form
    if (!title || !courseName || !description || !department || !noteFile) {
      setApiError('All fields including the note file are required.');
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
      formData.append('file', noteFile);

      // Make API request
      const response = await api.post('/api/notes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      console.log('Note uploaded successfully:', response.data);
      setSuccessMessage('Note uploaded successfully!');
      
      // Reset form
      setTitle('');
      setCourseName('');
      setDescription('');
      setDepartment('');
      setNoteFile(null);

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
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container p-4 mx-auto max-w-2xl">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <Heading level={1} className="mb-6 text-center">
            Upload New Note
          </Heading>

          {apiError && (
            <Message 
              type="error" 
              message={apiError} 
              onClose={() => setApiError(null)} 
              duration={5000}
              className="mb-6"
            />
          )}

          {successMessage && (
            <Message 
              type="success" 
              message={successMessage} 
              onClose={() => setSuccessMessage(null)}
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
                Course
              </label>
              <Dropdown
                options={courseOptions}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Select a course"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department
              </label>
              <Dropdown
                options={departmentOptions}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Select a department"
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
                className="p-3 w-full rounded-md border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Note File (PDF)
              </label>
              <DragAndDropFileInput
                onFileSelect={setNoteFile}
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
                <div className="flex justify-center items-center">
                  <Spinner className="mr-2" /> Uploading...
                </div>
              ) : (
                'Upload Note'
              )}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UploadNotePage;