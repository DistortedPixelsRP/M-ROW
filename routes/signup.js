var express = require('express');
var router = express.Router();

/* GET user information after login */

router.get('/', isAuthenticated, function (req, res, next) {

    res.render('signup');

});


router.get('/checkmatricule', function (req, res, next) {
    if (availableMatricule(matricule)) {
        return true;
    }
    else {
        return false;
    }
});



function isAuthenticated(req, res, next) {
    if (!req.session.user)
        return next();

    // IF A USER IS LOGGED IN, THEN REDIRECT THEM TO DASHBOARD
    res.redirect('/dashboard');
}

module.exports = router;

function availableMatricule(matricule) {

    var sql = "SELECT count(*) AS number FROM users WHERE matricule = '" + matricule + "' ";

    con.query(sql, function (err, result) {

        if (err) throw err;

        if (result['number'] > 0) {

            return false;
        }
        else {
            
            return true;
        }


    });

}

function validKey(key1, key2, key3) {


    var sql = "SELECT count(*) AS number FROM users WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "' AND registered='1' ";

    con.query(sql, function (err, result) {

        if (err) throw err;

        if (result['number'] == 1) {

            return true;
        }
        else {
            return false;
        }

    });

}


function signUp(key1, key2, key3, matricule, password, last_name, first_name) {

    con.connect(function (err) {

        if (err) throw err;

        var sql = "UPDATE users SET registered='1', matricule ='" + matricule + "', password='" + password + "', last_name='" + last_name + "', first_name='" + first_name + "' WHERE key1 = '" + key1 + "' AND key2 = '" + key2 + "' AND key3 = '" + key3 + "' ";

        con.query(sql, function (err, result) {

            if (err) throw err;

            console.log(result.affectedRows + " record(s) updated");

        });

    });

}


module.exports = router;
