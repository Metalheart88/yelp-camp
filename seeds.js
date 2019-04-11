let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require("./models/comment");

let data = [
  {
    name: "Cloud's Rest",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?"
  },
  {
    name: "Mount's Top",
    image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?"
  },
  {
    name: "Hell's Mouth",
    image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
    description:
      "Cillum duis commodo quis qui cillum consequat amet deserunt amet aute laboris."
  }
];

function seedDB() {
  // remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log("error");
    } else {
      console.log("removed campgrounds");
    }
    // add a few campgrounds
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
          //create a comment
          Comment.create(
            {
              text: "This place is great but I wish there was internet!",
              author: "Greg"
            },
            function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created a comment");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
