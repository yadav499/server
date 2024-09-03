const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');

// Route to handle image upload
router.post('/upload', imageController.uploadImage);

module.exports = router;
