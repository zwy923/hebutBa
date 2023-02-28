var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const Book = require('../models/Book');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/api/book/:bookName', async (req, res) => {
  const { bookName } = req.params;
  try {
    const book = await Book.findOne({ name: bookName });
    if (book) {
      res.status(200).json({ name: book.name, author: book.author, pages: book.pages });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/api/book', (req, res) => {
  console.log(req.body)
  const newBook = new Book({
    author: req.body.author,
    name: req.body.name,
    pages: parseInt(req.body.pages)
  });

  newBook.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving book to database');
    } else {
      res.status(200).send('ok');
    }
  });
});

module.exports = router;
