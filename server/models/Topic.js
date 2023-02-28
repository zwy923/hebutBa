const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: Array,
    required: true
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;