var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconn');


/* GET user information after login */

router.get('/', isAuthenticated, function (req, res, next) {

  res.render('management');

});

router.get('/newkey', isAuthenticated, function (req, res, next) {

  createKey(function (key1, key2, key3) {
    res.send({ key1: key1, key2: key2, key3: key3 });
  });


});



function isAuthenticated(req, res, next) {
  if (req.session.user)
    return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/signin');
}










// Function  creating a random string

function randomString(len, an) {

  an = an && an.toLowerCase();

  var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;

  for (; i++ < len;) {

      var r = Math.random() * (max - min) + min << 0;

      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);

  }

  return str;

}




// Function creating and storing a random signup key to the database

function createKey(callback) {

  var key1 = randomString(4, 'N');

  var key2 = randomString(4, 'A');

  var key3 = randomString(4, 'N');


  var sql = "INSERT INTO signup_keys (key1, key2, key3) VALUES ('" + key1 + "','" + key2 + "','" + key3 + "')";

  connection.query(sql, function (err, result) {

      if (err) throw err;

      callback(key1, key2, key3);

  });

}




// Function removing a key from the database

function removeKey(key1, key2, key3, callback) {

  var sql = "DELETE FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

  connection.query(sql, function (err, result) {

      if (err) throw err;

  });

}




// Function signing an user up in the database

function addUser(key1, key2, key3, matricule, password, lastName, firstName, callback) {

  checkKey(key1, key2, key3, function(isValid) {

      if(isValid) {

          let passwordHashed = bcrypt.hashSync(password);

          var sql = "INSERT INTO users (matricule, password, last_name, first_name) VALUES ('" + matricule + "', '" + passwordHashed + "', '" + lastName + "', '" + firstName + "')";

          connection.query(sql, function (err, result) {

              if (err) throw err;

              removeKey(key1, key2, key3);

              callback(true);

          });

      }
      else {

          callback(false);

      }

  });

}





// Function checking is a key exists in the database

function checkKey(key1, key2, key3, callback) {


  var sql = "SELECT count(*) AS number FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

  connection.query(sql, function (err, result) {

      if (err) throw err;

      if (result['number'] > 0) {

          callback(true);
      }

      else {

          callback(false);

      }

  });

}




// Function checking if a matricule is already used

function checkMatricule(matricule, callback) {

  var sql = "SELECT count(*) AS number FROM users WHERE matricule = '" + matricule + "' ";

  connection.query(sql, function (err, result) {

      if (err) throw err;

      if (result['number'] > 0) {

          callback(false);
      }

      else {

          callback(true);
      }


  });

}

module.exports = router;


