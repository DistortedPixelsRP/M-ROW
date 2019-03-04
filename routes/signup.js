var express = require('express');
var router = express.Router();

/* GET user information after login */

router.get('/', isAuthenticated, function (req, res, next) {

    res.render('signup');

});


router.get('/checkmatricule/:matricule', function (req, res, next) {
    console.log(req.params.matricule);
    checkMatricule(req.params.matricule, function (result) {
        console.log(result);
        res.send({ result : result });
    });
});



function isAuthenticated(req, res, next) {
    if (!req.session.user)
        return next();

    res.redirect('/dashboard');
}







// Function signing an user up in the database

function addUser(key1, key2, key3, matricule, password, lastName, firstName, callback) {

    checkKey(key1, key2, key3, function (isValid) {

        if (isValid) {

            let passwordHashed = password;

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

        /*if (result['number'] > 0) {

            callback(false);
        }

        else {

            callback(true);
        }*/

        console.log(result);


    });

}

// Function removing a key from the database

function removeKey(key1, key2, key3) {

    var sql = "DELETE FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

    connection.query(sql, function (err, result) {

        if (err) throw err;

    });

}




module.exports = router;
