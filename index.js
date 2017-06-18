const express = require('express');
const handlebars = require('handlebars');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  if (req.isAuthenticated())
    res.locals.username = req.user.username;
  next();
})

app.use("/account", function(req, res, next) {
  if (req.isAuthenticated())
    next()
  else
    res.redirect("/login")
})

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'default.hbs'}));
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'hbs');

var Account = require('./models/account')
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

app.get('/', function (req, res, next) {
  res.render('home', {'title': 'Basic ToDo', 'user': req.user});
})

app.get('/about', function(req, res, next) {
  res.render('about', {'title': 'About', 'user': req.user});
})

app.get('/account', function(req, res, next) {
  if (req.isAuthenticated)
    res.redirect('/account/' + req.user.username);
  else
    res.redirect('/login');
});

app.get('/account/:id', function(req, res, next) {
  Account.findOne({username: req.params.id}, function(err, user) {
    if (err) {
      return res.status(404);
    }
    console.log(user);
    res.render('account', user);
  })
});

app.get('/login', function(req, res, next) {
  res.render('login', {'title': 'Log In'})
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',})
);

app.get('/register', function(req, res, next) {
  res.render('register', {'title': "Register new account"})
})

app.post('/register', function(req, res, next) {
  console.log(req.body)
  Account.register(new Account({username: req.body.username, email: req.body.email}), req.body.password, function(err, account) {
    if (err) {
      console.log(err)
      return res.render('register', {account: account});
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    })
  })
})

app.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
