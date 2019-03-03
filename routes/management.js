var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconn');

/* GET user information after login */

router.get('/', isAuthenticated, function(req, res, next) {
  
  res.render('management');

});

router.get('/newkeyasked', isAuthenticated, function(req, res, next) {

    var rank  = req.session.user.rank;

    if(rank>5) {
      console.log("rang ok");
        newUserKey(function (key1, key2, key3) {
            res.send({key1: key1, key2: key2, key3: key3});
        
        });
    }
    else {
      console.log("rang trop bas");
    }

});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/signin');
}



// Generating random keys

function randomString(len, an) {

    an = an && an.toLowerCase();
  
    var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
  
    for (; i++ < len;) {
  
      var r = Math.random() * (max - min) + min << 0;
  
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  
    }
  
    return str;
  
  }
  
  
  
  // Create and insert a random key in the database
  
  function newUserKey(cb) {

    var key1 = randomString(4, 'N');
    var key2 = randomString(4, 'A');
    var key3 = randomString(4, 'N');
  
  
      var sql = "INSERT INTO users (key1, key2, key3) VALUES ('" + key1 + "','" + key2 + "','" + key3 + "')";
  
      connection.query(sql, function (err, result) {
  
        if (err) throw err;
  
        console.log("¤ SQL : Nouvelle clef utilisateur créée");
  
        cb(key1, key2, key3);
  
        });
  
  }

module.exports = router;


