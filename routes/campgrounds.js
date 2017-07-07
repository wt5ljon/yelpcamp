var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// INDEX - Show all campgrounds
router.get("/", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        sites: allCampgrounds,
      });
    }
  });
});

// CREATE - Add new campground to the database
router.post("/", isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, image: image, description: description, author: author};
  // create a new campground and save to database
  Campground.create(newCampground, function(err, newObject) {
    if(err) {
      console.log(err);
    } else {
      console.log(newObject);
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Show the form to add new campground
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - Show detail about a single campground
router.get("/:id", function(req, res) {
  // find campground with 'id'
  Campground.findById(req.params.id).populate("comments").exec(function(error, result) {
    if(error) {
      console.log(error);
    } else {
      res.render("campgrounds/show", {campground: result});
    }
  });
});

// EDIT - campground route
router.get("/:id/edit", function (req, res) {
  Campground.findById(req.params.id, function(error, foundCampground) {
    if(error) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

// UPDATE - campground route
router.put("/:id", function(req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
    if(error) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  // redirect to show page
});

// DESTROY - campground route
router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(error) {
    if(error) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
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