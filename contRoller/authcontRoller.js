const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitals'); // Ensure this is correct
const HospitalDetails = require('../models/hospitals-details.js');

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
        res.status(500).render('error', { message: 'Server error, please try again later.' }); // Render error view
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

            const token = jwt.sign({ id: hospital._id }, JWT_SECRET, { expiresIn: '10h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 60 * 1000  // 10 hours
            });

            res.redirect('/index2'); // Redirect to dashboard

        } catch (error) {
            console.error(error.message);
            res.status(500).render('error', { message: 'Server error' }); // Render error view
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

// Hospital Details Fetching
const hospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetails.find();
        res.json(details); // Send details back as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error' }); // Render error view
    }
};

// Hospital Details Controller
// Hospital Details Controller
const hospitalDetailsController = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
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

        // Log the request body to debug incoming data
        console.log(req.body);

        // Check for both undefined and empty values
        if (
            (!bedsAvailable && bedsAvailable !== 0) || (!bedsBooked && bedsBooked !== 0) || (!nurses && nurses !== 0) ||
            (!labs && labs !== 0) || (!icuBeds && icuBeds !== 0) || (!icuBedsBooked && icuBedsBooked !== 0) ||
            (!ventilators && ventilators !== 0) || (!oxygenUnits && oxygenUnits !== 0) || (!ambulances && ambulances !== 0) ||
            (!operatingRooms && operatingRooms !== 0) || (!emergencyRooms && emergencyRooms !== 0) || (!pharmacies && pharmacies !== 0)
        ) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        let hospitalDetails = await HospitalDetails.findOne({ hospitalId });

        if (hospitalDetails) {
            // Update existing details
            hospitalDetails.bedsAvailable = bedsAvailable;
            hospitalDetails.bedsBooked = bedsBooked;
            hospitalDetails.nurses = nurses;
            hospitalDetails.labs = labs;
            hospitalDetails.icuBeds = icuBeds;
            hospitalDetails.icuBedsBooked = icuBedsBooked;
            hospitalDetails.ventilators = ventilators;
            hospitalDetails.oxygenUnits = oxygenUnits;
            hospitalDetails.ambulances = ambulances;
            hospitalDetails.operatingRooms = operatingRooms;
            hospitalDetails.emergencyRooms = emergencyRooms;
            hospitalDetails.pharmacies = pharmacies;
        } else {
            // Create new hospital details if not found
            hospitalDetails = new HospitalDetails({
                hospitalId,
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
            });
        }

        await hospitalDetails.save();
        res.redirect('/successful');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred while updating hospital details.' });
    }
};




module.exports = {
    registerController,
    validateRegister,
    loginController,
    hospitalDetailsController, 
    hospitalDetails
};

