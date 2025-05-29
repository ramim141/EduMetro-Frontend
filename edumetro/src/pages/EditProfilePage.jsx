import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaSave, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    university: '',
    department: '',
    mobile: '',
    website: '',
    birthday: '',
    gender: ''
  });

  useEffect(() => {
    // Animation entrance effect
    setAnimate(true);
    
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users/profile/');
        
        // Map API response to form fields
        const profile = response.data;
        setFormData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || '',
          studentId: profile.student_id || '',
          university: profile.university || '',
          department: profile.department || '',
          mobile: profile.mobile || '',
          website: profile.website || '',
          birthday: profile.birthday || '',
          gender: profile.gender || ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
        
        // For development, populate with sample data
        setFormData({
          firstName: 'Ramim',
          lastName: 'Ahmed',
          email: 'ahramu584@gmail.com',
          studentId: '222-115-141',
          university: 'University Name',
          department: 'Computer Science',
          mobile: '01768628911',
          website: 'www.portfolio.com',
          birthday: '2005-02-22',
          gender: 'Male'
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Format data for API
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        student_id: formData.studentId,
        university: formData.university,
        department: formData.department,
        mobile: formData.mobile,
        website: formData.website,
        birthday: formData.birthday,
        gender: formData.gender
      };
      
      await api.put('/api/users/profile/', apiData);
      setSaving(false);
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Edit Profile</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Photo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-8 w-32 h-32 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-primary-600" />
                  </div>
                  <button 
                    type="button" 
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-300"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Username (disabled) */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Username (Doesn't update)</p>
                  <p className="font-medium text-gray-700">ramim_ahmed</p>
                </div>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </div>
                
                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    required
                  />
                </div>
                
                {/* University */}
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  />
                </div>
                
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  />
                </div>
                
                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  />
                </div>
                
                {/* Birthday */}
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></span>
                    <span className="flex items-center justify-center">
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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