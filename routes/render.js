var express = require('express');
var router = express.Router();
const userauth = require('../middleware/userauth');


router.get('/', (req, res) => {
    res.render('../views/index.ejs')
})
// router.get('/error', function(req, res) {
//     res.render('error'); // Just specify the view name, no need for ../views
// });
router.get('/icon', function(req, res) {
    res.render('registered'); // Just specify the view name, no need for ../views
});

router.get('/listofhospital', function(req, res) {
    res.render('list-hospital'); // Just specify the view name, no need for ../views
});



// Route to render the registration page
router.get('/registered', function(req, res) {
    res.render('registered'); // Just specify the view name, no need for ../views
});

// Route to render the login page
router.get('/login', function(req, res) {
    res.render('login'); // Just specify the view name, no need for ../views
});

router.get('/index2' , userauth, (req, res) => {
    res.render('index2'); // Just specify the view name, no need for ../views
});
router.get('/details', userauth, (req, res) => {
    // Assuming you fetch this data from your database or another source
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

    // Render the details view and pass the hospital data
    res.render('details', hospitalData);
});

router.get('/doctor', userauth, (req, res) => {
    res.render('docters'); // Just specify the view name, no need for ../views
});
router.get('/inventory',userauth, function(req, res) {
    res.render('inventory'); // Just specify the view name, no need for ../views
});
router.get('/bloodbank', userauth,function(req, res) {
    res.render('bloodbank'); // Just specify the view name, no need for ../views
});

router.get('/successful', userauth, (req, res) =>  {
    res.render('successful'); // Just specify the view name, no need for ../views
});


module.exports = router;
