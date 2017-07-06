var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// new comments route
router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
    } else {
        res.render("comments/new", {campground: site});
    }
  })
});

// create comments route
router.post("/", isLoggedIn, function(req, res) {
  // look up campground using id
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(error, comment) {
        if(error) {
          console.log(error);
        } else {
          site.comments.push(comment);
          site.save();
          res.redirect("/campgrounds/" + site._id);
        }
      });
    }
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;