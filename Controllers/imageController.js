const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid name conflicts
  }
});

const upload = multer({ storage });

// Handle file upload and return URL
exports.uploadImage = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).send('Error uploading file.');
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
};
