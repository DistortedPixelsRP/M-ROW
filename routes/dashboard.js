var express = require('express');
var router = express.Router();
var app = require("../app");




// Redirecting user to the dashboard if he is authenticated

router.get('/', isAuthenticated, function(req, res, next) {
  res.render('dashboard', { user: app.users });
});


// function checking if the user is authenticated

function isAuthenticated(req, res, next) {

  if (req.session.user)

      return next();

  res.redirect('/login');
}



module.exports = router;