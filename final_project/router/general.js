const express = require("express");
const axios = require("axios");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= REGISTER ================= */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
});

/* ============ GET ALL BOOKS (async/await) ============ */
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/* ============ GET BOOK BY ISBN (Promise) ============ */
public_users.get("/isbn/:isbn", (req, res) => {
  axios
    .get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch(() => {
      res.status(404).json({ message: "Book not found" });
    });
});

/* ============ GET BOOKS BY AUTHOR (async/await) ============ */
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

/* ============ GET BOOKS BY TITLE (Promise) ============ */
public_users.get("/title/:title", (req, res) => {
  axios
    .get(`http://localhost:5000/title/${req.params.title}`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch(() => {
      res.status(404).json({ message: "No books found with this title" });
    });
});

/* ============ GET BOOK REVIEW ============ */
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/review/${req.params.isbn}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
