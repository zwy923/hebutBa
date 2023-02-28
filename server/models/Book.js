const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);