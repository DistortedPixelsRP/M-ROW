const express = require('express');
const router = express.Router();
const connection = require('../lib/dbconn');
const crypto = require('crypto');




router.get('/', isNotAuthenticated, function (req, res, next) {

    res.render('signup');

});

router.get('/reglement', isNotAuthenticated, function (req, res, next) {

    res.render('internalRulesPublic');

});


router.get('/checkmatricule/:matricule', function (req, res, next) {

    checkMatricule(req.params.matricule, function (result) {

        res.send({ result: result });

    });
    
});


router.post('/', isNotAuthenticated, function (req, res, next) {

    const key1 = req.body.key1;

    const key2 = req.body.key2;

    const key3 = req.body.key3;

    const matricule = req.body.matricule;

    const last_name = req.body.last_name;

    const first_name = req.body.first_name;

    const password = req.body.password;

    const password_confirm = req.body.password_confirm;

    const accepted_rules = req.body.accepted_rules;

    if (key1 && key2 && key3 && matricule && last_name && first_name && password && password_confirm) {

        if (accepted_rules) {

            checkKey(key1, key2, key3, function (valid) {

                if (valid) {

                    if (!isNaN(matricule) && matricule.length == 2) {

                        checkMatricule(matricule, function (available) {

                            if (available) {

                                if (password == password_confirm && password.length >= 8 && password.length <= 20) {

                                    const salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';

                                    const pwd = salt + '' + password;

                                    const encPassword = crypto.createHash('sha1').update(pwd).digest('hex');

                                    addUser(key1, key2, key3, matricule, encPassword, last_name, first_name, function (signup) {

                                        res.redirect('/login');

                                    });
                                }

                                else {

                                    res.render('signup', { error: true, errorMsg: "Les mots de passe ne correspondent pas ou ne sont pas valides." });
                                }

                            }

                            else {

                                res.render('signup', { error: true, errorMsg: "Le matricule n'est pas disponible." });
                            }

                        });

                    }

                    else {

                        res.render('signup', { error: true, errorMsg: "Le matricule n'est pas valide." });
                    }

                }

                else {

                    res.render('signup', { error: true, errorMsg: "La clef n'existe pas." });
                }

            });

        }

        else {

            res.render('signup', { error: true, errorMsg: "Veuillez accepter le réglement interieur" });
        }

    }

    else {

        res.render('signup', { error: true, errorMsg: "Veuillez remplir tous les champs." });
    }

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

    const passwordHashed = password;

    const sql = "INSERT INTO users (matricule, password, last_name, first_name) VALUES ('" + matricule + "', '" + passwordHashed + "', '" + lastName + "', '" + firstName + "')";

    connection.query(sql, function (err, result) {

        if (err) throw err;

        removeKey(key1, key2, key3);

        callback(true);

    });

}


// Function checking is a key exists in the database

function checkKey(key1, key2, key3, callback) {


    const sql = "SELECT count(*) AS number FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

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

    const sql = "SELECT count(*) AS number FROM users WHERE matricule = '" + matricule + "' ";

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

    const sql = "DELETE FROM signup_keys WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "'";

    connection.query(sql, function (err, result) {

        if (err) throw err;

    });

}




module.exports = router;