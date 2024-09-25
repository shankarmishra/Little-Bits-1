const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospitals');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Route to register a hospital
router.post('/register', [
    body('hospitalname').notEmpty().withMessage('Hospital name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('phone').matches(/^\+?[0-9]{10,15}$/).withMessage('Please enter a valid contact number.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('register', { errors: errors.array() }); // Render the register page with errors
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create a new hospital instance
        const hospital = new Hospital({
            hospitalName: req.body.hospitalname,
            email: req.body.email,
            contactNumber: req.body.phone,
            address: req.body.address,
            verificationDocument: req.body.verification,
            password: hashedPassword 
        });

        // Save hospital to the database
        await hospital.save();
        
        // Redirect to the login page after successful registration
        res.render('../views/login'); // Change this to the actual login route

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error, please try again later.');
    }
});

// Route to log in a hospital
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            return res.status(401).send('Invalid credentials'); // More generic error
        }

        const match = await bcrypt.compare(password, hospital.password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        // Login successful, redirect or send a response as needed
        res.send('Logged in successfully');
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
