var express = require('express');
var router = express.Router();



router.get('/', isAuthenticated, function(req, res, next) {

  var matricule   = req.session.user.matricule;
  var last_name  = req.session.user.last_name;
  var first_name  = req.session.user.first_name;
  
  res.render('user', { matricule: matricule, last_name: last_name, first_name: first_name });

});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  res.redirect('/login');
}

module.exports = router;