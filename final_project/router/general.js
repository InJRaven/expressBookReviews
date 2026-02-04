const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");

const public_users = express.Router();

/* ============ GET ALL BOOKS (async/await + axios) ============ */
public_users.get("/", async (req, res) => {
  try {
    const data = await axios.get("http://localhost:5000/books-data");
    return res.status(200).json(data.data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/* ============ GET BOOK BY ISBN (Promise + axios) ============ */
public_users.get("/isbn/:isbn", (req, res) => {
  axios
    .get("http://localhost:5000/books-data")
    .then((response) => {
      const book = response.data[req.params.isbn];
      book
        ? res.status(200).json(book)
        : res.status(404).json({ message: "Book not found" });
    })
    .catch(() => res.status(500).json({ message: "Error retrieving book" }));
});

/* ============ GET BOOKS BY AUTHOR (async/await + axios) ============ */
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books-data");
    const result = {};

    for (let key in response.data) {
      if (
        response.data[key].author.toLowerCase() ===
        req.params.author.toLowerCase()
      ) {
        result[key] = response.data[key];
      }
    }

    return Object.keys(result).length
      ? res.status(200).json(result)
      : res.status(404).json({ message: "No books found" });
  } catch {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/* ============ GET BOOKS BY TITLE (Promise + axios) ============ */
public_users.get("/title/:title", (req, res) => {
  axios
    .get("http://localhost:5000/books-data")
    .then((response) => {
      const result = {};
      for (let key in response.data) {
        if (
          response.data[key].title
            .toLowerCase()
            .includes(req.params.title.toLowerCase())
        ) {
          result[key] = response.data[key];
        }
      }

      Object.keys(result).length
        ? res.status(200).json(result)
        : res.status(404).json({ message: "No books found" });
    })
    .catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

/* ============ INTERNAL DATA SOURCE FOR AXIOS ============ */
public_users.get("/books-data", (req, res) => {
  res.status(200).json(books);
});

/* ============ GET BOOK REVIEW ============ */
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
