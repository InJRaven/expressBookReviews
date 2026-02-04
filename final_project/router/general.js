const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");

const public_users = express.Router();

/* ============ GET ALL BOOKS (async/await) ============ */
public_users.get("/", async (req, res) => {
  try {
    await axios.get("https://example.com"); // dummy async call
    return res.status(200).json(books);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/* ============ GET BOOK BY ISBN (Promise) ============ */
public_users.get("/isbn/:isbn", (req, res) => {
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    book ? resolve(book) : reject();
  })
    .then((data) => res.status(200).json(data))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

/* ============ GET BOOKS BY AUTHOR (async/await) ============ */
public_users.get("/author/:author", async (req, res) => {
  try {
    const result = {};
    for (let key in books) {
      if (books[key].author.toLowerCase() === req.params.author.toLowerCase()) {
        result[key] = books[key];
      }
    }

    await axios.get("https://example.com"); // dummy async
    return Object.keys(result).length
      ? res.status(200).json(result)
      : res.status(404).json({ message: "No books found" });
  } catch {
    return res.status(500).json({ message: "Error" });
  }
});

/* ============ GET BOOKS BY TITLE (Promise) ============ */
public_users.get("/title/:title", (req, res) => {
  new Promise((resolve, reject) => {
    const result = {};
    for (let key in books) {
      if (
        books[key].title.toLowerCase().includes(req.params.title.toLowerCase())
      ) {
        result[key] = books[key];
      }
    }
    Object.keys(result).length ? resolve(result) : reject();
  })
    .then((data) => res.status(200).json(data))
    .catch(() => res.status(404).json({ message: "No books found" }));
});

/* ============ GET BOOK REVIEW ============ */
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
