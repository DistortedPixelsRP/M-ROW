var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconn');

/* GET user information after login */

router.get('/', isNotAuthenticated, function (req, res, next) {

    res.render('signup');

});


router.post('/', isNotAuthenticated, function (req, res, next) {

    var key1 = req.body.key1;
    var key2 = req.body.key2;
    var key3 = req.body.key3;
    var matricule = req.body.matricule;
    var last_name = req.body.last_name;
    var first_name = req.body.first_name;
    var password = req.body.password;
    var password_confirm = req.body.password_confirm;
    var accepted_rules = req.body.accepted_rules;

    checkKey(key1, key2, key3, function (valid) {

        console.log("checkkey");

        if (valid) {

            console.log("checkkey valid");

            checkMatricule(matricule, function (available) {

                console.log("checkmatricule");

                if (available) {

                    console.log("checkmatricule valid");

                    console.log(password);
                    console.log(password_confirm);

                    if (password == password_confirm && password.length >= 8 && password.length <= 20) {

                        console.log ("password valid");

                        addUser(key1, key2, key3, matricule, password, last_name, first_name, function (signup) {
                            console.log("utilisateur inscrit");
                        });
                    }
                }

            });

        }

    });



    // Etape 1 : Check les données

    // Etape 2 : Inscrire le client

    // Etape 3 : Afficher le resultat
    res.render('signup');

});



router.get('/checkmatricule/:matricule', function (req, res, next) {
    checkMatricule(req.params.matricule, function (result) {
        res.send({ result: result });
    });
});



function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();

    res.redirect('/dashboard');
}

function isNotAuthenticated(req, res, next) {
    if (!req.session.user)
        return next();

    res.redirect('/dashboard');
}








// Function signing an user up in the database

function addUser(key1, key2, key3, matricule, password, lastName, firstName, callback) {

    let passwordHashed = password;

    var sql = "INSERT INTO users (matricule, password, last_name, first_name) VALUES ('" + matricule + "', '" + passwordHashed + "', '" + lastName + "', '" + firstName + "')";

    connection.query(sql, function (err, result) {

        if (err) throw err;

        removeKey(key1, key2, key3);

        callback(true);

    });

}







// Function checking is a key exists in the database

function checkKey(key1, key2, key3, callback) {


    var sql = "SELECT count(*) AS number FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

    connection.query(sql, function (err, result) {

        if (err) throw err;

        if (result[0]['number'] > 0) {

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

        if (parseInt(result[0]['number']) > 0) {

            callback(false);
        }

        else {

            callback(true);
        }


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


