var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var management = require('./routes/management');
var signup = require('./routes/signup');
var database = require('./routes/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//login script from here

var flash = require('connect-flash');
var crypto = require('crypto');
/* Login script */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('./lib/dbconn');

var sess = require('express-session');
var Store = require('express-session').Store
var BetterMemoryStore = require(__dirname + '/memory')
var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true })
app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store: store,
  resave: true,
  saveUninitialized: true
}));

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/management', management);
app.use('/signup', signup);
app.use('/database', database);

//passport Strategy -- the express session middleware before calling passport.session()
passport.use('local', new LocalStrategy({
  usernameField: 'matricule',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
}, function (req, matricule, password, done) {
  console.log(matricule + ' = ' + password);
  if (!matricule || !password) { return done(null, false, req.flash('message', 'Tous les champs ne sont pas remplis')); }
  var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
  connection.query("select * from users where matricule = ?", [matricule], function (err, rows) {
    console.log(err);
    if (err) return done(req.flash('message', err));

    if (!rows.length) { return done(null, false, req.flash('message', 'Matricule ou mot de passe invalide.')); }
    salt = salt + '' + password;
    var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
    var dbPassword = rows[0].password;

    if (!(dbPassword == encPassword)) {
      return done(null, false, req.flash('message', 'Matricule ou mot de passe invalide.'));
    }
    req.session.user = rows[0];
    return done(null, rows[0]);
  });
}
));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  connection.query("select * from users where id = " + id, function (err, rows) {
    done(err, rows[0]);
  });
});

app.get('/login', function (req, res) {
  res.render('login/index', { 'message': req.flash('message') });
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/management',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res, info) {
  res.render('login/index', { 'message': req.flash('message') });
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
