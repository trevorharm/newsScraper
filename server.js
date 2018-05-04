// Dependencies Defined
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

//Set Engine and default Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Database configuration with mongoose
var databaseUri = "mongodb://localhost/newsScraper_DB";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}



// Routes
var route = require("./routes/route.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
