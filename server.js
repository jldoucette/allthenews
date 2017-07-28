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

mongoose.connect("mongodb://heroku_l9pg93z0:nvc8r5tl33i9sq7fmbhe1frk3j@ds133311.mlab.com:33311/heroku_l9pg93z0");
// mongoose.connect("mongodb://localhost/allthenews");
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
