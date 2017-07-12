var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// NEW - comment form route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
    } else {
        res.render("comments/new", {campground: site});
    }
  })
});

// CREATE - comment route
router.post("/", middleware.isLoggedIn, function(req, res) {
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
          // add username to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          site.comments.push(comment);
          site.save();
          req.flash("success", "Comment added");
          res.redirect("/campgrounds/" + site._id);
        }
      });
    }
  });
});

// EDIT - comment form route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  // look up campground using id
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, function(error, comment) {
        if(error) {
          console.log(error);
          res.redirect("/campgrounds");
        } else {
          res.render("comments/edit", {campground: site, comment: comment});         
        }
      });
    }
  });
});

// PUT - comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment) {
    if(error) {
      console.log(error);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE - comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(error) {
    if(error) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;