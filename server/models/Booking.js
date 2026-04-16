const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelancerProfile',
    required: true
  },
  projectTitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },
  attachments: [String],
  messages: [{
    sender: String, // 'client' or 'freelancer'
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
