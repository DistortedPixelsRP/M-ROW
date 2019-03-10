const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



const index = require('./routes/index');
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
const management = require('./routes/management');
const signup = require('./routes/signup');
const database = require('./routes/database');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//login script from here

const flash = require('connect-flash');
const crypto = require('crypto');
/* Login script */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./lib/dbconn');

const sess = require('express-session');
const Store = require('express-session').Store
const BetterMemoryStore = require(__dirname + '/memory')
const store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

var sessionMiddleware = sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store: store,
  resave: true,
  saveUninitialized: true
});

app.use(sessionMiddleware);


// socket io 
const server = require('http').Server(app);
const io = require('socket.io')(server);
const passportSocketIo = require("passport.socketio");
io.use(function (socket, next) {
  sessionMiddleware(socket.request, {}, next);
});


server.listen(8000);

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
app.use('/dashboard', dashboard, function (connectedUsers) {
  module.exports.connectedUsers;
});
app.use('/management', management);
app.use('/signup', signup);
app.use('/database', database);

//passport Strategy -- the express session middleware before calling passport.session()
passport.use('local', new LocalStrategy({
  usernameField: 'matricule',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
}, function (req, matricule, password, done) {
  if (!matricule || !password) { return done(null, false, req.flash('message', 'Tous les champs ne sont pas remplis')); }
  const salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
  connection.query("select * from users where matricule = ?", [matricule], function (err, rows) {
    console.log(err);
    if (err) return done(req.flash('message', err));

    if (!rows.length) { return done(null, false, req.flash('message', 'Matricule ou mot de passe invalide.')); }
    salt = salt + '' + password;
    const encPassword = crypto.createHash('sha1').update(salt).digest('hex');
    const dbPassword = rows[0].password;

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
  successRedirect: '/dashboard',
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
  const err = new Error('Not Found');
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

// Gestion du temps réel

var alert_level = "green";
var orders = "Il n'y a pas d'ordre actuellement.";
var connectedUsers = [];
exports.users = connectedUsers;
console.log(connectedUsers);

io.on('connection', function (socket) {
  var hasPermission = false;
  if (socket.request.session.user) {

    var user = {
      matricule: socket.request.session.user.matricule,
      rank: socket.request.session.user.rank,
      last_name: socket.request.session.user.last_name,
      status: 'Hors-service'
    }
    connectedUsers.push(user);
    console.log(connectedUsers);
    socket.emit("connectedUsers", connectedUsers);

    if (socket.request.session.user.rank >= 3) {
      hasPermission = true;
    }

    socket.emit("alert-level", alert_level);
    socket.emit("orders", orders);
  }

  socket.on("alert-level", function (data) {
    if (hasPermission) {
      console.log("Le niveau d'alerte passe à: " + data);
      alert_level = data;
      io.sockets.emit('alert-level', data);
    }
    else {
      console.log("not connected"); rs
    }
  });

  socket.on("orders", function (data) {
    if (hasPermission) {
      orders = data;
      io.sockets.emit('orders', data);
    }
  });


  socket.on("service", function (data) {
    for (let i = 0; i < connectedUsers.length; i++) {
      if(connectedUsers[i].matricule==socket.request.session.user.matricule) {
        connectedUsers[i].status = data;
      }
    }
  });


  socket.on("disconnect", function () {

    for (let i = 0; i < connectedUsers.length; i++) {

      if (connectedUsers[i].matricule == socket.request.session.user.matricule) {
        connectedUsers.splice(i, 1);
        console.log(connectedUsers);
      }

    }
    //console.log(connectedUsers);
    // supprimer de la liste
    // envoie à tout le monde la nouvelle liste
  });
});


module.exports = app;