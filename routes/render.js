var express = require('express');
var router = express.Router();


/*router.get('/', function(req, res, next) {
  res.render('');
})*/
router.get('/register', function(req, res, next) {
    res.render('../views/registered.ejs');
  })
  router.get('/logins', function(req, res, next) {
    res.render('../views/login.ejs');
  })

module.exports = router;