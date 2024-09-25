var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.render('../views/registered.ejs')
})


// Route to render the registration page
router.get('/register', function(req, res, next) {
    res.render('registered'); // Just specify the view name, no need for ../views
});

// Route to render the login page
router.get('/login', function(req, res, next) {
    res.render('login'); // Just specify the view name, no need for ../views
});

module.exports = router;
