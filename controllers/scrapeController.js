// Dependencies Defined
var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");
var db = require("../models");
var exports = module.exports = {};

//scrape articles from the New YorK Times
var scrape = function(callback) {

  var articlesArr = [];

  axios.get("https://www.nytimes.com/")
  .then(function(response) {

      var $ = cheerio.load(response.data);


      $("h2.story-heading").each(function(i, element) {

          var result = {};

          result.title = $(this)
          .children("a")
          .text();
          result.link = $(this)
          .children("a")
          .attr("href");

          if (result.title !== "" && result.link !== "") {
              articlesArr.push(result);
          }
      });
      callback(articlesArr);
  })
};



module.exports = {
  fetch: function(callback) {

    scrape(function(data) {

      var articlesArr = data;
      //check if date and not to save it initially
      for (var i = 0; i < articlesArr.length; i++) {
        articlesArr[i].date = new Date();
        articlesArr[i].saved = false;
        articlesArr[i].note = [];
      }

//no dupes
        db.Article.insertMany(articlesArr, { ordered: false }, function(err, docs) {
          callback(err, docs);
        });
    });
  },
  
  get: function(query, cb) {
    db.Article.find(query)
      .sort({
        _id: -1
      })
      .exec(function(err, doc) {
        //send saved articles back to routes for rendering
        cb(doc);
      });
  },

  //save or unsave
  
  
  update: function(query, cb) {
  db.Article.update({ _id: query.id }, {
      $set: {saved: query.saved}
    }, {}, cb);
  },

  addNote: function(query, cb) {
    db.Article.findOneAndUpdate({_id: query.id }, {
      $push: {note: query.note}
    }, {}, cb);
  },
};

