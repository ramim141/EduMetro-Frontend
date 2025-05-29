import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaSave, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useContext(AuthContext);
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
    gender: '',
    bio: '',
    skills: []
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
        
        // Handle gender which might be an array from the backend
        const initialGender = Array.isArray(profile.gender) && profile.gender.length > 0
          ? profile.gender[0] // Use the first element if it's a non-empty array
          : profile.gender || ''; // Otherwise use the value directly or empty string

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
          gender: initialGender, // Set the correctly formatted gender
          bio: profile.bio || '',
          skills: Array.isArray(profile.skills) ? profile.skills : [],
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
          gender: 'Male',
          bio: 'Sample bio',
          skills: ['React', 'Django'],
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'skills') {
      // Split the comma-separated string into an array and trim whitespace
      const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill !== ''); // Filter out empty strings
      // If the resulting array is empty after filtering, set state to empty array
      setFormData(prev => ({
        ...prev,
        [name]: skillsArray.length === 0 ? [] : skillsArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
        university: formData.university,
        department: formData.department,
        mobile_number: formData.mobile || null,
        website: formData.website || null,
        birthday: formData.birthday || null,
        gender: formData.gender || null,
        bio: formData.bio || null,
        skills: Array.isArray(formData.skills) ? formData.skills : [],
      };
      
      console.log('EditProfilePage: Sending API data:', apiData); // Log API data being sent

      await api.put('/api/users/profile/', apiData);
      setSaving(false);
      
      // Fetch updated user profile after successful save
      await fetchUserProfile();

      navigate('/profile', { state: { profileUpdated: true } });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-16 h-16 rounded-full border-t-4 border-b-4 animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center text-gray-600 transition-colors duration-300 hover:text-primary-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-transparent text-gray-900 bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Edit Profile</h1>
        </div>
        
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="p-6">
            {error && (
              <div className="p-4 mb-6 bg-red-50 rounded border-l-4 border-red-500">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Photo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="flex justify-center items-center p-8 w-32 h-32 bg-gradient-to-br rounded-full from-primary-100 to-primary-200">
                    <FaUser className="w-16 h-16 text-primary-600" />
                  </div>
                  <button 
                    type="button" 
                    className="absolute right-0 bottom-0 p-2 text-white rounded-full shadow-lg transition-colors duration-300 bg-primary-600 hover:bg-primary-700"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Username (disabled) */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="mb-1 text-sm text-gray-500">Username (Doesn't update)</p>
                  <p className="font-medium text-gray-700">ramim_ahmed</p>
                </div>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="block mb-1 text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                {/* University */}
                <div>
                  <label htmlFor="university" className="block mb-1 text-sm font-medium text-gray-700">University</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobile" className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Birthday */}
                <div>
                  <label htmlFor="birthday" className="block mb-1 text-sm font-medium text-gray-700">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block mb-1 text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                
                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block mb-1 text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="overflow-hidden relative py-3 w-full font-medium text-white bg-gradient-to-r rounded-lg shadow-md transition-all duration-300 from-primary-500 to-primary-600 hover:shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-transparent -translate-x-full via-white/20 group-hover:animate-shine"></span>
                    <span className="flex justify-center items-center">
                      {saving ? (
                        <>
                          <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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