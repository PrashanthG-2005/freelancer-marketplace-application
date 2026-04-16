const mongoose = require('mongoose');
const User = require('./User');

// Discriminator for Freelancer
const FreelancerSchema = new mongoose.Schema({
  // Freelancer specific fields will be added via profile schema
});

const Freelancer = User.discriminator('Freelancer', FreelancerSchema);

module.exports = Freelancer;
