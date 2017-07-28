
var commentsController=require("../controller/notes");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;


module.exports = function(router) {

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
  res.redirect("/")

    
});
});


router.get("/", function(req,res){
  res.redirect("/articles");
});

router.get("/articles", function(req, res) {
  Article.find({})
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
  
        var hbsObject = {
        Article: doc
        };
      res.render('articles', hbsObject); 

    }

  });
});

router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


router.post("/comment", function(req, res) {
  console.log(req.body);
  var newNote = new Note(req.body);
  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {      
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});
}
