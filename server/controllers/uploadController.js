const { isCloudinaryConfigured } = require('../config/cloudinary');

// @desc    Upload profile picture
// @route   POST /api/upload
// @access  Private
const uploadProfilePicture = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Cloudinary URL is in req.file.path
    // Local path is also in req.file.path (e.g. 'uploads/filename.jpg')
    let url = req.file.path;
    
    // If local, prepend the server URL
    if (!isCloudinaryConfigured) {
      // Normalize path for web (replace backslashes if on windows)
      const normalizedPath = req.file.path.replace(/\\/g, '/');
      url = `${req.protocol}://${req.get('host')}/${normalizedPath}`;
    }

    res.json({
      message: 'Image uploaded successfully',
      url: url
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadProfilePicture
};
