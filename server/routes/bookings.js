const express = require('express');
const { 
  createBooking, 
  getFreelancerBookings, 
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Create booking (Client only)
router.post('/', protect, authorize('client'), createBooking);

// Get freelancer's bookings
router.get('/freelancer/:freelancerId', protect, getFreelancerBookings);

// Get client's bookings
router.get('/client/:clientId', protect, authorize('client'), require('../controllers/bookingController').getClientBookings);

// Update booking status (Freelancer only)
router.patch('/:id/status', protect, authorize('freelancer'), updateBookingStatus);

module.exports = router;
