//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "On this page, you can view my blog posts, and they will usually have the day or date as the title.";
const aboutContent = "I am a computer science honors student at the University of Massachusetts Amherst, who is pursuing his interests in Web Development and AI.";
const contactContent = ["Email: akroychowdhu@umass.edu","LinkedIn: adityarc2001"];

const app = express();

//const posts = []

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//MONGOOSE

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema);

//GET

app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      res.render("home", {homeStartingContent: homeStartingContent, posts: foundPosts})
    }
  })
})

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
})

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
})

app.get("/compose", function(req, res) {
  res.render("compose", {});
})

app.get("/post/:postID", function(req, res) {
  // posts.forEach((post) => {
  //   if(_.lowerCase(post.title) === _.lowerCase(req.params.title)) {
  //     res.render("post", {title: post.title, content: post.content})
  //   }
  // })

  const postID = req.params.postID;
  Post.findOne({_id: postID}, function (err, post) {
    res.render("post", {title: post.title, content: post.content})
  })
  
})

app.post("/compose", function(req, res) {
  // const post = {title: req.body.newEntry, content: req.body.entryContent};
  // posts.push(post);
  // res.redirect("/");
  const post = new Post(
    {
      title: req.body.newEntry,
      content: req.body.entryContent
    }
  )

  post.save(function(err) {
    if (!err) {
      res.redirect("/")
    }
  });


})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//C:\Program Files\MongoDB\Server\5.0\data\