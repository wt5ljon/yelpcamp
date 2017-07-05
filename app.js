var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require('passport'),
    localStrategy = require('passport-local'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    seedDB      = require('./seeds');

// Remove all Campground DB entries
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Passport configuration
app.use(require('express-session')({
  secret: "It's a trap and a mad mad world",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

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
      res.render("campgrounds/index", {
        sites: allCampgrounds,
      });
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
  res.render("campgrounds/new");
});

// SHOW - Show detail about a single campground
app.get("/campgrounds/:id", function(req, res) {
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

// Add new comments route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(error, site) {
    if(error) {
      console.log(error);
    } else {
        res.render("comments/new", {campground: site});
    }
  })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

// Auth Routes

// show register form
app.get('/register', function(req, res) {
  res.render('register');
});

// process sign up form
app.post('/register', function(req, res) {
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
app.get('/login', function(req, res) {
  res.render('login');
});

// process login form
app.post('/login', passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

// process logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, function() {
  console.log("Listening on port 3000");
});