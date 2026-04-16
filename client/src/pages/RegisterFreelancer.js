import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/authSlice';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const PERKS = [
  { icon: <BoltIcon className="w-4 h-4" />, title: 'Start in 5 minutes', desc: 'Quick onboarding with guided profile setup.' },
  { icon: <CurrencyDollarIcon className="w-4 h-4" />, title: 'Keep 95% of earnings', desc: 'Industry-leading commission structure.' },
  { icon: <CheckBadgeIcon className="w-4 h-4" />, title: 'Get a Verified badge', desc: 'Stand out with our verification program.' },
];

const RegisterFreelancer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', skills: '', projectRate: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateStep1 = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) e.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.skills.trim()) e.skills = 'Please enter at least one skill';
    if (!formData.projectRate || formData.projectRate <= 0) e.projectRate = 'Project rate must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const data = { ...formData, role: 'freelancer', skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
    setLoading(true);
    try {
      const result = await dispatch(register(data)).unwrap();
      showSuccess(`Welcome to Freelancer Marketplace, ${result.name}! 🎉`);
      navigate('/dashboard/freelancer');
    } catch (error) {
      showError(error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 to-blue-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-blue-500 opacity-15 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Freelancer Marketplace</span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-300 text-sm font-semibold mb-5">
            💼 For Freelancers
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Build Your Dream<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Freelance Career
            </span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            Join 50,000+ professionals earning on their own terms. Set your rates, choose your projects, work from anywhere.
          </p>
          <div className="space-y-4">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">{p.icon}</div>
                <div>
                  <div className="text-white text-sm font-semibold">{p.title}</div>
                  <div className="text-white/50 text-xs">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />)}
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-3">
            "I landed my first ₹50K project within a week of joining Freelancer Marketplace. The platform's client quality is unmatched."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold">AK</div>
            <div>
              <div className="text-white text-xs font-semibold">Ananya Kumar</div>
              <div className="text-blue-300/60 text-xs">Full-Stack Developer · ₹1.2L/month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${s < step ? 'bg-blue-600 border-blue-600 text-white' : s === step ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>
                    {s < step ? '✓' : s}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline">{s === 1 ? 'Account Details' : 'Professional Info'}</span>
                </div>
                {s === 1 && <div className={`h-0.5 w-12 rounded-full transition-all ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-3">
              <UserPlusIcon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {step === 1 ? 'Create Your Account' : 'Your Professional Profile'}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 ? 'Start your freelance journey on Freelancer Marketplace' : 'Help clients understand your expertise'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {step === 1 ? (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <UserPlusIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="name" type="text" className={`pl-11 ${errors.name ? 'form-input-error' : 'form-input'}`}
                      placeholder="John Doe" value={formData.name} onChange={handleChange} />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Email *</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="email" type="email" className={`pl-11 ${errors.email ? 'form-input-error' : 'form-input'}`}
                      placeholder="john@example.com" value={formData.email} onChange={handleChange} />
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

                <button type="button" onClick={handleNext} className="w-full btn-primary h-12 text-base">
                  Continue to Profile Setup →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Skills * <span className="font-normal text-gray-400">(comma separated)</span></label>
                  <div className="relative">
                    <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="skills" type="text" className={`pl-11 ${errors.skills ? 'form-input-error' : 'form-input'}`}
                      placeholder="React, Node.js, Python, AWS" value={formData.skills} onChange={handleChange} />
                  </div>
                  {errors.skills && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.skills}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['React', 'Node.js', 'Python', 'UI/UX', 'AWS'].map(s => (
                      <button key={s} type="button" onClick={() => setFormData(f => ({ ...f, skills: f.skills ? `${f.skills}, ${s}` : s }))}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expected Project Rate (₹) *</label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="projectRate" type="number" min="500" className={`pl-11 ${errors.projectRate ? 'form-input-error' : 'form-input'}`}
                      placeholder="e.g. 25000" value={formData.projectRate} onChange={handleChange} />
                  </div>
                  {errors.projectRate && <p className="mt-1.5 text-xs text-red-600">⚠ {errors.projectRate}</p>}
                  <p className="text-xs text-gray-400 mt-1">Industry average: ₹5,000–₹50,000 · You keep 95%</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Professional Bio <span className="font-normal text-gray-400">(optional)</span></label>
                  <div className="relative">
                    <DocumentTextIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <textarea name="bio" rows="4" className="form-input pl-11 resize-none"
                      placeholder="Tell clients about your experience, what you specialise in, and your working style..."
                      value={formData.bio} onChange={handleChange} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary h-12">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : 'Create Freelancer Account 🚀'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">Sign in →</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            By signing up, you agree to our{' '}
            <Link to="/" className="underline">Terms of Service</Link> and{' '}
            <Link to="/" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterFreelancer;
