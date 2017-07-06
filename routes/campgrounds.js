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
router.post("/", function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // create a new campground and save to database
  Campground.create(newCampground, function(err, newObject) {
    if(err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Show the form to add new campground
router.get("/new", function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - Show detail about a single campground
router.get("/:id", function(req, res) {
  // find campground with 'id'
  Campground.findById(req.params.id).populate("comments").exec(function(error, result) {
    if(error) {
      console.log(error);
    } else {
      console.log(result);
      res.render("campgrounds/show", {campground: result});
    }
  });
});

module.exports = router;