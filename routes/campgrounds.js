const express = require("express");
const Campground = require("../models/campground");
const router = express.Router();
const middleware = require("../middleware");

router.get("/", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) =>
    err
      ? console.log(err)
      : res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          currentUser: req.user
        })
  );
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  let price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) =>
    err ? console.log(err) : res.redirect("/campgrounds")
  );
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  //find and update the correct campground
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      //redirect somewhere(show page)
      err
        ? res.redirect("/campgrounds")
        : res.redirect("/campgrounds/" + req.params.id);
    }
  );
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    err ? res.redirect("/campgrounds") : res.redirect("/campgrounds");
  });
});

module.exports = router;
