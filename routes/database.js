var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconn');
var Handlebars = require('hbs');
var fs = require('fs');



router.get('/directory', isAuthenticated, function (req, res, next) {

    getDirectory(function (result) {

        var template = fs.readFileSync('views/directoryTable.hbs', 'utf8');

        Handlebars.registerPartial('directoryTable', template);

        res.render('directory', { directory: result });

    });

});


// function checking if the user is authenticated

function isAuthenticated(req, res, next) {

    if (req.session.user)

        return next();

    res.redirect('/login');
}

function getDirectory(cb) {

    var sql = "SELECT * FROM directory";

    connection.query(sql, function (err, result) {

        if (err) throw err;

        cb(result);

    });
    
}



module.exports = router;