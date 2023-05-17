const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../authorization/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const user = new User({ name, email, phone });
    console.log("user",user)
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;