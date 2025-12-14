const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/bookModel"); 
const path = require("path");

const app = express();
const port = 3000;

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views"))); // CSS
app.set("view engine", "ejs");

// ===== Connect to MongoDB =====
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => console.log(`✅ Server running at: http://localhost:${port}/`));
    console.log("💾 Connected to MongoDB");
  })
  .catch((err) => console.error("Connection error:", err));

// ===== Routes =====

// Home page - form to add book
app.get("/", (req, res) => {
  res.render("index");
});

// Success page
app.get("/success.html", (req, res) => res.render("success"));

// ===== Books CRUD + Search =====

// Get all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.render("books", { myTitle: "Books", books });
});

// Create new book
app.post("/", async (req, res) => {
  try {
    const newBook = new Book({
      bookTitle: req.body.bookTitle,
      author: req.body.author,
      genre: req.body.genre,
      publishedDate: req.body.publishedDate,
      isbn: req.body.isbn
    });
    await newBook.save();
    res.redirect("/success.html");
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error creating book", error });
  }
});

// Delete a book by ID
app.post("/delete/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error deleting book", error });
  }
});

// Search books by title
app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.bookTitle;
    const books = await Book.find({
      bookTitle: { $regex: searchQuery, $options: "i" }
    });
    res.render("books", { myTitle: "Search Results", books });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error searching books", error });
  }
});
