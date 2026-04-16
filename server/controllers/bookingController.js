const Booking = require('../models/Booking');
const FreelancerProfile = require('../models/FreelancerProfile');
const ClientProfile = require('../models/ClientProfile');

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private Client
const createBooking = async (req, res) => {
  try {
    const { freelancerId, projectTitle, description, budget, timeline } = req.body;

    // Validate freelancer profile exists
    const freelancerProfile = await FreelancerProfile.findById(freelancerId);
    if (!freelancerProfile) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    const booking = new Booking({
      client: req.user._id, // Client User ID - needs ClientProfile? 
      freelancer: freelancerId, // FreelancerProfile ID
      projectTitle,
      description,
      budget,
      timeline
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for freelancer
// @route   GET /api/bookings/freelancer/:freelancerId
// @access  Private
const getFreelancerBookings = async (req, res) => {
  try {
    const freelancerProfile = await FreelancerProfile.findOne({ user: req.params.freelancerId });
    if (!freelancerProfile) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    let bookings = await Booking.find({ freelancer: freelancerProfile._id })
      .populate('client', 'name email')
      .populate('freelancer', 'user skills projectRate')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch client profiles
    const clientIds = bookings.map(b => b.client._id);
    const clientProfiles = await ClientProfile.find({ user: { $in: clientIds } });
    
    bookings = bookings.map(b => {
      const p = clientProfiles.find(cp => cp.user.toString() === b.client._id.toString());
      b.clientProfile = p ? { profilePicture: p.profilePicture, companyName: p.companyName } : null;
      return b;
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private Freelancer
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if freelancer owns this booking request
    const freelancerProfile = await FreelancerProfile.findById(booking.freelancer);
    if (!freelancerProfile || freelancerProfile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for client
// @route   GET /api/bookings/client/:clientId
// @access  Private Client
const getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.params.clientId })
      .populate('client', 'name email')
      .populate({
        path: 'freelancer',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getFreelancerBookings,
  getClientBookings,
  updateBookingStatus
};
