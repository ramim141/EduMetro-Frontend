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
    first_name: '',
    last_name: '',
    university: '',
    department: '',
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
        
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          university: profile.university || '',
          department: profile.department || '',
          batch: profile.batch || '',
          section: profile.section || '',
          mobile_number: profile.mobile_number || '',
          website: profile.website || '',
          birthday: profile.birthday || '',
          gender: String(profile.gender || ''),
          bio: profile.bio || '',
          skills: Array.isArray(profile.skills) ? profile.skills : [],
        });
        
        setRawSkillsInput(profile.skills?.join(', ') || '');
        setProfilePicturePreview(profile.profile_picture_url || null);
        
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProfilePicturePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // ✅ এই ফাংশনগুলো যোগ করা হয়েছে
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
      const dataToSubmit = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          dataToSubmit.append(key, value.join(','));
        } else {
          dataToSubmit.append(key, value || '');
        }
      });
      
      if (selectedFile) {
        dataToSubmit.append('profile_picture', selectedFile);
      } else if (!profilePicturePreview && authUser?.profile_picture_url) {
        dataToSubmit.append('profile_picture', '');
      }

      await api.put('/api/users/profile/', dataToSubmit);
      await fetchUserProfile();
      navigate('/profile?updated=true');

    } catch (err) {
      let errorMessage = 'Failed to update profile.';
      if (err.response?.data) {
        errorMessage = Object.entries(err.response.data)
          .map(([key, value]) => `${key.replace(/_/g, " ")}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join(" | ");
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner size="xl" /></div>;
  }

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}>
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
          <button onClick={() => navigate('/profile')} className="flex items-center px-4 py-2 mt-4 text-white transition-all duration-300 border rounded-lg md:mt-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20">
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-[-2rem] relative z-20">
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {error && (<div className="p-4 border-b-4 border-red-500 bg-red-50"><p className="flex items-center font-medium text-red-700"><FaInfoCircle className="mr-2" /> Error: {error}</p></div>)}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Photo Upload Section */}
              <div className="flex justify-center mb-10">
                <div className="relative group">
                  <div className="flex items-center justify-center overflow-hidden transition-transform duration-300 rounded-full shadow-xl w-36 h-36 bg-gradient-to-br from-blue-100 to-indigo-200 ring-4 ring-white group-hover:scale-105">
                    {profilePicturePreview ? (<img src={profilePicturePreview} alt="Profile Preview" className="object-cover w-full h-full" />) : (<FaUser className="w-16 h-16 text-blue-600" />)}
                  </div>
                  <input type="file" id="profilePictureInput" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 p-3 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110" title="Change Profile Picture"><FaCamera /></button>
                  {profilePicturePreview && (<button type="button" onClick={() => { setSelectedFile(null); setProfilePicturePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute bottom-0 left-0 p-2 text-white transition-all duration-300 bg-red-500 rounded-full shadow-lg hover:bg-red-600 hover:scale-110" title="Remove Profile Picture">×</button>)}
                  <div className="absolute text-xs text-gray-500 transform -translate-x-1/2 -bottom-6 left-1/2 whitespace-nowrap">Click the camera icon to update</div>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Account Information Section */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800"><span className="flex items-center justify-center w-8 h-8 mr-2 text-blue-600 bg-blue-100 rounded-full"><FaUser className="w-4 h-4" /></span>Account Information</h2>
                  <div className="p-4 mb-4 bg-gray-100 rounded-lg"><p className="mb-1 text-sm text-gray-500">Username (Cannot be updated)</p><p className="font-medium text-gray-700">{authUser?.username || 'N/A'}</p></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaUser className="w-4 h-4" /></span><input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaUser className="w-4 h-4" /></span><input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                    </div>
                  </div>
                </div>
                
                {/* Educational Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800"><span className="flex items-center justify-center w-8 h-8 mr-2 text-indigo-600 bg-indigo-100 rounded-full"><FaUniversity className="w-4 h-4" /></span>Educational Information</h2>
                  <div className="mt-4">
                    <label htmlFor="university" className="block mb-1 text-sm font-medium text-gray-700">University</label>
                    <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaUniversity className="w-4 h-4" /></span><input type="text" id="university" name="university" value={formData.university} onChange={handleChange} className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="department" className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                    <Dropdown icon={<FaBuilding />} id="department" name="department" value={formData.department} onChange={handleChange} options={departments.map(d => ({ value: d.id, label: d.name }))} placeholder="Select Department" className="w-full" required />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="batch" className="block mb-1 text-sm font-medium text-gray-700">Batch</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><BatchIcon className="w-4 h-4" /></span><input type="text" id="batch" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g., 57" className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                    </div>
                    <div>
                      <label htmlFor="section" className="block mb-1 text-sm font-medium text-gray-700">Section</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><BatchIcon className="w-4 h-4" /></span><input type="text" id="section" name="section" value={formData.section} onChange={handleChange} placeholder="e.g., D" className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800"><span className="flex items-center justify-center w-8 h-8 mr-2 text-green-600 bg-green-100 rounded-full"><FaMobile className="w-4 h-4" /></span>Contact Information</h2>
                  <div>
                      <label htmlFor="mobile_number" className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaMobile className="w-4 h-4" /></span><input type="tel" id="mobile_number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                  </div>
                  <div className="mt-4">
                      <label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">Website</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaGlobe className="w-4 h-4" /></span><input type="url" id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                  </div>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                    <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800"><span className="flex items-center justify-center w-8 h-8 mr-2 text-yellow-600 bg-yellow-100 rounded-full"><FaInfoCircle className="w-4 h-4" /></span>Personal Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="birthday" className="block mb-1 text-sm font-medium text-gray-700">Birthday</label>
                            <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaBirthdayCake className="w-4 h-4" /></span><input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                            <div className="relative"><span className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-gray-500 pointer-events-none"><FaVenusMars className="w-4 h-4" /></span><select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="">Select Gender</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="bio" className="block mb-1 text-sm font-medium text-gray-700">Bio</label>
                        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell us about yourself..." className="w-full px-4 py-2 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                    <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800"><span className="flex items-center justify-center w-8 h-8 mr-2 text-purple-600 bg-purple-100 rounded-full"><FaCode className="w-4 h-4" /></span>Skills</h2>
                    <div>
                        <label htmlFor="skills" className="block mb-1 text-sm font-medium text-gray-700">Skills (Comma-separated)</label>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none"><FaCode className="w-4 h-4" /></span><input type="text" id="skills" name="skills" value={rawSkillsInput} onChange={handleSkillsInputChange} onBlur={handleSkillsBlur} placeholder="e.g., Python, React, Machine Learning" className="w-full px-4 py-2 pl-10 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
                        <p className="mt-1 text-xs text-gray-500">Add multiple skills separated by commas.</p>
                        {formData.skills.length > 0 && (<div className="flex flex-wrap gap-2 mt-3">{formData.skills.map((skill, index) => (<span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">{skill}</span>))}</div>)}
                    </div>
                </div>
                
                <div className="pt-6">
                  <Button type="submit" disabled={saving} className="w-full py-3 text-lg">
                    <div className="flex items-center justify-center">
                        {saving ? <Spinner className="mr-2" /> : <FaSave className="mr-2" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </div>
                  </Button>
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