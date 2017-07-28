var path = require("path");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function(app){

app.get("/scrape", function(req, res) {


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
newArticleCount++;
	});
  res.send("Scrape Complete " + newArticleCount + " new Articles Added.");


    
});
});

app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {

    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

app.get("/articles/:id", function(req, res) {

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

app.post("/articles/:id", function(req, res) {
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
