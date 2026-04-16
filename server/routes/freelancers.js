const express = require('express');
const { 
  getFreelancers, 
  getFreelancer, 
  getMyProfile,
  updateFreelancerProfile 
} = require('../controllers/freelancerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getFreelancers);
// IMPORTANT: /me must be declared before /:id
router.get('/me', protect, authorize('freelancer'), getMyProfile);
router.get('/:id', getFreelancer);

// Protected routes
router.put('/profile', protect, authorize('freelancer'), updateFreelancerProfile);

module.exports = router;
