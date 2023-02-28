var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const Book = require('../models/Book');
const Topic = require('../models/Topic')

const passport = require('passport')
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js")
const { check, validationResult } = require('express-validator')
process.env.SECRET = 'mysecretkey';

router.get('/', function(req, res, next) {
    res.send('There are some useful api.');
});
  
router.post('/topic',validateToken,async (req, res) => {
    console.log(req.user)
      try {
        let topic = await Topic.findOne({ user: req.user._id });
        if (!topic) {
          topic = new Topic({ user: req.user._id, content: req.body.content });
        } else {
          topic.content = topic.content.concat(req.body.content);
        }
        await topic.save();
        res.json(topic);
      } catch (err) {
        res.status(500).json({ message: 'Error saving topic' });
      }
    }
);
router.get('/book/:bookName', async (req, res) => {
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
  
router.post('/book', (req, res) => {
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