const express = require('express');
const router = express.Router();
const userauth = require('../middleware/userauth');
const Hospital = require('../models/hospitals');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/icon', (req, res) => {
    res.render('registered');
});

router.get('/listofhospitals', userauth, async(req, res) => {
    const hospitals = await Hospital.find().select('hospitalName email contactNumber address');
    res.render('listhospital',{hospitals});
});


router.get('/register', (req, res) => {
    res.render('registered');
});

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.get('/index2', userauth, (req, res) => {
    res.render('index2');
});

router.get('/details', userauth, (req, res) => {
    const hospitalData = {
        bedsAvailable: 0,
        bedsBooked: 0,
        nurses: 0,
        labs: 0,
        icuBeds: 0,
        icuBedsBooked: 0,
        ventilators: 0,
        oxygenUnits: 0,
        ambulances: 0,
        operatingRooms: 0,
        emergencyRooms: 0,
        pharmacies: 0
    };

    res.render('details', hospitalData);
});

router.get('/docters', userauth, (req, res) => {
    res.render('docters');
});

router.get('/inventory', userauth, (req, res) => {
    res.render('inventory');
});

router.get('/bloodbank', userauth, (req, res) => {
    res.render('bloodbank');
});

router.get('/successful', userauth, (req, res) => {
    res.render('successful');
});

module.exports = router;
