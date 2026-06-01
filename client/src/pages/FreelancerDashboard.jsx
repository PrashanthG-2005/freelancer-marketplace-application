import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bookingsAPI } from '../lib/api';
import { getAvatar } from '../lib/constants';
import {
  CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon,
  BriefcaseIcon, CheckBadgeIcon, MapPinIcon, SparklesIcon,
  PencilSquareIcon, ArrowTrendingUpIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';

const STATUS_STYLE = {
  accepted:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected:  'bg-red-100   text-red-700   border-red-200',
  pending:   'bg-amber-100 text-amber-700  border-amber-200',
  completed: 'bg-blue-100  text-blue-700  border-blue-200',
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-full mb-5" />
    <div className="flex gap-3">
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab]   = useState('requests');
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { showSuccess, showError }  = useToast();

  const fetchBookings = useCallback(async () => {
    if (!user?._id) { setLoading(false); return; }
    setLoading(true);
    setFetchError(null);
    try {
      const res = await bookingsAPI.getFreelancerBookings(user._id);
      setBookings(res.data || []);
    } catch (err) {
      setFetchError('Could not load your bookings. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      showSuccess(status === 'accepted' ? '🎉 Job accepted! It is now visible to the client.' : 'Job declined.');
      fetchBookings();
    } catch {
      showError('Failed to update status. Please try again.');
    }
  };

  /* ── Real stats computed from live data ───────────── */
  const pendingBookings   = bookings.filter(b => b.status === 'pending');
  const activeBookings    = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings     = completedBookings.reduce((sum, b) => sum + (b.budget || 0), 0);
  /* profile-strength calc */
  const profileComplete = user?.name ? 40 : 0; // name always present after login

  const TABS = [
    { id: 'requests',  label: 'Incoming Requests', count: pendingBookings.length },
    { id: 'active',    label: 'Active Projects',   count: activeBookings.length },
    { id: 'completed', label: 'Completed',          count: completedBookings.length },
  ];

  const STAT_CARDS = [
    {
      label: 'Total Earnings',
      value: totalEarnings > 0 ? `₹${totalEarnings.toLocaleString('en-IN')}` : '₹0',
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      bg: 'bg-emerald-50', text: 'text-emerald-600',
      sub: completedBookings.length > 0 ? `From ${completedBookings.length} completed job${completedBookings.length > 1 ? 's' : ''}` : 'Complete jobs to earn',
    },
    {
      label: 'Active Jobs',
      value: String(activeBookings.length),
      icon: <BriefcaseIcon className="w-5 h-5" />,
      bg: 'bg-blue-50', text: 'text-blue-600',
      sub: activeBookings.length > 0 ? `${activeBookings.length} in progress` : 'Accept requests to start',
    },
    {
      label: 'Pending Requests',
      value: String(pendingBookings.length),
      icon: <ClockIcon className="w-5 h-5" />,
      bg: 'bg-amber-50', text: 'text-amber-600',
      sub: pendingBookings.length > 0 ? 'Awaiting your response' : 'No pending requests',
    },
    {
      label: 'Jobs Done',
      value: String(completedBookings.length),
      icon: <CheckBadgeIcon className="w-5 h-5" />,
      bg: 'bg-violet-50', text: 'text-violet-600',
      sub: completedBookings.length > 0 ? 'Successfully delivered' : 'No completed jobs yet',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      {/* Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Freelancer Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span> 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile/edit" className="btn-primary text-sm px-4 py-2">
              <PencilSquareIcon className="w-4 h-4 mr-1.5" />Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error banner */}
        {fetchError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
            {fetchError}
            <button onClick={fetchBookings} className="ml-auto font-semibold underline">Retry</button>
          </div>
        )}

        {/* Profile banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 text-gray-900 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
          <div className="absolute -top-16 -right-8 w-64 h-64 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar + info */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-3xl font-black shadow-md overflow-hidden border border-gray-100">
                <img 
                  src={getAvatar(user?.profilePicture, user?.name)} 
                  alt={user?.name} 
                  className="w-full h-full object-cover bg-white" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <CheckBadgeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <StarIcon className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-gray-700">
                    {completedBookings.length > 0 ? '★ Top Rated' : 'New Freelancer'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" />Remote</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${pendingBookings.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                    {pendingBookings.length > 0 ? `${pendingBookings.length} pending request${pendingBookings.length > 1 ? 's' : ''}` : 'Available for work'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action */}
            <div className="lg:ml-auto flex gap-3">
              <Link to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-all">
                <PencilSquareIcon className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Profile completion bar */}
          <div className="relative mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4 text-amber-500" />Profile Strength
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">
                  {completedBookings.length > 0 ? '100%' : bookings.length > 0 ? '70%' : '40%'}
                </span>
                <Link to="/profile/edit"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg text-xs font-semibold border border-blue-100 hover:border-blue-200 transition-all duration-200 shadow-sm active:scale-95 group">
                  Complete Profile <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: completedBookings.length > 0 ? '100%' : bookings.length > 0 ? '70%' : '40%' }}
              />
            </div>
          </div>
        </div>

        {/* Stat cards — all from real data */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <div className={`text-2xl font-black mb-0.5 ${s.text}`}>{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 mb-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-200 hover:text-blue-600'
              }`}>
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── PENDING REQUESTS TAB ─────────────────────────── */}
        {activeTab === 'requests' && (
          <>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : pendingBookings.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <ClockIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Complete your profile fully to attract clients and appear in search results.
                </p>
                <Link to="/profile/edit" className="btn-primary">
                  <PencilSquareIcon className="w-4 h-4 mr-2" />Complete Your Profile
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {pendingBookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <h4 className="font-bold text-gray-900 text-base mb-1 leading-tight">{booking.projectTitle}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-3.5 h-3.5 text-emerald-500" />
                            <strong className="text-gray-700">₹{booking.budget?.toLocaleString('en-IN')}</strong>
                          </span>
                          <span>{new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${STATUS_STYLE[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{booking.description}</p>

                    {booking.client?.name && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          <img 
                            src={getAvatar(booking.clientProfile?.profilePicture, booking.client?.name)} 
                            alt={booking.client?.name} 
                            className="w-full h-full object-cover bg-white" 
                          />
                        </div>
                        <span>Client: <strong>{booking.client.name}</strong></span>
                      </div>
                    )}

                    {booking.timeline?.startDate && (
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-gray-50 rounded-xl p-3">
                        <span>📅 Start: <strong className="text-gray-700">{new Date(booking.timeline.startDate).toLocaleDateString()}</strong></span>
                        {booking.timeline?.deadline && (
                          <span>⏰ Due: <strong className="text-gray-700">{new Date(booking.timeline.deadline).toLocaleDateString()}</strong></span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'accepted')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <CheckCircleIcon className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold transition-all"
                      >
                        <XCircleIcon className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ACTIVE PROJECTS TAB ──────────────────────────── */}
        {activeTab === 'active' && (
          <>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <BriefcaseIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active projects</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Accept incoming requests to start working on projects.
                </p>
                <button onClick={() => setActiveTab('requests')} className="btn-primary">
                  View Requests ({pendingBookings.length})
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {activeBookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-emerald-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">{booking.projectTitle}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLE.accepted}`}>
                          ✓ Accepted — In Progress
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xl font-black text-emerald-600">₹{booking.budget?.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-gray-400">budget</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{booking.description}</p>

                    {booking.client?.name && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          <img 
                            src={getAvatar(booking.clientProfile?.profilePicture, booking.client?.name)} 
                            alt={booking.client?.name} 
                            className="w-full h-full object-cover bg-white" 
                          />
                        </div>
                        <span>Client: <strong>{booking.client.name}</strong></span>
                      </div>
                    )}

                    {booking.timeline?.deadline && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4">
                        <ClockIcon className="w-4 h-4 flex-shrink-0" />
                        Deadline: <strong>{new Date(booking.timeline.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      </div>
                    )}

                    <button
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      <CheckBadgeIcon className="w-4 h-4" /> Mark as Completed
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── COMPLETED TAB ────────────────────────────────── */}
        {activeTab === 'completed' && (
          <>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : completedBookings.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <CheckBadgeIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No completed projects yet</h3>
                <p className="text-gray-500">
                  Mark active jobs as complete once delivered.
                </p>
              </div>
            ) : (
              <>
                {/* Earnings summary */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total Earnings from Completed Work</p>
                    <p className="text-4xl font-black">₹{totalEarnings.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-emerald-100 text-sm mb-1">Jobs Delivered</p>
                    <p className="text-4xl font-black">{completedBookings.length}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {completedBookings.map(booking => (
                    <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-base">{booking.projectTitle}</h4>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE.completed}`}>
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{booking.description}</p>

                      {booking.client?.name && (
                        <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 mb-3">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                            <img 
                              src={getAvatar(booking.clientProfile?.profilePicture, booking.client?.name)} 
                              alt={booking.client?.name} 
                              className="w-full h-full object-cover bg-white" 
                            />
                          </div>
                          <span className="text-xs">Client: <strong>{booking.client.name}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
                        <span className="font-bold text-emerald-600">₹{booking.budget?.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
