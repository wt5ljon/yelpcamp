var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm3.staticflickr.com/2208/32976191122_df805aaf3e.jpg",
    description: "Aliquam elit turpis, auctor id viverra eu, finibus et nibh. Vivamus hendrerit fringilla massa at suscipit. Quisque eu urna lacus. Duis faucibus eros sed lectus suscipit viverra. Maecenas ullamcorper metus at risus egestas rutrum. Sed ut pharetra nunc. Maecenas sed dignissim urna. In posuere orci ut lectus fringilla aliquam. Integer posuere id ex luctus mollis. Suspendisse sagittis nec nisi quis suscipit. Sed feugiat varius augue. "
  },
  {
    name: "Heavens Above",
    image: "https://farm5.staticflickr.com/4186/34533123406_bdc5eeca24.jpg",
    description: "Aliquam elit turpis, auctor id viverra eu, finibus et nibh. Vivamus hendrerit fringilla massa at suscipit. Quisque eu urna lacus. Duis faucibus eros sed lectus suscipit viverra. Maecenas ullamcorper metus at risus egestas rutrum. Sed ut pharetra nunc. Maecenas sed dignissim urna. In posuere orci ut lectus fringilla aliquam. Integer posuere id ex luctus mollis. Suspendisse sagittis nec nisi quis suscipit. Sed feugiat varius augue. "
  },
  {
    name: "Trees Galore",
    image: "https://farm1.staticflickr.com/30/95575790_e790a31900.jpg",
    description: "Aliquam elit turpis, auctor id viverra eu, finibus et nibh. Vivamus hendrerit fringilla massa at suscipit. Quisque eu urna lacus. Duis faucibus eros sed lectus suscipit viverra. Maecenas ullamcorper metus at risus egestas rutrum. Sed ut pharetra nunc. Maecenas sed dignissim urna. In posuere orci ut lectus fringilla aliquam. Integer posuere id ex luctus mollis. Suspendisse sagittis nec nisi quis suscipit. Sed feugiat varius augue. "
  },
  {
    name: "Mountain Vistas",
    image: "https://farm9.staticflickr.com/8294/7777868526_882af8ae41.jpg",
    description: "Aliquam elit turpis, auctor id viverra eu, finibus et nibh. Vivamus hendrerit fringilla massa at suscipit. Quisque eu urna lacus. Duis faucibus eros sed lectus suscipit viverra. Maecenas ullamcorper metus at risus egestas rutrum. Sed ut pharetra nunc. Maecenas sed dignissim urna. In posuere orci ut lectus fringilla aliquam. Integer posuere id ex luctus mollis. Suspendisse sagittis nec nisi quis suscipit. Sed feugiat varius augue. "
  }
];

function seedDB() {
  // clear DB
  Campground.remove({}, function(error) {
    if(error) {
      console.log(error);
    } else {
      console.log("Cleared Campground DB...");  
      // add sample campgrounds
      data.forEach(function(site) {
        Campground.create(site, function(error, newCampground) {
          if(error) {
            console.log(error);
          } else {
            console.log("New Campground Created.");
            Comment.create(
              {
                text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
                author: "Homer Simpson"
              }, function(error, comment) {
                    if(error) {
                      console.log(error);
                    } else {
                      console.log("New Comment");
                      newCampground.comments.push(comment);
                      newCampground.save();
                   }
                }
            );
          }
        });
      });  
    }
  });  

  // add sample comments
}

module.exports = seedDB;