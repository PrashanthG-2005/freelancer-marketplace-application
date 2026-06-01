import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const result = await dispatch(login(formData)).unwrap();
      showSuccess(`Welcome back, ${result.name}! 👋`);
      navigate(result.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (error) {
      showError(error || 'Invalid email or password');
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
              <LockClosedIcon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your Freelancer Marketplace account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    className={`pl-11 ${errors.email ? 'form-input-error' : 'form-input'}`}
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link to="/" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`pl-11 pr-11 ${errors.password ? 'form-input-error' : 'form-input'}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-white text-xs text-gray-400">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Google', icon: 'G', color: 'hover:border-red-200 hover:bg-red-50' },
                { name: 'GitHub', icon: '⬡', color: 'hover:border-gray-300 hover:bg-gray-50' },
              ].map(p => (
                <button key={p.name} type="button"
                  className={`flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 ${p.color} transition-all`}>
                  <span className="font-bold">{p.icon}</span> {p.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register/freelancer" className="font-semibold text-blue-600 hover:text-blue-800">Create one for free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
