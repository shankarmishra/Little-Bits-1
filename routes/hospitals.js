const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerController, validateRegister, loginController, hospitalDetailsController, hospitalDetails } = require('../contRoller/authcontRoller');
const userauth = require('../middleware/userauth');


const JWT_SECRET = process.env.JWT_SECRET || 'heyyyy chachaa';
// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Register hospital route with file upload handling
router.post('/register', upload.single('verification'), validateRegister, registerController);

// Login route
router.post('/login', loginController);



// Get Hospital Data (Protected Route)
router.get('/hospital-details', userauth, hospitalDetails);

// Add or Update Hospital Data (Protected Route)
router.post('/hospital-details', userauth, hospitalDetailsController);




module.exports = router;
