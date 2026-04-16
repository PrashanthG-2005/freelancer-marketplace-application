const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  projectRate: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  portfolio: [{
    title: String,
    description: String,
    imageURL: String,
    link: String
  }],
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=6366f1&color=fff&size=128&bold=true'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FreelancerProfile', freelancerProfileSchema);
