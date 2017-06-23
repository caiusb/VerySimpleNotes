const express = require('express');
const handlebars = require('handlebars');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

//app.use(require('serve-static')(__dirname + '/../../public'));
//app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));
const session = require('express-session');
const connectMongo = require("connect-mongo")(session);
app.use(session({
  secret: 'deep purple',
  resave: true,
  saveUninitialized: true,
  store: new connectMongo({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  if (req.isAuthenticated())
    res.locals.username = req.user.username;
  next();
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    next();
  else
    res.redirect("/login");
}

app.use("/account", isAuthenticated)
app.use("/notes", isAuthenticated)

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'default.hbs'}));
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'hbs');

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var mongoHost = (process.env.IP || '0.0.0.0')
var mongoURI = process.env.MONGODB_URI || ('mongodb://' + mongoHost + '/test');
mongoose.connect(mongoURI);

var routes = require('./routes')(passport);
app.use('/', routes);

var port = (process.env.PORT || 3000);
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
