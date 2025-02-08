require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactosRouter = require('./routes/contactos');
var authRouter = require('./routes/auth'); // Nueva ruta para autenticación
//kfifbfufbdid
var app = express();

// base de datos
const ContactosControler= require('./controllers/ContactosController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// google auth

// Configuración de la sesión
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

app.use(flash());

// Middleware para hacer mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());


const User_defind = process.env.USER_PREDEFINED;
const Pass_defind = process.env.PASS_PREDEFINED;

// local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === User_defind && password === Pass_defind) {
      return done(null, { username: User_defind });
    } else {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }
  }
));


passport.use(new GoogleStrategy({
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactos', contactosRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
