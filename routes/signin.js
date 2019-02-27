var express = require('express');
var router = express.Router();

/* GET user information after login */

router.get('/', isAuthenticated, function(req, res, next) {

  res.render('signin');

});

function isAuthenticated(req, res, next) {
  if (!req.session.user)
      return next();

  // IF A USER IS LOGGED IN, THEN REDIRECT THEM TO DASHBOARD
  res.redirect('/dashboard');
}

module.exports = router;