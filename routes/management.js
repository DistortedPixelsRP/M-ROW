var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconn');
var Handlebars = require('hbs');
var fs = require('fs');



router.get('/', isAuthenticated, function (req, res, next) {

  getUsers(function(rows){

    var template = fs.readFileSync('views/agents.hbs', 'utf8');

    Handlebars.registerPartial('agentsTable', template);

    res.render('management', {agents:rows});

  });

});


router.get('/newkey', isAuthenticated, function (req, res, next) {

  createKey(function (key1, key2, key3) {

    res.send({ key1: key1, key2: key2, key3: key3 });

  });

});


router.get('/removeKeys', isAuthenticated, function (req, res, next) {

  removeAllKeys(function (result) {

    res.send({ affectedRows: result });

  });

});


function isAuthenticated(req, res, next) {

  if (req.session.user)

    return next();

  res.redirect('/login');

}


function getUsers(cb){

  var sql = "SELECT * FROM users INNER JOIN ranks ON users.rank=ranks.id ORDER BY rank DESC";

  connection.query(sql, function (err, result) {

      if (err) throw err;

      cb(result);

  });

}

// Function creating a random string

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




// Function removing all keys from the database

function removeAllKeys(callback) {

  var sql = "DELETE FROM signup_keys";

  connection.query(sql, function (err, result) {

      if (err) throw err;

      callback(result.affectedRows);

  });

}



module.exports = router;