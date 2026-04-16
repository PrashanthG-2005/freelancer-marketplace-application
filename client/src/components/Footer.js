import React from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const FOOTER_LINKS = {
  'For Clients': [
    { label: 'How to Hire', to: '/' },
    { label: 'Find Freelancers', to: '/register/client' },
    { label: 'Enterprise Solutions', to: '/' },
    { label: 'Payment Protection', to: '/' },
    { label: 'Client Resources', to: '/' },
  ],
  'For Freelancers': [
    { label: 'How to Earn', to: '/' },
    { label: 'Create Profile', to: '/register/freelancer' },
    { label: 'Freelancer Perks', to: '/' },
    { label: 'Skill Certifications', to: '/' },
    { label: 'Success Stories', to: '/' },
  ],
  'Company': [
    { label: 'About Us', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Press Room', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Contact Us', to: '/' },
  ],
};

const SOCIAL = [
  { label: 'Twitter', href: '#', icon: 'X' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'GitHub', href: '#', icon: 'GH' },
  { label: 'Instagram', href: '#', icon: 'IG' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-slate-400 text-sm">Get weekly insights, tips, and the best freelance opportunities.</p>
            </div>
            <form className="flex items-stretch gap-3 w-full max-w-md" onSubmit={e => e.preventDefault()}>
              <div className="flex-1 relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Freelancer Marketplace
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              The world's leading marketplace for freelance talent. Connect with 50,000+ verified professionals across 500+ skill categories.
            </p>
            {/* Contact */}
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                <EnvelopeIcon className="w-4 h-4" />
                support@freelancermarketplace.com
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <PhoneIcon className="w-4 h-4" />
                +1 (800) 123-4567
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPinIcon className="w-4 h-4" />
                San Francisco, CA · New Delhi, IN
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Freelancer Marketplace Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-2">
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 flex items-center justify-center text-slate-400 hover:text-white text-xs font-bold transition-all duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
