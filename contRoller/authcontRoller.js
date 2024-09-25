const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitals');

const JWT_SECRET = process.env.JWT_SECRET || 'heyyyy chachaa';

// Register Controller
const registerController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('register', { errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const hospital = new Hospital({
            hospitalName: req.body.hospitalname,
            email: req.body.email,
            contactNumber: req.body.phone,
            address: req.body.address,
            verificationDocument: req.file.path,  // Storing file path
            password: hashedPassword
        });

        await hospital.save();
        res.redirect('/login');  // Redirect to login after successful registration
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error, please try again later.');
    }
};

// Login Controller
const loginController = [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', { errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const hospital = await Hospital.findOne({ email });
            if (!hospital) {
                return res.status(401).render('login', { message: 'Invalid credentials' });
            }

            const match = await bcrypt.compare(password, hospital.password);
            if (!match) {
                return res.status(401).render('login', { message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: hospital._id, email: hospital.email },
                JWT_SECRET,
                { expiresIn: '10h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 60 * 1000  // 10 hours
            });

            res.send('succfull'); // Redirect to dashboard or some secure page
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
];

// Validation middleware for registration
const validateRegister = [
    body('hospitalname').notEmpty().withMessage('Hospital name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('phone').matches(/^\+?[0-9]{10,15}$/).withMessage('Please enter a valid contact number.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

module.exports = {
    registerController,
    validateRegister,
    loginController
};
