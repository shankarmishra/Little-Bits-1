const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitals');
const HospitalDetails = require('../models/hospitals-details.js');
const Doctor = require('../models/docters-data');
const BloodBank = require('../models/bloodbank-db');
const JWT_SECRET = process.env.JWT_SECRET || 'heyyyy chachaa';

// Register Controller
const registerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('register', { errors: errors.array() });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const hospital = new Hospital({
            hospitalName: req.body.hospitalname,
            email: req.body.email,
            contactNumber: req.body.phone,
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode
            },
            verificationDocument: req.file ? req.file.path : null,
            password: hashedPassword
        });

        await hospital.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error, please try again later.' });
    }
};

// Login Controller
const loginController = [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),
    
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('login', { errors: errors.array() });
            }

            const { email, password } = req.body;

            const hospital = await Hospital.findOne({ email });
            if (!hospital) {
                return res.status(401).render('login', { message: 'Invalid credentials' });
            }

            const match = await bcrypt.compare(password, hospital.password);
            if (!match) {
                return res.status(401).render('login', { message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: hospital._id }, JWT_SECRET, { expiresIn: '10h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 60 * 1000
            });

            res.redirect('/index2');
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { message: 'Server error' });
        }
    }
];

// Validation middleware for registration
const validateRegister = [
    body('hospitalname').notEmpty().withMessage('Hospital name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('phone').matches(/^\+?[0-9]{10,15}$/).withMessage('Please enter a valid contact number.'),
    body('street').notEmpty().withMessage('Street address is required.'),
    body('city').notEmpty().withMessage('City is required.'),
    body('state').notEmpty().withMessage('State is required.'),
    body('zipcode').notEmpty().withMessage('Zip code is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

// Hospital Details Fetching
const hospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetails.find();
        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while fetching hospital details.' });
    }
};

// Hospital Details Controller
const hospitalDetailsController = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const hospitalId = decoded.id;

        const {
            bedsAvailable,
            bedsBooked,
            nurses,
            labs,
            icuBeds,
            icuBedsBooked,
            ventilators,
            oxygenUnits,
            ambulances,
            operatingRooms,
            emergencyRooms,
            pharmacies
        } = req.body;

        if (
            bedsAvailable === undefined || bedsBooked === undefined || nurses === undefined ||
            labs === undefined || icuBeds === undefined || icuBedsBooked === undefined ||
            ventilators === undefined || oxygenUnits === undefined || ambulances === undefined ||
            operatingRooms === undefined || emergencyRooms === undefined || pharmacies === undefined
        ) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        let hospitalDetails = await HospitalDetails.findOne({ hospitalId });

        if (hospitalDetails) {
            Object.assign(hospitalDetails, req.body);
        } else {
            hospitalDetails = new HospitalDetails({
                hospitalId,
                ...req.body
            });
        }

        await hospitalDetails.save();

        const updatedDetails = await HospitalDetails.findOne({ hospitalId });

        res.json({
            success: true,
            updatedDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while updating hospital details.' });
    }
};
const createDoctor = async (req, res) => {
    try {
        const { name, qualification, experience, specialization } = req.body;
        const hospitalId = req.user.id; // Assuming the hospital ID is stored in req.user.id after authentication

        if (!name || !qualification || !experience || !specialization) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newDoctor = new Doctor({
            name,
            qualification,
            experience,
            specialization,
            hospitalId
        });

        const savedDoctor = await newDoctor.save();

        res.status(201).send('Doctor created successfully');
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while creating doctor.' });
    }
};


const bloodBankDetails = async (req, res) => {
    try {
        const hospitalId = req.user.id; // Assuming the hospital ID is stored in req.user.id after authentication
        const { aPositive, aNegative, bPositive, bNegative, oPositive, oNegative, abPositive, abNegative } = req.body;

        // Validate input
        const bloodTypes = ['aPositive', 'aNegative', 'bPositive', 'bNegative', 'oPositive', 'oNegative', 'abPositive', 'abNegative'];
        for (const type of bloodTypes) {
            if (isNaN(req.body[type]) || req.body[type] < 0) {
                return res.status(400).json({ message: `Invalid value for ${type}. Must be a non-negative number.` });
            }
        }

        // Create or update blood bank details
        let bloodBank = await BloodBank.findOne({ hospitalId });

        if (bloodBank) {
            // Update existing blood bank details
            bloodBank.bloodUnits = {
                aPositive, aNegative, bPositive, bNegative, oPositive, oNegative, abPositive, abNegative
            };
            bloodBank.updatedAt = Date.now();
        } else {
            // Create new blood bank details
            bloodBank = new BloodBank({
                hospitalId,
                bloodUnits: {
                    aPositive, aNegative, bPositive, bNegative, oPositive, oNegative, abPositive, abNegative
                }
            });
        }

        const savedBloodBank = await bloodBank.save();
        
        res.status(200).json({ message: 'Blood bank details saved successfully', bloodBank: savedBloodBank });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error. Please check your input.', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error occurred while saving blood bank details.' });
    }
};

const listHospital = async (req, res) => {
    try {
        const hospitals = await Hospital.find().select('hospitalName email contactNumber address');
        res.json(hospitals);  // Send JSON response to the client
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ error: 'An error occurred while fetching hospitals.' });
    }
};






module.exports = {
    registerController,
    validateRegister,
    loginController,
    hospitalDetailsController, 
    hospitalDetails,
    createDoctor,
    bloodBankDetails,
    listHospital
};
