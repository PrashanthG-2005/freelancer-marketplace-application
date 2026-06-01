import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/authSlice';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const RegisterClient = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) e.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await dispatch(register({ ...formData, role: 'client' })).unwrap();
      showSuccess(`Welcome to Freelancer Marketplace, ${result.name}! 🎉 Let's find your talent.`);
      navigate('/dashboard/client');
    } catch (error) {
      showError(error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <BuildingOfficeIcon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Start Hiring Today</h1>
            <p className="text-gray-500 text-sm">Create your client account — it's free</p>

            {/* Features strip */}
            <div className="flex items-center justify-center gap-4 mt-3">
              {['No credit card', 'Free to post', 'Hire in 24h'].map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />{f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input name="name" type="text" className={`pl-11 ${errors.name ? 'form-input-error' : 'form-input'}`}
                    placeholder="John Smith" value={formData.name} onChange={handleChange} />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Email *</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input name="email" type="email" className={`pl-11 ${errors.email ? 'form-input-error' : 'form-input'}`}
                    placeholder="john@company.com" value={formData.email} onChange={handleChange} />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input name="password" type={showPassword ? 'text' : 'password'}
                    className={`pl-11 pr-11 ${errors.password ? 'form-input-error' : 'form-input'}`}
                    placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.password}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company Name <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input name="companyName" type="text" className="form-input pl-11"
                    placeholder="Acme Corporation" value={formData.companyName} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <RocketLaunchIcon className="w-5 h-5" />
                    Create Client Account — It's Free
                  </span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Want to work as a freelancer?{' '}
            <Link to="/register/freelancer" className="font-semibold text-blue-600 hover:text-blue-800">Join as Freelancer →</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">Sign in</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            By signing up, you agree to our{' '}
            <Link to="/" className="underline">Terms</Link> and{' '}
            <Link to="/" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
