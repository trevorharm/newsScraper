var scrapeController = require("../controllers/scrapeController");


module.exports = function(app){
// Default landing page route
app.get("/", function(req, res){
    res.render('index')
});

// A GET route for scraping the MacRumors website
app.get("/scrape", scrapeController.scrape);
  
  // Route for getting all Articles from the db
app.get("/articles", scrapeController.articles);
  
  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", scrapeController.favorites);
  
  // Route for saving/updating an Article's associated Note
app.post("/articles/:id", scrapeController.notes);

}