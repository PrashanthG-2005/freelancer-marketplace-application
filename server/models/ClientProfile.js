const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    trim: true
  },
  projectHistory: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    title: String,
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FreelancerProfile'
    },
    status: String,
    completedAt: Date
  }],
  totalSpent: {
    type: Number,
    default: 0
  },
  preferences: [{
    skill: String,
    budgetRange: [Number]
  }],
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&size=128&bold=true'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClientProfile', clientProfileSchema);
