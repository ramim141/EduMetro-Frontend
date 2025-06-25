// src/pages/EditProfilePage.jsx (Updated & Corrected - Full Code)

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaSave, FaArrowLeft, FaUniversity, FaBuilding, FaMobile, FaGlobe, FaBirthdayCake, FaVenusMars, FaInfoCircle, FaCode, FaUsers as BatchIcon } from 'react-icons/fa';
import api, { getDepartments } from '../utils/api';
import AuthContext from '../context/AuthContext';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/Button';
import Dropdown from '@/components/ui/Dropdown';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { fetchUserProfile, user: authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    university: '',
    department: '', // This will hold the department ID
    batch: '',
    section: '',
    mobile_number: '',
    website: '',
    birthday: '',
    gender: '',
    bio: '',
    skills: []
  });

  const [rawSkillsInput, setRawSkillsInput] = useState('');

  useEffect(() => {
    setAnimate(true);
    
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [profileRes, departmentsRes] = await Promise.all([
          api.get('/api/users/profile/'),
          getDepartments()
        ]);
        
        const profile = profileRes.data;
        const loadedDepartments = departmentsRes.data.results || departmentsRes.data || [];
        setDepartments(loadedDepartments);
        
        let batch = '';
        let section = '';
        if (profile.batch_with_section) {
            const match = profile.batch_with_section.match(/(\d+)\s*\(?([A-Z])\)?/i);
            if (match) {
                batch = match[1];
                section = match[2];
            }
        }
        
        const initialSkills = Array.isArray(profile.skills) ? profile.skills : [];
        setFormData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || '',
          studentId: profile.student_id || '',
          university: profile.university || '',
          department: profile.department || '', // API sends department ID
          batch: batch,
          section: section,
          mobile_number: profile.mobile_number || '',
          website: profile.website || '',
          birthday: profile.birthday || '',
          gender: String(profile.gender || ''),
          bio: profile.bio || '',
          skills: initialSkills,
        });
        
        setRawSkillsInput(initialSkills.join(', '));
        setProfilePicturePreview(profile.profile_picture_url || null);
        
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsInputChange = (e) => {
    setRawSkillsInput(e.target.value);
  };

  const handleSkillsBlur = () => {
    const skillsArray = rawSkillsInput.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      handleSkillsBlur();
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('first_name', formData.firstName);
      formDataToSubmit.append('last_name', formData.lastName);
      formDataToSubmit.append('university', formData.university || '');
      formDataToSubmit.append('department', formData.department || '');
      formDataToSubmit.append('batch', formData.batch || '');
      formDataToSubmit.append('section', formData.section || '');
      formDataToSubmit.append('mobile_number', formData.mobile_number || '');
      formDataToSubmit.append('website', formData.website || '');
      formDataToSubmit.append('birthday', formData.birthday || '');
      formDataToSubmit.append('gender', formData.gender || '');
      formDataToSubmit.append('bio', formData.bio || '');
      formDataToSubmit.append('skills', formData.skills.join(','));

      if (selectedFile) {
        formDataToSubmit.append('profile_picture', selectedFile);
      } else if (profilePicturePreview === null && authUser?.profile_picture_url) {
        formDataToSubmit.append('profile_picture', '');
      }
      
      await api.put('/api/users/profile/', formDataToSubmit); 
      await fetchUserProfile(); 
      navigate('/profile?updated=true');

    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      let errorMessage = 'Failed to update profile. Please check all fields and try again.';
      if (err.response?.data) {
        const errorData = err.response.data;
        errorMessage = Object.keys(errorData)
          .map(key => `${key.replace(/_/g, " ")}: ${Array.isArray(errorData[key]) ? errorData[key].join(", ") : errorData[key]}`)
          .join(" | ");
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section with Background */}
      <div className="relative max-w-6xl px-6 py-12 mx-auto overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-40 h-40 bg-white rounded-full -top-20 -right-20 opacity-20"></div>
          <div className="absolute w-20 h-20 bg-white rounded-full top-20 left-10 opacity-10"></div>
          <div className="absolute w-32 h-32 bg-white rounded-full bottom-10 right-10 opacity-10"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Edit Your Profile</h1>
            <p className="text-blue-100">Update your personal information and preferences</p>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center px-4 py-2 mt-4 text-white transition-all duration-300 border rounded-lg md:mt-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {error && (
            <div className="p-4 mb-6 border-b-4 border-red-500 bg-red-50 rounded-t-xl">
              <p className="flex items-center font-medium text-red-700"><FaInfoCircle className="mr-2" /> Error: {error}</p>
            </div>
          )}
          
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Profile Photo Upload Section */}
              <div className="flex justify-center mb-10">
                <div className="relative group">
                  <div className="flex items-center justify-center overflow-hidden transition-transform duration-300 rounded-full shadow-xl w-36 h-36 bg-gradient-to-br from-blue-100 to-indigo-200 ring-4 ring-white group-hover:scale-105">
                    {profilePicturePreview ? (
                      <img src={profilePicturePreview} alt="Profile Preview" className="object-cover w-full h-full" />
                    ) : (
                      <FaUser className="w-16 h-16 text-blue-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    className="hidden" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()} 
                    className="absolute bottom-0 right-0 p-3 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110"
                    title="Change Profile Picture"
                  >
                    <FaCamera />
                  </button>
                  {profilePicturePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setProfilePicturePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute bottom-0 left-0 p-2 text-white transition-all duration-300 bg-red-500 rounded-full shadow-lg hover:bg-red-600 hover:scale-110"
                      title="Remove Profile Picture"
                    >
                      ×
                    </button>
                  )}
                  <div className="absolute text-xs text-gray-500 transform -translate-x-1/2 -bottom-6 left-1/2 whitespace-nowrap">
                    Click the camera icon to update
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Account Information Section */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 mr-2 text-blue-600 bg-blue-100 rounded-full">
                      <FaUser className="w-4 h-4" />
                    </span>
                    Account Information
                  </h2>
                  
                  {/* Username (disabled) */}
                  <div className="p-4 mb-4 bg-gray-100 rounded-lg">
                    <p className="mb-1 text-sm text-gray-500">Username (Cannot be updated)</p>
                    <p className="font-medium text-gray-700">{authUser?.username || 'N/A'}</p>
                  </div>
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FaUser className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FaUser className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Email - Made ReadOnly */}
                  <div className="mt-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly 
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50" 
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Student ID - Made ReadOnly */}
                  <div className="mt-4">
                    <label htmlFor="studentId" className="block mb-1 text-sm font-medium text-gray-700">Student ID</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        readOnly 
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Educational Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 mr-2 text-indigo-600 bg-indigo-100 rounded-full">
                      <FaUniversity className="w-4 h-4" />
                    </span>
                    Educational Information
                  </h2>
                  
                  {/* University */}
                  <div>
                    <label htmlFor="university" className="block mb-1 text-sm font-medium text-gray-700">University</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaUniversity className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Department */}
                  <div className="mt-4">
                    <label htmlFor="department" className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                    <div className="relative">
                      
                       <Dropdown
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        options={departments.map(d => ({ value: d.id, label: d.name }))}
                        placeholder="Select Department"
                        className="w-full pl-10"
                        required
                      />
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaBuilding className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  {/* Batch and Section */}
                  <div className="mt-4">
                    <label htmlFor="batch" className="block mb-1 text-sm font-medium text-gray-700">Batch</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <BatchIcon className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="batch"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="section" className="block mb-1 text-sm font-medium text-gray-700">Section</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <BatchIcon className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                </div>
                
                
                
                {/* Contact Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 mr-2 text-green-600 bg-green-100 rounded-full">
                      <FaMobile className="w-4 h-4" />
                    </span>
                    Contact Information
                  </h2>
                  
                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="mobile" className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaMobile className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div className="mt-4">
                    <label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">Website</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaGlobe className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://"
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 mr-2 text-yellow-600 bg-yellow-100 rounded-full">
                      <FaInfoCircle className="w-4 h-4" />
                    </span>
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Birthday */}
                    <div>
                      <label htmlFor="birthday" className="block mb-1 text-sm font-medium text-gray-700">Birthday</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FaBirthdayCake className="w-4 h-4" />
                        </span>
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Gender */}
                    <div>
                      <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FaVenusMars className="w-4 h-4" />
                        </span>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="mt-4">
                    <label htmlFor="bio" className="block mb-1 text-sm font-medium text-gray-700">Bio</label>
                    <div className="relative">
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-2 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Skills Section */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 mr-2 text-purple-600 bg-purple-100 rounded-full">
                      <FaCode className="w-4 h-4" />
                    </span>
                    Skills
                  </h2>
                  
                  {/* Skills Input Field */}
                  <div>
                    <label htmlFor="skills" className="block mb-1 text-sm font-medium text-gray-700">Skills (Comma-separated)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaCode className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={rawSkillsInput} // rawSkillsInput দিয়ে কন্ট্রোল করা হলো
                        onChange={handleSkillsInputChange} // rawSkillsInput আপডেট করবে
                        onBlur={handleSkillsBlur} // ফোকাস হারালে formData.skills আপডেট করবে
                        placeholder="e.g., Python, React, Machine Learning"
                        className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Add multiple skills separated by commas (e.g., Python, React, Django).</p>
                    
                    {/* Display skills as tags */}
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="relative w-full py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                  >
                    <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent to-transparent via-white/20 group-hover:animate-shine"></span>
                    <span className="flex items-center justify-center">
                      {saving ? (
                        <>
                          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving Changes
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
// END OF FILE EditProfilePage.jsx