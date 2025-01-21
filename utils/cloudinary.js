const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // Folder in Cloudinary to store images
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Allowed file types
  }
});

// Initialize Multer with the Cloudinary storage
const upload = multer({ storage });

module.exports = { cloudinary, upload };
