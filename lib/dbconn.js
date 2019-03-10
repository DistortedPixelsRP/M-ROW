const mysql        = require('mysql');
const connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : "localhost",
  user     : "root",
  password : "",
  database : "mrow_db"
});

module.exports = connection;
