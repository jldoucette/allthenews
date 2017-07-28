var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;

var app = express();
var PORT = process.env.PORT || 3000;
var router = express.Router();
require("./config/routes")(router);
app.use(router);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));



app.use(express.static("./public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/allthenews");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT+"!");
});

router.get("/scrape", function(req, res) {
  
  request("http://www.independent.co.uk/", function(error, response, html) {
    var $ = cheerio.load(html);
    $("article li").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = "http://www.independent.co.uk"+$(this).children("a").attr("href");

 
    Article.find({title:result.title}, function(error, doc) {
      if (error) {
        console.log(error);
      }
      if (doc.length) {
            console.log(doc);
        console.log("Duplicate Found");

    }

      else {
      
      var entry = new Article(result);
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
}
});
  });
  res.send("Scrape Complete");


    
});
});