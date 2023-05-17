const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../authorization/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log(":adawda")
const { email, password } = req.body;
console.log("object",email,password)
 try {
   const user = await User.findOne({ email });
   console.log("Userr",user)
   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }
   console.log("adbdaidbh")

  //  const isPasswordValid = await bcrypt.compare(password);
  //  console.log("ispass",isPasswordValid)
  //  if (!isPasswordValid) {
  //    return res.status(401).json({ message: 'Invalid password' });
  //  }

   const token = generateToken(user._id);
   res.json({ token });
 } catch (error) {
   res.status(500).json({ message: 'Internal server error' });
 }
});

module.exports = router;