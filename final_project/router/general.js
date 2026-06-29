const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop (async/await with Promise)
public_users.get('/', async function (req, res) {
  try {
    const response = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN (async/await with Promise)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Get book details based on author (async/await with Promise)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await new Promise((resolve, reject) => {
      const bookList = Object.values(books).filter(book => book.author === author);
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found for this author");
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Get all books based on title (async/await with Promise)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await new Promise((resolve, reject) => {
      const bookList = Object.values(books).filter(book => book.title === title);
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found with this title");
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
