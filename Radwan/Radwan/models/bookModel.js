const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookSchema = new schema({
  bookTitle: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  isbn: { type: String, required: true }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
