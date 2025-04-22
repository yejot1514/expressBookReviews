const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
//});
// Task 10: Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
function retrieveAllBooks() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }
  // Get the book list available in the shop
  public_users.get("/", function (req, res) {
    //Write your code here
    retrieveAllBooks().then(
      (books) => res.status(200).send(JSON.stringify(books, null, 4)),
      (error) =>
        res.status(404).send("An error has occured trying to retrieve all the books")
    );
  });

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //const isbn = req.params.isbn
 // res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 //});
 function retrieveBookUsingISBN(isbn) {
    let book = books[isbn];
    return new Promise((resolve, reject) => {
      if (book) {
        resolve(book);
      } else {
        reject(new Error("The provided book does not exist"));}
    });
  }
  // Get book details based on ISBN
  public_users.get("/isbn/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    retrieveBookUsingISBN(isbn).then(
      (book) => res.status(200).send(JSON.stringify(book, null, 4)),
      (err) => res.status(404).send(err.message)
    );
  });
  
// Get book details based on author
function retrieveBookUsingAuthor(author) {
    let matchingBooks = [];
    return new Promise((resolve, reject) => {
      for (let isbn in books) {
        const bookAuthor = books[isbn].author;
        if (bookAuthor === author) { matchingBooks.push(books[bookISBN]); }
      }
      if (matchingBooks.length > 0) { resolve(matchingBooks); }
      else { reject(new Error("The provided author does not exist"));}
    });
  }
  // Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    retrieveBookUsingAuthor(author).then(
      (books) => res.status(200).send(JSON.stringify(books, null, 4)),
      (err) => res.status(404).send(err.message)
    );
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title 
  let validBooks = [];
  //return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookTitle = books[bookISBN].title;
      if (bookTitle === title) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
        res.status(200).send(JSON.stringify(validBooks, null, 4));
      } else {
        res.status(404).send("The provided author does not exist");
      }  
  //return res.status(300).json({message: "Yet to be implemented"});
});
function retrieveBookUsingTitle(title) {
    let matchingBooks = [];
    return new Promise((resolve, reject) => {
      for (let isbn in books) {
        const bookTitle = books[isbn].title;
        if (bookTitle === title) { matchingBooks.push(books[isbn]);  }
      }
      if (matchingBooks.length > 0) {  resolve(matchingBooks);  } 
      else { reject(new Error("The provided book title does not exist")); }
    });  }
  // Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    retrieveBookUsingTitle(title).then(
      (book) => res.status(200).send(JSON.stringify(book, null, 4)),
      (err) => res.status(404).send(err.message)
    );
  });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] !== null) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Provided book does not exist" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
