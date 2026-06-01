import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { getAvatar } from '../lib/constants';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BriefcaseIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100' : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Freelancer Marketplace
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    Home
                  </Link>
                  <Link to="/register/freelancer" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all flex items-center gap-1.5">
                    <UserGroupIcon className="w-4 h-4" /> For Freelancers
                  </Link>
                  <Link to="/register/client" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all flex items-center gap-1.5">
                    <BriefcaseIcon className="w-4 h-4" /> For Clients
                  </Link>
                  <div className="w-px h-5 bg-gray-200 mx-2" />
                  <Link to="/login" className="btn-primary text-sm px-5 py-2.5">
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <Link to={user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    Dashboard
                  </Link>
                  <div className="w-px h-5 bg-gray-200 mx-2" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                      <img 
                        src={getAvatar(user?.profilePicture, user?.name)} 
                        alt={user?.name} 
                        className="w-7 h-7 rounded-lg object-cover shadow-sm border border-white bg-white" 
                      />
                      <div className="hidden lg:block">
                        <div className="text-xs font-semibold text-gray-900 leading-tight">{user?.name}</div>
                        <div className="text-[10px] text-gray-400 capitalize">{user?.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Home</Link>
                <Link to="/register/freelancer" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">For Freelancers</Link>
                <Link to="/register/client" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">For Clients</Link>
                <Link to="/login" className="block text-center btn-primary py-3">Sign In</Link>
              </>
            ) : (
              <>
                <Link to={user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">Sign Out</button>
              </>
            )}
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
