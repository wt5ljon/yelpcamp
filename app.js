var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountainside Knob", image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg"},
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountainside Knob", image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg"},
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
  {name: "Granite Hill", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
  {name: "Mountainside Knob", image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  res.render("campgrounds", {sites: campgrounds});
});

app.post("/campgrounds", function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});