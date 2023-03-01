var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require('../models/User')
const Topic = require('../models/Topic')

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
      const payload = { _id:user._id,email: user.email };
      const token = jwt.sign(payload, process.env.SECRET,{
        expiresIn: 500
      },
);
      res.json({ "success":"true", "token":token});
    });
  });
});

//handle logout
router.post('/logout', (req, res) => {
  res.clearCookie('jwt'); // Clear the JWT token stored in the cookie
  res.json({ success: true });
  /*res.redirect('/');*/
});

//handle register
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
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save((err) => {
    if (err) {
        if(err.code === 11000) return res.status(403).json({error: 'email already exists'});
        return res.status(500).json({error: 'something went wrong'});
    }
    res.json({ message: 'User created successfully' });
  });
});

module.exports = router;