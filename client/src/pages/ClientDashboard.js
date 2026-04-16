import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { freelancersAPI, bookingsAPI } from '../lib/api';
import { getAvatar } from '../lib/constants';
import {
  MagnifyingGlassIcon, FunnelIcon, ClockIcon,
  CurrencyDollarIcon, CheckBadgeIcon, PaperAirplaneIcon,
  Squares2X2Icon, ListBulletIcon, AdjustmentsHorizontalIcon,
  BriefcaseIcon, XMarkIcon, PlusIcon, ExclamationCircleIcon,
  StarIcon as StarOutline,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Toaster } from 'react-hot-toast';
import { useToast } from '../hooks/useToast';

// ── Status helpers ────────────────────────────────────
const STATUS_STYLE = {
  pending:   { pill: 'bg-amber-100  text-amber-700  border-amber-200',  dot: 'bg-amber-400'  },
  accepted:  { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  rejected:  { pill: 'bg-red-100    text-red-700    border-red-200',    dot: 'bg-red-400'    },
  completed: { pill: 'bg-blue-100   text-blue-700   border-blue-200',   dot: 'bg-blue-400'   },
};

// ── Skeleton ─────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      {[1,2,3].map(i=><div key={i} className="h-6 w-14 bg-gray-100 rounded-lg"/>)}
    </div>
    <div className="h-9 bg-gray-100 rounded-xl" />
  </div>
);

