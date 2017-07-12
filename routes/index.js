var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// root route
router.get("/", function(req, res) {
  res.render("landing");
});

// show register form
router.get('/register', function(req, res) {
  res.render('register');
});

// process register form
router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(error, user) {
    if(error) {
      console.log(error);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});

// show login form
router.get('/login', function(req, res) {
  res.render('login');
});

// process login form
router.post('/login', passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

// process logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out");
  res.redirect("/campgrounds");
});

module.exports = router;