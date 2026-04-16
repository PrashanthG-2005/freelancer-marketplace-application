import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import { freelancersAPI, clientsAPI, uploadAPI } from '../lib/api';
import { getAvatar } from '../lib/constants';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  SparklesIcon,
  CameraIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Vue.js',
  'Angular', 'AWS', 'Docker', 'Figma', 'UI/UX Design', 'Tailwind CSS',
  'MongoDB', 'PostgreSQL', 'GraphQL', 'React Native', 'Flutter', 'WordPress',
  'SEO', 'Content Writing', 'Data Science', 'Machine Learning',
];

const RATE_RANGES = [
  { label: 'Starter (< ₹5K)', min: 1000, max: 5000 },
  { label: 'Mid (₹5K–₹25K)', min: 5000, max: 25000 },
  { label: 'Senior (₹25K–₹75K)', min: 25000, max: 75000 },
  { label: 'Expert (₹75K+)', min: 75000, max: 300000 },
];

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    skills: [],
    projectRate: '',
    companyName: '',
    profilePicture: '',
  });
  const [errors, setErrors] = useState({});

  // No redirecting needed now as we support both roles
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      setFetching(true);
      try {
        const response = user.role === 'freelancer' 
          ? await freelancersAPI.getMyProfile() 
          : await clientsAPI.getMyProfile();
        
        const profile = response.data;
        if (user.role === 'freelancer') {
          setFormData({
            name: user.name || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            projectRate: profile.projectRate || '',
            profilePicture: profile.profilePicture || '',
          });
        } else {
          setFormData({
            name: user.name || '',
            companyName: profile.companyName || '',
            profilePicture: profile.profilePicture || '',
            bio: '', // Clients handle preferences or standard bio later
            skills: [],
            projectRate: '',
          });
        }
      } catch (err) {
        // Any error (404 = no profile yet, 500 = server not restarted with new route)
        // → silently show empty form so the freelancer can fill it in fresh.
        // Do NOT show the red error banner; the form will still work fine.
        console.warn('Profile not loaded (new user or server needs restart):', err.response?.status);
      } finally {
        setFetching(false);
      }
    };
    if (user?._id) loadProfile();
  }, [user?._id]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full Name is required';
    if (user.role === 'freelancer') {
      if (formData.skills.length === 0) e.skills = 'Add at least one skill';
      if (!formData.projectRate || Number(formData.projectRate) <= 0) e.projectRate = 'Enter a valid project rate';
    } else {
      // Client validation? Not strictly needed for now
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File too large. Max 5MB allowed.');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(uploadFormData);
      setFormData(prev => ({ ...prev, profilePicture: response.data.url }));
      showSuccess('Photo uploaded! Click Save to keep changes. ✨');
    } catch (err) {
      showError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (formData.skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
    if (errors.skills) setErrors(prev => ({ ...prev, skills: '' }));
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (user.role === 'freelancer') {
        await freelancersAPI.updateMyProfile({
          name: formData.name,
          bio: formData.bio,
          skills: formData.skills,
          projectRate: Number(formData.projectRate),
          profilePicture: formData.profilePicture,
        });
        dispatch(updateUser({ name: formData.name, profilePicture: formData.profilePicture }));
        showSuccess('Freelancer profile updated! ✅');
        navigate('/dashboard/freelancer');
      } else {
        await clientsAPI.updateMyProfile({
          name: formData.name,
          companyName: formData.companyName,
          profilePicture: formData.profilePicture,
        });
        dispatch(updateUser({ name: formData.name, profilePicture: formData.profilePicture }));
        showSuccess('Client profile updated! ✅');
        navigate('/dashboard/client');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completionPct = (() => {
    let score = 0;
    if (formData.bio && formData.bio.length > 50) score += 40;
    else if (formData.bio) score += 20;
    if (formData.skills.length >= 3) score += 40;
    else if (formData.skills.length > 0) score += 20;
    if (formData.projectRate) score += 20;
    return Math.min(score, 100);
  })();

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={user.role === 'freelancer' ? "/dashboard/freelancer" : "/dashboard/client"}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
              <p className="text-xs text-gray-500">Keep your profile up-to-date to attract more {user.role === 'freelancer' ? 'clients' : 'talent'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={user.role === 'freelancer' ? "/dashboard/freelancer" : "/dashboard/client"} className="btn-secondary text-sm px-4 py-2">Cancel</Link>
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary text-sm px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <img 
                  src={getAvatar(formData.profilePicture, user?.name)} 
                  alt={user?.name} 
                  className="w-full h-full rounded-2xl object-cover border-2 border-white shadow-md bg-white" 
                />
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading ? (
                     <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                     </svg>
                  ) : <CameraIcon className="w-4 h-4 text-gray-600" />}
                </label>
              </div>
              <h3 className="font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{user?.email}</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'freelancer' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
                {user.role === 'freelancer' ? <CheckBadgeIcon className="w-3.5 h-3.5" /> : <BuildingOfficeIcon className="w-3.5 h-3.5" />}
                Verified {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
              </span>
            </div>

            {/* Profile strength */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-gray-900">Profile Strength</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">Completion</span>
                  <span className={`font-bold ${completionPct >= 80 ? 'text-emerald-600' : completionPct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {completionPct}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${completionPct >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : completionPct >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-red-400 to-rose-400'}`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Professional bio (50+ chars)', done: formData.bio.length > 50 },
                  { label: 'At least 3 skills added', done: formData.skills.length >= 3 },
                  { label: 'Project rate set', done: !!formData.projectRate },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${item.done ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? 'border-emerald-500 bg-emerald-500' : 'border-gray-200'}`}>
                      {item.done && <span className="text-white text-[8px]">✓</span>}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Role specific tips */}
            <div className={user.role === 'freelancer' ? "bg-blue-50 border border-blue-100 rounded-2xl p-5" : "bg-violet-50 border border-violet-100 rounded-2xl p-5"}>
              <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${user.role === 'freelancer' ? 'text-blue-800' : 'text-violet-800'}`}>
                <StarIcon className="w-4 h-4 text-amber-400" /> Pro Tips
              </h4>
              <ul className={`space-y-2 text-xs ${user.role === 'freelancer' ? 'text-blue-700' : 'text-violet-700'}`}>
                {user.role === 'freelancer' ? (
                  <>
                    <li>• Profiles with 5+ skills get <strong>3× more views</strong></li>
                    <li>• A bio over 100 words increases hire rate by <strong>50%</strong></li>
                    <li>• Competitive project rates attract <strong>better quality clients</strong></li>
                  </>
                ) : (
                  <>
                    <li>• A clear company profile builds <strong>essential trust</strong></li>
                    <li>• Verified clients receive <strong>2× more proposals</strong></li>
                    <li>• Adding a profile photo increases response rates by <strong>40%</strong></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Common Fields */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-1">
                <UserCircleIcon className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-gray-900">Personal Information</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">Update your display name.</p>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className={`form-input pl-11 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.name}</p>}
              </div>
            </div>

            {user.role === 'freelancer' ? (
              <>
                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <TagIcon className="w-5 h-5 text-blue-500" />
                    <h2 className="font-bold text-gray-900">Skills & Expertise</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Add skills to help clients find you. Type and press Enter or comma to add.</p>

                  <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 mb-3 transition-all ${errors.skills ? 'border-red-300 bg-red-50' : 'border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100'}`}>
                    <TagIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
                      placeholder="e.g. React, Node.js, Figma..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-100">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900 focus:outline-none">
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.skills && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.skills}</p>}

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Suggested Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition-colors border border-gray-200"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Rate */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-bold text-gray-900">Pricing Setting</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-5">Set your rate per project. This helps match you with the right clients.</p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Rate (₹) *</label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          className={`pl-11 form-input ${errors.projectRate ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                          placeholder="e.g. 25000"
                          value={formData.projectRate}
                          onChange={e => setFormData(prev => ({ ...prev, projectRate: e.target.value }))}
                        />
                      </div>
                      {errors.projectRate && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.projectRate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rate Guide</label>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Starter</span>
                          <span className="font-semibold text-gray-700">₹1K - ₹5K</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Expert</span>
                          <span className="font-semibold text-gray-700">₹75K+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <DocumentTextIcon className="w-5 h-5 text-amber-500" />
                    <h2 className="font-bold text-gray-900">Professional Bio</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Tell clients about your experience, expertise, and what makes you unique.</p>

                  <div className="relative">
                    <textarea
                      rows="5"
                      className="form-input resize-none w-full"
                      placeholder="I am a passionate professional with a proven track record of delivering high-quality web applications..."
                      value={formData.bio}
                      onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {formData.bio.length} chars
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Client Company Info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <BuildingOfficeIcon className="w-5 h-5 text-violet-500" />
                    <h2 className="font-bold text-gray-900">Company Information</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Help professionals know more about your business.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
                      <div className="relative">
                        <BuildingOfficeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          className="form-input pl-11"
                          placeholder="e.g. Acme Corp"
                          value={formData.companyName}
                          onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Save button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Profile...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckBadgeIcon className="w-5 h-5" /> Save Profile Changes
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