// ── Freelancer card (grid) ───────────────────────────
const FreelancerCardGrid = ({ freelancer, onBook }) => (
  <div
    className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer p-6"
    onClick={() => onBook(freelancer)}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold shrink-0 overflow-hidden">
          <img 
            src={getAvatar(freelancer.profilePicture, freelancer.user?.name)} 
            alt={freelancer.user?.name} 
            className="w-full h-full rounded-xl object-cover shadow-sm bg-white" 
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-gray-900 text-sm">{freelancer.user?.name}</h3>
            <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
            <StarSolid className="w-3 h-3" />
            <span className="font-semibold text-gray-700">{freelancer.rating || '5.0'}</span>
            <span className="text-gray-400">({freelancer.completedProjects || 0} jobs)</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-gray-900">₹{freelancer.projectRate?.toLocaleString('en-IN') || 0}</div>
        <div className="text-xs text-gray-400">/project</div>
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{freelancer.bio || 'Experienced professional ready to work.'}</p>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {freelancer.skills?.slice(0,4).map((s,i) => (
        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100">{s}</span>
      ))}
      {freelancer.skills?.length > 4 && <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-lg">+{freelancer.skills.length-4}</span>}
    </div>
    <button className="w-full btn-primary text-sm py-2.5 group-hover:shadow-md transition-shadow">
      <PaperAirplaneIcon className="w-3.5 h-3.5 mr-1.5" /> Book Freelancer
    </button>
  </div>
);

// ── Freelancer card (list) ───────────────────────────
const FreelancerCardList = ({ freelancer, onBook }) => (
  <div
    className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer p-5 flex items-center gap-4"
    onClick={() => onBook(freelancer)}
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden border border-gray-100 shadow-sm">
      <img 
        src={getAvatar(freelancer.profilePicture, freelancer.user?.name)} 
        alt={freelancer.user?.name} 
        className="w-full h-full object-cover bg-white" 
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="font-bold text-gray-900 text-sm">{freelancer.user?.name}</span>
        <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {freelancer.skills?.slice(0,3).map((s,i) => (
          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">{s}</span>
        ))}
      </div>
    </div>
    <div className="shrink-0 text-right mr-4">
      <div className="font-black text-gray-900">₹{freelancer.projectRate?.toLocaleString('en-IN') || 0}<span className="text-xs text-gray-400 font-normal">/project</span></div>
      <div className="flex items-center justify-end gap-0.5 text-xs text-amber-500 mt-0.5">
        <StarSolid className="w-3 h-3" />{freelancer.rating || '5.0'}
      </div>
    </div>
    <button className="btn-primary text-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Book</button>
  </div>
);

// ── Main component ────────────────────────────────────
const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab]             = useState('browse');
  const [freelancers, setFreelancers]         = useState([]);
  const [bookings, setBookings]               = useState([]);
  const searchInputRef                        = React.useRef(null);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [fetchError, setFetchError]           = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [viewMode, setViewMode]               = useState('grid');
  const [filters, setFilters]                 = useState({ skills:'', minRate:'', maxRate:'' });
  const [showFilters, setShowFilters]         = useState(false);
  const [showModal, setShowModal]             = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [bookingForm, setBookingForm] = useState({ projectTitle:'', description:'', budget:'', startDate:'', deadline:'' });
  const { showSuccess, showError } = useToast();

  // ── Data fetching ─────────────────────────────────
  const fetchFreelancers = useCallback(async () => {
    setLoadingFreelancers(true);
    try {
      // Clean up empty filters before sending
      const queryParams = { limit: 50, page: 1 };
      if (filters.skills) queryParams.skills = filters.skills;
      if (filters.minRate) queryParams.minRate = filters.minRate;
      if (filters.maxRate) queryParams.maxRate = filters.maxRate;
      
      const res = await freelancersAPI.getAll(queryParams);
      setFreelancers(res.data.freelancers || []);
    } catch { /* silent */ }
    finally { setLoadingFreelancers(false); }
  }, [filters]);

  const fetchBookings = useCallback(async () => {
    if (!user?._id) { setLoadingBookings(false); return; }
    setLoadingBookings(true);
    setFetchError(null);
    try {
      const res = await bookingsAPI.getClientBookings(user._id);
      setBookings(res.data || []);
    } catch (err) {
      setFetchError('Could not load bookings. Please refresh.');
    } finally { setLoadingBookings(false); }
  }, [user?._id]);

  useEffect(() => { fetchFreelancers(); fetchBookings(); }, [fetchFreelancers, fetchBookings]);

  // ── Real computed stats — zero hardcoded numbers ──
  const pendingBookings   = bookings.filter(b => b.status === 'pending');
  const activeBookings    = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent        = completedBookings.reduce((sum, b) => sum + (b.budget || 0), 0);
  const totalBudgetLocked = activeBookings.reduce((sum, b) => sum + (b.budget || 0), 0);

  const STAT_CARDS = [
    {
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      bg:'bg-blue-50', text:'text-blue-600',
      sub: completedBookings.length > 0 ? `Across ${completedBookings.length} completed project${completedBookings.length>1?'s':''}` : 'No completed projects yet',
    },
    {
      label: 'Total Bookings',
      value: String(bookings.length),
      icon: <BriefcaseIcon className="w-5 h-5" />,
      bg:'bg-violet-50', text:'text-violet-600',
      sub: `${pendingBookings.length} pending · ${activeBookings.length} active`,
    },
    {
      label: 'Active Projects',
      value: String(activeBookings.length),
      icon: <ClockIcon className="w-5 h-5" />,
      bg:'bg-amber-50', text:'text-amber-600',
      sub: activeBookings.length > 0 ? `₹${totalBudgetLocked.toLocaleString('en-IN')} in progress` : 'No active projects',
    },
    {
      label: 'Jobs Completed',
      value: String(completedBookings.length),
      icon: <CheckBadgeIcon className="w-5 h-5" />,
      bg:'bg-emerald-50', text:'text-emerald-600',
      sub: completedBookings.length > 0 ? 'Successfully delivered' : 'No completed jobs yet',
    },
  ];

  const TABS = [
    { id:'browse',   label:'Browse Talent',    count: freelancers.length },
    { id:'active',   label:'Active Projects',  count: activeBookings.length },
    { id:'bookings', label:'All Bookings',     count: bookings.length },
  ];

  // ── Booking modal ─────────────────────────────────
  const openModal = (f) => { setSelectedFreelancer(f); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedFreelancer(null); };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.create({
        freelancerId: selectedFreelancer._id,
        ...bookingForm,
        budget: parseFloat(bookingForm.budget),
        timeline: { startDate: bookingForm.startDate, deadline: bookingForm.deadline },
      });
      showSuccess('Booking request sent! The freelancer will respond shortly.');
      closeModal();
      setBookingForm({ projectTitle:'', description:'', budget:'', startDate:'', deadline:'' });
      fetchBookings();
    } catch {
      showError('Failed to submit booking. Please try again.');
    }
  };

  // ── Client-side search filter ─────────────────────
  const visibleFreelancers = freelancers.filter(f => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.user?.name?.toLowerCase().includes(q) ||
      f.skills?.some(s => s.toLowerCase().includes(q)) ||
      f.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius:'12px', fontSize:'14px' } }} />

      {/* Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span> 👋
            </p>
          </div>
          <button 
            onClick={() => {
              setActiveTab('browse');
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }} 
            className="btn-primary text-sm px-5 py-2.5"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />Hire Freelancer
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {fetchError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
            {fetchError}
            <button onClick={fetchBookings} className="ml-auto font-semibold underline">Retry</button>
          </div>
        )}

        {/* Stats — real data only */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((s,i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>{s.icon}</div>
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
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab===tab.id?'bg-white/20 text-white':'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── BROWSE TAB ────────────────────────────────── */}
        {activeTab === 'browse' && (
          <div>
            {/* Search + controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text" placeholder="Search by name, skill, or technology..."
                  className="form-input pl-11 w-full"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${showFilters?'bg-blue-50 border-blue-200 text-blue-600':'bg-white border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                <AdjustmentsHorizontalIcon className="w-5 h-5" />Filters
              </button>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                <button onClick={()=>setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode==='grid'?'bg-blue-600 text-white':'text-gray-400 hover:text-gray-600'}`}>
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button onClick={()=>setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode==='list'?'bg-blue-600 text-white':'text-gray-400 hover:text-gray-600'}`}>
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category / Skill</label>
                    <select className="form-input" onChange={e=>setFilters(f=>({...f,skills:e.target.value}))}>
                      <option value="">All Categories</option>
                      {['React','Node.js','Python','Design','WordPress','Mobile Dev','AWS','SEO'].map(s=>(
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Rate: ₹{filters.minRate || '0'}</label>
                    <input type="range" min="0" max="100000" step="500" value={filters.minRate || 0}
                      onChange={e=>setFilters(f=>({...f,minRate:e.target.value}))} className="w-full accent-blue-600"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Rate: ₹{filters.maxRate || '300000+'}</label>
                    <input type="range" min="0" max="300000" step="5000" value={filters.maxRate || 300000}
                      onChange={e=>setFilters(f=>({...f,maxRate:e.target.value}))} className="w-full accent-blue-600"/>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={()=>setFilters({skills:'',minRate:'',maxRate:''})} className="text-sm text-gray-500 hover:text-gray-700">Reset</button>
                  <button onClick={fetchFreelancers} className="btn-primary text-sm px-5 py-2">Apply</button>
                </div>
              </div>
            )}

            {loadingFreelancers ? (
              <div className={`grid gap-5 ${viewMode==='grid'?'sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
                {[...Array(6)].map((_,i)=><SkeletonCard key={i}/>)}
              </div>
            ) : visibleFreelancers.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <FunnelIcon className="w-16 h-16 text-gray-200 mx-auto mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No freelancers found</h3>
                <p className="text-gray-500 mb-5">Try adjusting your search or filters</p>
                <button onClick={()=>{setSearchQuery('');setFilters({skills:'',minRate:'',maxRate:''});}} className="btn-primary">Clear Search</button>
              </div>
            ) : (
              <div className={`grid gap-5 ${viewMode==='grid'?'sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
                {visibleFreelancers.map(f =>
                  viewMode==='grid'
                    ? <FreelancerCardGrid key={f._id} freelancer={f} onBook={openModal}/>
                    : <FreelancerCardList key={f._id} freelancer={f} onBook={openModal}/>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVE PROJECTS TAB ──────────────────────── */}
        {activeTab === 'active' && (
          <div>
            {loadingBookings ? (
              <div className="grid sm:grid-cols-2 gap-5">{[...Array(2)].map((_,i)=><SkeletonCard key={i}/>)}</div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <BriefcaseIcon className="w-16 h-16 text-gray-200 mx-auto mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active projects</h3>
                <p className="text-gray-500 mb-5 max-w-sm mx-auto">
                  Active projects appear here once a freelancer accepts your booking request.
                </p>
                <button onClick={()=>setActiveTab('browse')} className="btn-primary">Browse Freelancers</button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 mb-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-blue-100 text-sm">Active Project Budget</p>
                    <p className="text-3xl font-black">₹{totalBudgetLocked.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-blue-100 text-sm">Projects in Progress</p>
                    <p className="text-3xl font-black">{activeBookings.length}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {activeBookings.map(booking => (
                    <div key={booking._id} className="bg-white rounded-2xl border border-emerald-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{booking.projectTitle}</h4>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Freelancer Accepted — In Progress
                          </span>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <div className="text-xl font-black text-emerald-600">₹{booking.budget?.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-gray-400">budget</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{booking.description}</p>

                      {booking.timeline?.deadline && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4">
                          <ClockIcon className="w-4 h-4 shrink-0"/>
                          Deadline: <strong>{new Date(booking.timeline.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</strong>
                        </div>
                      )}

                      {/* Freelancer info if populated */}
                      {booking.freelancer?.user?.name && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                            <img 
                              src={getAvatar(booking.freelancer?.profilePicture, booking.freelancer?.user?.name)} 
                              alt={booking.freelancer?.user?.name} 
                              className="w-full h-full object-cover bg-white" 
                            />
                          </div>
                          <span>Freelancer: <strong>{booking.freelancer.user.name}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ALL BOOKINGS TAB ─────────────────────────── */}
        {activeTab === 'bookings' && (
          <div>
            {loadingBookings ? (
              <div className="grid sm:grid-cols-2 gap-5">{[...Array(3)].map((_,i)=><SkeletonCard key={i}/>)}</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <BriefcaseIcon className="w-16 h-16 text-gray-200 mx-auto mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-5">Find a freelancer and send your first booking request</p>
                <button onClick={()=>setActiveTab('browse')} className="btn-primary">Browse Freelancers</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {bookings.map(booking => {
                  const st = STATUS_STYLE[booking.status] || STATUS_STYLE.pending;
                  return (
                    <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-3">
                          <h4 className="font-bold text-gray-900 mb-1">{booking.projectTitle}</h4>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${st.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{booking.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-sm">
                        <span className="flex items-center gap-1 font-bold text-gray-800">
                          <CurrencyDollarIcon className="w-4 h-4 text-emerald-500"/>
                          ₹{booking.budget?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400">#{booking._id?.slice(-6)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Booking Modal ─────────────────────────────── */}
      {showModal && selectedFreelancer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                      src={getAvatar(selectedFreelancer.profilePicture, selectedFreelancer.user?.name)} 
                      alt={selectedFreelancer.user?.name} 
                      className="w-full h-full object-cover bg-white" 
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedFreelancer.user?.name}</h2>
                    <p className="text-sm text-gray-400">₹{selectedFreelancer.projectRate?.toLocaleString('en-IN') || 0}/project · ⭐ {selectedFreelancer.rating || '5.0'}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><XMarkIcon className="w-5 h-5 text-gray-400"/></button>
              </div>

              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title *</label>
                  <input required className="form-input" placeholder="e.g. E-commerce Website Redesign"
                    value={bookingForm.projectTitle} onChange={e=>setBookingForm(f=>({...f,projectTitle:e.target.value}))}/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                  <textarea rows="4" required className="form-input resize-none"
                    placeholder="Describe your requirements, goals, and expected deliverables..."
                    value={bookingForm.description} onChange={e=>setBookingForm(f=>({...f,description:e.target.value}))}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (₹) *</label>
                    <input type="number" required className="form-input" placeholder="2500"
                      value={bookingForm.budget} onChange={e=>setBookingForm(f=>({...f,budget:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date *</label>
                    <input type="date" required className="form-input"
                      value={bookingForm.startDate} onChange={e=>setBookingForm(f=>({...f,startDate:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deadline *</label>
                    <input type="date" required className="form-input"
                      value={bookingForm.deadline} onChange={e=>setBookingForm(f=>({...f,deadline:e.target.value}))}/>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-sm text-blue-700">
                  <CheckBadgeIcon className="w-5 h-5 shrink-0 mt-0.5"/>
                  <span>Payment is held in escrow and released only after you approve the completed work.</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button type="button" onClick={closeModal} className="flex-1 btn-secondary py-3">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3">
                    <PaperAirplaneIcon className="w-4 h-4 mr-2"/> Send Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
