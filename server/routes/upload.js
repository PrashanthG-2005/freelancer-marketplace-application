const express = require('express');
const { upload } = require('../config/cloudinary');
const { uploadProfilePicture } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// protect middleware ensures only logged in users can upload
router.post('/', protect, upload.single('image'), uploadProfilePicture);

module.exports = router;
