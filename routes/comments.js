var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// NEW - comment form route
router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
    } else {
        res.render("comments/new", {campground: site});
    }
  })
});

// CREATE - comment route
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
          // add username to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          site.comments.push(comment);
          site.save();
          res.redirect("/campgrounds/" + site._id);
        }
      });
    }
  });
});

// EDIT - comment form route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
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
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
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
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(error) {
    if(error) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(error, foundComment) {
      if(error) {
        res.redirect("back");
      } else {
        // does the user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  } 
}

module.exports = router;