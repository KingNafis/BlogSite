//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  post: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// Home route
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render("home", {
      StartingContent: homeStartingContent,
      blogs: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading blogs");
  }
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { StartingContent: aboutContent });
});

// Contact route
app.get("/contact", (req, res) => {
  res.render("contact", { StartingContent: contactContent });
});

// Compose route
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const blog = new Blog({
    title: req.body.postTitle,
    post: req.body.postBody,
  });

  try {
    await blog.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving blog");
  }
});

// Blog details route
app.get("/blogs/:blogId", async (req, res) => {
  const requestedId = req.params.blogId;

  try {
    const blog = await Blog.findById(requestedId);
    if (blog) {
      res.render("post", {
        title: blog.title,
        post: blog.post,
      });
    } else {
      res.status(404).send("Blog not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading blog");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
