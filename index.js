const express = require('express');
const passport = require('passport');
const handlebars = require('handlebars');
const expressHbs = require('express-handlebars');
const app = express();

//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'default.hbs'}));
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'hbs');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get('/', function (req, res, next) {
  res.render('home', {'title': 'Basic ToDo'});
})

app.get('/about', function(req, res, next) {
  res.render('about', {'title': 'About'});
})

app.get('/login', function(req, res, next) {
  res.render('login', {'title': 'Log In'})
})

app.get('/register', function(req, res, next) {
  res.render('register', {'title': "Register new account"})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
