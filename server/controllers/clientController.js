const ClientProfile = require('../models/ClientProfile');
const Client = require('../models/Client');
const User = require('../models/User');

// @desc    Get current client's own profile
// @route   GET /api/clients/me
// @access  Private (Client)
const getMyProfile = async (req, res) => {
  try {
    let profile = await ClientProfile.findOne({ user: req.user._id })
      .populate('user', 'name email');
    
    if (!profile) {
      // Create empty profile if not found
      profile = await ClientProfile.create({ user: req.user._id });
      profile = await ClientProfile.findById(profile._id).populate('user', 'name email');
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update client profile
// @route   PUT /api/clients/profile
// @access  Private (Client)
const updateClientProfile = async (req, res) => {
  try {
    const { name, ...profileData } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    const updatedProfile = await ClientProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileData },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email');

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateClientProfile
};
