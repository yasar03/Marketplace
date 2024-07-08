const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.session.userId = user._id; // Save user ID in session after registration
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id; // Save user ID in session after login
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
