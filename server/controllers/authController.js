const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FreelancerProfile = require('../models/FreelancerProfile');
const ClientProfile = require('../models/ClientProfile');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, ...roleSpecificData } = req.body;

    // Validate role
    if (!['freelancer', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create base user first
    const user = new User({
      name,
      email,
      password,
      role
    });
    await user.save();

    // Create profile
    if (role === 'freelancer') {
      await new (require('../models/FreelancerProfile'))({
        user: user._id,
        skills: roleSpecificData.skills || [],
        projectRate: roleSpecificData.projectRate || 0,
        bio: roleSpecificData.bio || ''
      }).save();
    } else {
      await new (require('../models/ClientProfile'))({
        user: user._id,
        companyName: roleSpecificData.companyName || ''
      }).save();
    }

    // Fetch profile picture from the role-specific profile document
    let profilePicture = null;
    if (role === 'freelancer') {
      const profile = await FreelancerProfile.findOne({ user: user._id });
      profilePicture = profile?.profilePicture || null;
    } else {
      const profile = await ClientProfile.findOne({ user: user._id });
      profilePicture = profile?.profilePicture || null;
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.comparePassword(password))) {
      // Fetch profile picture from the role-specific profile document
      let profilePicture = null;
      if (user.role === 'freelancer') {
        const profile = await FreelancerProfile.findOne({ user: user._id });
        profilePicture = profile?.profilePicture || null;
      } else {
        const profile = await ClientProfile.findOne({ user: user._id });
        profilePicture = profile?.profilePicture || null;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged-in user (with profilePicture)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user; // set by protect middleware
    let profilePicture = null;
    if (user.role === 'freelancer') {
      const profile = await FreelancerProfile.findOne({ user: user._id });
      profilePicture = profile?.profilePicture || null;
    } else {
      const profile = await ClientProfile.findOne({ user: user._id });
      profilePicture = profile?.profilePicture || null;
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
