const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const HARDCODED = {
  email: 'Testing@gmail.com',
  password: 'Test123'
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === HARDCODED.email && password === HARDCODED.password) {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, password });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '7d' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
