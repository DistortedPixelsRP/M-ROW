const express = require('express');
const router = express.Router();



router.get('/', isAuthenticated, function(req, res, next) {

  const matricule   = req.session.user.matricule;
  const last_name  = req.session.user.last_name;
  const first_name  = req.session.user.first_name;
  
  res.render('user', { matricule: matricule, last_name: last_name, first_name: first_name });

});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  res.redirect('/login');
}

module.exports = router;
