var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds');

// Remove all Campground DB entries
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {sites: allCampgrounds});
    }
  });
});

// CREATE - Add new campground to the database
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

// SHOW - Show detail about a single campground
app.get("/campgrounds/:id", function(req, res) {
  // find campground with 'id'
  Campground.findById(req.params.id).populate("comments").exec(function(error, result) {
    if(error) {
      console.log(error);
    } else {
      console.log(result);
      res.render("show", {campground: result});
    }
  });
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});