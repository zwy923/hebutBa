var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require('../models/User')
const Comment = require('../models/Comment');
const CodeSnippet = require('../models/CodeSnippet');
const Vote = require('../models/Vote')

const passport = require('passport')
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js")
const { check, validationResult } = require('express-validator')
process.env.SECRET = 'mysecretkey';


router.get('/private', validateToken, (req, res) => {
  res.json({ email: req.user.email });
});

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//handle login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return res.status(500).json({ error: 'something went wrong' });
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'something went wrong' });
      if (!isMatch) return res.status(401).json({ error: 'email or password is incorrect' });
      const payload = { _id:user._id, email: user.email, name:user.name, role:user.role};
      const token = jwt.sign(payload, process.env.SECRET,{
        expiresIn: 7200 //7200s expired
      });
      res.json({ "success":"true", "token":token});
    });
  });
});

router.post('/getusername',(req, res)=>{
  const id  = req.body.userid
  User.findOne({_id:id},(err,user)=>{
    if (err) return res.status(500).json({ error: 'something went wrong' });
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json({name:user.name})
  })
})

// handle logout
router.post('/logout', (req, res) => {
  res.clearCookie('jwt'); // Clear the JWT token stored in the cookie
  res.json({ success: true });
});

// handle register
router.post('/register', [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\|\\\;\:\"\<\>\,\.\/\?]).*$/)
    .withMessage("at least one lowercase letter, one uppercase letter, one number")
],(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, name, rolecode} = req.body;
  if(rolecode === 'zhangwenyue923'){
    role = 'admin'
  }else{
    role = 'normal'
  }
  const user = new User({ email, password, name ,role});
  user.save((err) => {
    if (err) {
        if(err.code === 11000) return res.status(403).json({error: 'email already exists'});
        return res.status(500).json({error: 'something went wrong'});
    }
    res.json({ message: 'User created successfully' });
  });
});


// Create a new code snippet
router.post('/codeSnippets', validateToken, (req, res) => {
  const { title, code, tags, description} = req.body;
  const user = req.user;

  const codeSnippet = new CodeSnippet({
    title,
    code,
    tags,
    description,
    user: user._id
  });

  codeSnippet.save((err, codeSnippet) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.json(codeSnippet);
    }
  });
});

// Get an existing code snippet

router.get('/codeSnippets/:id', validateToken, (req, res) => {
  const codeSnippetId = req.params.id;
  CodeSnippet.findOne({ _id: codeSnippetId}, (err, codeSnippet) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else if (!codeSnippet) {
      res.status(404).json({ error: 'Code snippet not found or unauthorized to edit' });
    } else {
      res.json(codeSnippet);
    }
  });
});

// Edit an existing code snippet
router.put('/codeSnippets/:id', validateToken, (req, res) => {
  const codeSnippetId = req.params.id;
  const userId = req.user._id;
  const { title, code, tags, description} = req.body;

  CodeSnippet.findOneAndUpdate({ _id: codeSnippetId, user: userId }, { title, code, description, tags, updatedAt: Date.now() }, { new: true }, (err, codeSnippet) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else if (!codeSnippet) {
      res.status(404).json({ error: 'Code snippet not found or unauthorized to edit' });
    } else {
      res.json(codeSnippet);
    }
  });
});


// Delete an existing code snippet
router.delete('/codeSnippets/:id', validateToken, (req, res) => {
  const codeSnippetId = req.params.id;
  const userId = req.user._id;

  CodeSnippet.findOneAndDelete({ _id: codeSnippetId, user: userId }, (err, codeSnippet) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else if (!codeSnippet) {
      res.status(404).json({ error: 'Code snippet not found or unauthorized to delete' });
    } else {
      res.json({ message: 'Code snippet deleted successfully' });
    }
  });
});


// Get all code snippets
router.get('/codesnippets', async (req, res) => {
  try {
    const snippets = await CodeSnippet.find();
    res.json(snippets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all comments for a specific code snippet
router.get('/comments/:snippetId', async (req, res) => {
  const snippetId = req.params.snippetId;
  try {
    const comments = await Comment.find({ codeSnippet: snippetId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// handdle post comment
router.post('/comments', validateToken, (req, res) => {
  
  const text= req.body.text;
  const codeSnippetId=req.body.codeSnippetId
  const comment = new Comment({
    text: text,
    user: req.user._id,
    codeSnippet: codeSnippetId,
  });

  comment.save((err, comment) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.json(comment);
    }
  });
});


// Edit an existing comment
router.put('/comments/:id', validateToken, (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  Comment.findOneAndUpdate({ _id: commentId, user: userId }, { text }, { new: true }, (err, comment) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else if (!comment) {
      res.status(404).json({ error: 'Comment not found or unauthorized to edit' });
    } else {
      res.json(comment);
    }
  });
});

// Delete an existing comment
router.delete('/comments/:id', validateToken, (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;

  Comment.findOneAndDelete({ _id: commentId, user: userId }, (err, comment) => {
    if (err) {
      res.status(500).json({ error: 'Something went wrong' });
    } else if (!comment) {
      res.status(404).json({ error: 'Comment not found or unauthorized to delete' });
    } else {
      res.json({ message: 'Comment deleted successfully' });
    }
  });
});


// Upvote or cancel vote a post or comment
router.post('/votes', validateToken, async (req, res) => {
  const objectId = req.body.id;
  const userId = req.user._id;
  try {
    const existingVote = await Vote.findOne({ user: userId, objectId: objectId });
    if (existingVote) {
      await Vote.deleteOne(existingVote)
      res.status(200).json({ isvoted: false });
    } else {
      const newVote = new Vote({ user: userId, objectId: objectId, isvoted: true });
      await newVote.save();
      res.status(201).json({ isvoted: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get the isvoted status of a post or comment
router.get('/votes/:id', validateToken, async (req, res) => {
  const objectId = req.params.id;
  const userId = req.user._id;
  try {
    const vote = await Vote.findOne({ user: userId, objectId: objectId });
    if (vote) {
      res.status(200).json({ isvoted: true });
    } else {
      res.status(200).json({ isvoted: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get count of votes in specific post
router.get('/votes/count/:id', async (req, res) => {
  console.log(req.params.id)
  const Id = req.params.id;
  const voteCount = await Vote.countDocuments({ objectId: Id, isvoted: true });
  res.status(200).json({ count: voteCount });
});



module.exports = router;