var express = require('express');
var Account = require('./models/account');
var Note = require("./models/note");

module.exports = function(passport) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    if (req.isAuthenticated())
      res.redirect('/notes');
    else
      res.render('home', {'title': 'Basic Notes'});
  });
  
  router.get('/notes', function(req, res, next) {
    Note.find({owner: req.user.id}).exec(function(err, notes) {
      res.render('notes', {notes: notes});
    });
  });
  
  router.post('/notes', function(req, res, next) {
    var note = new Note({title: req.body.title, content: req.body.content, owner: req.user.id});
    note.save(function(err, note) {
        res.redirect('/notes');
      });
  });
  
  router.get('/notes/:id', function(req, res, next) {
    Note.findOne({_id: req.params.id}, function(err, note) {
      if (err) {
        return res.status(404);
      }
      res.render('edit_note', {note: note});
    });
  });
  
  router.post('/notes/:id', function(req, res, next) {
    Note.findOneAndUpdate({_id: req.params.id}, req.body, function(err, note) {
      if (err)
        return res.status(404);
      res.redirect('/notes');
    });
  });
  
  
  router.get('/new', function(req, res, next) {
    res.render('edit_note');
  });
  
  router.get('/about', function(req, res, next) {
    res.render('about', {'title': 'About'});
  });
  
  router.get('/account', function(req, res, next) {
    if (req.isAuthenticated)
      res.redirect('/account/' + req.user.username);
    else
      res.redirect('/login');
  });
  
  router.get('/account/:id', function(req, res, next) {
    Account.findOne({username: req.params.id}, function(err, user) {
      if (err)
        return res.status(404);
      res.render('account', user);
    });
  });
  
  router.get('/login', function(req, res, next) {
    res.render('login', {'title': 'Log In'});
  });
  
  router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login'})
  );
  
  router.get('/register', function(req, res, next) {
    res.render('register', {'title': "Register new account"});
  })
  
  router.post('/register', function(req, res, next) {
    Account.register(new Account({username: req.body.username, email: req.body.email}), req.body.password, function(err, account) {
      if (err) 
        return res.render('register', {account: account});
  
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    });
  });
  
  router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });
  
  return router;
}