import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  StarIcon,
  CheckBadgeIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  UserCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const CATEGORIES = [
  { icon: '💻', label: 'Web Development', count: '12,400+', color: 'from-blue-500 to-cyan-500' },
  { icon: '🎨', label: 'UI/UX Design', count: '8,200+', color: 'from-pink-500 to-rose-500' },
  { icon: '📱', label: 'Mobile Apps', count: '5,600+', color: 'from-violet-500 to-purple-500' },
  { icon: '📝', label: 'Content Writing', count: '9,100+', color: 'from-amber-500 to-orange-500' },
  { icon: '📈', label: 'Digital Marketing', count: '6,800+', color: 'from-emerald-500 to-teal-500' },
  { icon: '🔒', label: 'Cybersecurity', count: '2,300+', color: 'from-red-500 to-rose-600' },
  { icon: '🤖', label: 'AI & Automation', count: '3,400+', color: 'from-indigo-500 to-blue-600' },
  { icon: '🎬', label: 'Video Editing', count: '4,700+', color: 'from-fuchsia-500 to-pink-500' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Post Your Project',
    desc: 'Describe your project requirements, budget, and timeline. Our smart matching engine finds the best candidates.',
    icon: <BoltIcon className="w-7 h-7" />,
    color: 'bg-blue-500',
  },
  {
    step: '02',
    title: 'Review Proposals',
    desc: 'Receive curated proposals from verified freelancers. Review portfolios, ratings, and previous work samples.',
    icon: <UserCircleIcon className="w-7 h-7" />,
    color: 'bg-violet-500',
  },
  {
    step: '03',
    title: 'Collaborate & Pay Safely',
    desc: 'Work seamlessly with milestone-based payments. Funds are released only when you are 100% satisfied.',
    icon: <ShieldCheckIcon className="w-7 h-7" />,
    color: 'bg-emerald-500',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Founder, TechStack India',
    avatar: 'PS',
    rating: 5,
    text: 'Freelancer Marketplace connected us with an incredible React developer within 48 hours. The project was delivered ahead of schedule — absolutely outstanding!',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Marcus Johnson',
    role: 'Marketing Director, Growthify',
    avatar: 'MJ',
    rating: 5,
    text: 'We hired 3 designers from Freelancer Marketplace and all of them were top-notch. The quality filter is genuinely impressive. Will keep coming back!',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Aisha Al-Rashid',
    role: 'CEO, NexaHealth',
    avatar: 'AA',
    rating: 5,
    text: 'The escrow payment system gave us peace of mind. Our mobile app went from idea to App Store in just 6 weeks working with a Freelancer Marketplace team.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const STATS = [
  { value: '50K+', label: 'Expert Freelancers', icon: <UserCircleIcon className="w-6 h-6" /> },
  { value: '1.2M+', label: 'Projects Completed', icon: <CheckBadgeIcon className="w-6 h-6" /> },
  { value: '4.9★', label: 'Average Rating', icon: <StarSolid className="w-6 h-6" /> },
  { value: '₹500Cr+', label: 'Paid to Freelancers', icon: <CurrencyDollarIcon className="w-6 h-6" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheckIcon className="w-5 h-5" />, text: 'Verified Professionals' },
  { icon: <CurrencyDollarIcon className="w-5 h-5" />, text: 'Secure Escrow Payments' },
  { icon: <ClockIcon className="w-5 h-5" />, text: '24/7 Support' },
  { icon: <GlobeAltIcon className="w-5 h-5" />, text: 'Global Talent Pool' },
];

const POPULAR_SKILLS = [
  'React.js', 'Node.js', 'Python', 'UI/UX Design', 'WordPress', 'Mobile Dev', 'SEO', 'Copywriting', 'Data Science', 'AWS', 'Shopify', 'Figma'
];

const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    const duration = 1500;
    const steps = 40;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  const formatted = target.includes('M') ? (count / 1000).toFixed(1) + 'M' :
    target.includes('K') ? count + 'K' :
    target.includes('₹500Cr') ? '₹' + (count / 1000).toFixed(0) + 'Cr' :
    count + '';
  return <span>{formatted}{suffix}</span>;
};

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden hero-gradient bg-grid-pattern pt-10 pb-24">
        {/* Blob decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200 to-violet-200 opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              🚀 Trusted by 50,000+ businesses worldwide
            </span>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Hire World-Class
              <span className="block gradient-text mt-1">Freelance Talent</span>
              <span className="block text-gray-800">in Hours, Not Weeks</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
              Connect with pre-vetted professionals across 500+ skill categories.
              Start working with top talent today — with our satisfaction guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/register/client" className="btn-primary-lg min-w-[220px]">
                Start Hiring Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/register/freelancer" className="btn-secondary-lg min-w-[220px]">
                <PlayCircleIcon className="w-5 h-5 mr-2" />
                Become a Freelancer
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {TRUST_BADGES.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 text-gray-500">
                  <span className="text-blue-500">{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-2 text-blue-500">{s.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SKILLS ───────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-semibold text-gray-400 whitespace-nowrap shrink-0">Trending:</span>
            {POPULAR_SKILLS.map((skill, i) => (
              <Link
                key={i}
                to="/register/client"
                className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0"
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Explore Categories</p>
            <h2 className="section-title">Browse by Expertise</h2>
            <p className="section-subtitle">
              Discover talent across every major category. From code to content — we have you covered.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to="/register/client"
                className="group relative overflow-hidden card-hover p-6 bg-white border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{cat.label}</h3>
                <p className="text-sm text-gray-400">{cat.count} freelancers</p>
                <ChevronRightIcon className="absolute top-6 right-6 w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-bold text-white mb-4">How Freelancer Marketplace Works</h2>
            <p className="text-lg text-blue-100/70 max-w-2xl mx-auto">
              From idea to delivery in three effortless steps. Our platform is built for speed, quality, and trust.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 text-blue-500/40">
                    <ArrowRightIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} bg-opacity-90 flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-5xl font-black text-white/10 leading-none">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-blue-100/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FREELANCER MARKETPLACE ────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                The Smartest Way to<br />
                <span className="gradient-text">Scale Your Team</span>
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                We don't just list freelancers — we vet, verify, and continually rate every professional on our platform so you only work with the best.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <CheckBadgeIcon className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50', title: 'Only Top 3% Accepted', desc: 'Every freelancer passes skill tests, portfolio reviews, and ID verification.' },
                  { icon: <ShieldCheckIcon className="w-6 h-6" />, color: 'text-emerald-500 bg-emerald-50', title: 'Milestone-Based Payments', desc: 'Release payment only when each milestone is completed to your satisfaction.' },
                  { icon: <ChartBarIcon className="w-6 h-6" />, color: 'text-violet-500 bg-violet-50', title: 'Real-Time Progress Tracking', desc: 'Built-in project boards and time tracking for complete transparency.' },
                  { icon: <ClockIcon className="w-6 h-6" />, color: 'text-amber-500 bg-amber-50', title: 'Hire in Under 24 Hours', desc: 'Our matching engine connects you with ready-to-start talent instantly.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual Panel */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-8 border border-blue-100">
                {/* Mock card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">A</div>
                    <div>
                      <div className="font-bold text-gray-900">Alex Chen</div>
                      <div className="text-sm text-gray-400">Full-Stack Developer</div>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">✓ Verified</span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {['React', 'Node.js', 'AWS'].map(s => (
                      <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => <StarSolid key={i} className="w-4 h-4" />)}
                      <span className="ml-1 font-bold text-gray-900">4.99</span>
                      <span className="text-gray-400">(214 reviews)</span>
                    </div>
                    <span className="font-bold text-gray-900 text-base">₹25,000/project</span>
                  </div>
                </div>
                {/* Progress Widget */}
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Project: E-commerce Platform</div>
                  <div className="space-y-2">
                    {[{ label: 'Design', pct: 100 }, { label: 'Frontend', pct: 72 }, { label: 'Backend', pct: 45 }].map(p => (
                      <div key={p.label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{p.label}</span><span>{p.pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Payment Widget */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Next Milestone</div>
                      <div className="text-2xl font-black text-gray-900">₹75,000</div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">In Escrow</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Delivered on time</div>
                  <div className="font-bold text-gray-900 text-sm">98.7% success rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Social Proof</p>
            <h2 className="section-title">Loved by Businesses Worldwide</h2>
            <p className="section-subtitle">Don't take our word for it — here's what our clients say.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`card-hover p-7 cursor-pointer transition-all duration-300 ${activeTestimonial === i ? 'ring-2 ring-blue-400 shadow-xl' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <StarSolid key={j} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR FREELANCERS ──────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
                  🌟 For Freelancers
                </span>
                <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
                  Turn Your Skills Into a Thriving Career
                </h2>
                <p className="text-violet-100 text-lg leading-relaxed mb-8">
                  Join thousands of freelancers who earn more, work smarter, and build their dream careers on Freelancer Marketplace.
                </p>
                <div className="space-y-3 mb-10">
                  {[
                    'Access to 10,000+ active client projects daily',
                    'Set your own rates — you keep 95% of earnings',
                    'Get paid on time, every time with milestone protection',
                    'Build your reputation with verified reviews',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/90">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register/freelancer" className="btn-white inline-flex items-center gap-2">
                  Start Earning Today
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
              <div className="hidden lg:flex items-end justify-center p-12 pt-0">
                <div className="w-full max-w-sm space-y-3">
                  {[
                    { name: 'Sarah K.', skill: 'React Developer', earned: '₹1.5L this month', rating: '5.0', avatar: 'SK', color: 'from-pink-400 to-rose-400' },
                    { name: 'Dev Patel', skill: 'UI/UX Designer', earned: '₹85K this month', rating: '4.9', avatar: 'DP', color: 'from-amber-400 to-orange-400' },
                    { name: 'James Wu', skill: 'Data Scientist', earned: '₹2.8L this month', rating: '5.0', avatar: 'JW', color: 'from-emerald-400 to-teal-400' },
                  ].map((f, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {f.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm truncate">{f.name}</div>
                        <div className="text-xs text-white/60">{f.skill}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-300">{f.earned}</div>
                        <div className="text-xs text-white/60">⭐ {f.rating}</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-white/50 text-xs pt-1">+48,000 more earning on Freelancer Marketplace</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
            🎯 Ready to get started?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The Talent You Need.<br />
            <span className="gradient-text">The Results You Want.</span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Join over 50,000 businesses that trust Freelancer Marketplace to scale their teams and deliver world-class results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/client" className="btn-primary-lg">
              Hire Talent Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/register/freelancer" className="btn-secondary-lg">
              Find Work Today
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">No subscription required · Free to post · Pay only for results</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
