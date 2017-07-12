var middlewareObj = {};
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// all middleware goes here

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect('/login');
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(error, foundComment) {
      if(error) {
        res.redirect("back");
      } else {
        // does the user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  } 
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, function(error, foundCampground) {
      if(error) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // does the user own the campground?
        if(foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  } 
}

module.exports = middlewareObj;