const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

// Root Route
router.get("/", function(req, res) {
  res.render("landing");
});

//show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", (req, res) => {
  res.render("login");
});
// handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
