const express = require('express');
const router = express.Router();
const connection = require('../lib/dbconn');
const Handlebars = require('hbs');
const fs = require('fs');



router.get('/directory', isAuthenticated, function (req, res, next) {

    getDirectory(function (result) {

        const template = fs.readFileSync('views/directoryTable.hbs', 'utf8');

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

    const sql = "SELECT * FROM directory ORDER BY last_name ASC";

    connection.query(sql, function (err, result) {

        if (err) throw err;

        cb(result);

    });
    
}



module.exports = router;