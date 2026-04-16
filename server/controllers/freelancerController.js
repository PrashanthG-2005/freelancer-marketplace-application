const FreelancerProfile = require('../models/FreelancerProfile');
const Freelancer = require('../models/Freelancer');
const User = require('../models/User');

// @desc    Get all freelancers
// @route   GET /api/freelancers
// @access  Public
const getFreelancers = async (req, res) => {
  try {
    const {
      skills,
      minRate,
      maxRate,
      minRating,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Skills filter
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    // Rate filter
    if (minRate || maxRate) {
      query.projectRate = {};
      if (minRate) query.projectRate.$gte = parseFloat(minRate);
      if (maxRate) query.projectRate.$lte = parseFloat(maxRate);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const freelancers = await FreelancerProfile.find(query)
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, completedProjects: -1 });

    const total = await FreelancerProfile.countDocuments(query);

    res.json({
      freelancers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single freelancer
// @route   GET /api/freelancers/:id
// @access  Public
const getFreelancer = async (req, res) => {
  try {
    const freelancer = await FreelancerProfile.findById(req.params.id)
      .populate('user', 'name email');

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update freelancer profile
// @route   PUT /api/freelancers/profile
// @access  Private (Freelancer)
const updateFreelancerProfile = async (req, res) => {
  try {
    const { name, ...profileData } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    const updatedProfile = await FreelancerProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileData },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email');

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current freelancer's own profile
// @route   GET /api/freelancers/me
// @access  Private Freelancer
const getMyProfile = async (req, res) => {
  try {
    let profile = await FreelancerProfile.findOne({ user: req.user._id })
      .populate('user', 'name email');
      
    if (!profile) {
      profile = await FreelancerProfile.create({ user: req.user._id, skills: [], projectRate: 0 });
      profile = await FreelancerProfile.findById(profile._id).populate('user', 'name email');
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFreelancers,
  getFreelancer,
  getMyProfile,
  updateFreelancerProfile
};
