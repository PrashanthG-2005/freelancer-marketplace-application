const mongoose = require('mongoose');
const User = require('./User');

// Discriminator for Client
const ClientSchema = new mongoose.Schema({
  // Client specific fields will be added via profile schema
});

const Client = User.discriminator('Client', ClientSchema);

module.exports = Client;
