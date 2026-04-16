const express = require('express');
const { getMyProfile, updateClientProfile } = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, authorize('client'), getMyProfile);
router.put('/profile', protect, authorize('client'), updateClientProfile);

module.exports = router;
