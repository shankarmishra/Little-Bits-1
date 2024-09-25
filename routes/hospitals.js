const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerController, validateRegister, loginController } = require('../contRoller/authcontRoller');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Register hospital route with file upload handling
router.post('/register', upload.single('verification'), validateRegister, registerController);

// Login route
router.post('/login', loginController);

module.exports = router;
