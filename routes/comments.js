const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

const router = express.Router({ mergeParams: true });

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  //Find Campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log("error");
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  //lookup campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Your comment has been added");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        return res.redirect("back");
      }
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        err
          ? res.redirect("back")
          : res.render("comments/edit", {
              campground_id: req.params.id,
              comment: foundComment
            });
      });
    });
  }
);

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      err
        ? res.redirect("back")
        : (req.flash("success", "Comment updated"),
          res.redirect("/campgrounds/" + req.params.id));
    }
  );
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    err
      ? (req.flash("error", "You don't have access to do that"),
        res.redirect("back"))
      : (req.flash("success", "Comment deleted"),
        res.redirect("/campgrounds/" + req.params.id));
  });
});

module.exports = router;
