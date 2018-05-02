var scrapeController = require("../controllers/scrapeController");
var db = require("../models");
// console.log(scrapeController.scrape);

module.exports = function(app){


app.get("/", function(req, res) {
  db.Article.find({saved: false}, function(error, found) {
      if (error) {
          console.log(error);
      } else if (found.length === 0) {
          res.render("empty")
      } else {

        var hbsObject = {
            articles: found
        };
        res.render("index", hbsObject);

      }
  });
});

app.get("/api/fetch", function(req, res) {

  // scrapes articles and saves unique ones to database
  scrapeController.fetch(function(err, docs) {
      console.log(docs);
      //lets user know if there are new articles or not
      if (!docs || docs.insertedCount === 0) {
          res.json({message: "No new articles today. Check back tomorrow!"});
      }
      else {
          res.json({message: "Added " + docs.insertedCount + " new articles!"});

      }
  });
});

app.get("/saved", function(req, res) {

  scrapeController.get({saved: true}, function(data) {
      var hbsObject = {
        articles: data
      };
      res.render("saved", hbsObject);
  });
});

//for saving or unsaving articles
app.patch("/api/articles", function(req, res) {

  scrapeController.update(req.body, function(err, data) {
      res.json(data);
  });
});

app.get('/notes/:id', function (req, res) {
    // console.log("notes get id passed");
  //Query to find the matching id to the passed in it
  db.Article.findOne({_id: req.params.id})
      .populate("note") //Populate all of the notes associated with it
      .exec(function (error, doc) { //execute the query
          if (error) console.log(error);
          else {
              res.json(doc);
          }
      });
});

app.post('/notes/:id', function (req, res) {
    // console.log("post notes id passed");

        db.Note.create(req.body)
        .then(function(newNote){
            return db.Article.findOneAndUpdate({ _id: req.params.id }, 
                                               { note: newNote._id }, 
                                               { new: true });
        }).then(function(err, newdoc){
            if (err) console.log(err);
            res.send(newdoc);
        });
});

app.get('/deleteNote/:id', function(req, res){
  db.Note.remove({"_id": req.params.id}, function(err, newdoc){
      if(err) console.log(err);
      res.redirect('/saved'); //redirect to reload the page
  });
});

};




