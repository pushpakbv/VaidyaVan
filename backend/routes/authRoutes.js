const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { login, register ,logout, validateToken} = require('../controllers/userController');
// const cookieParser = require('cookie-parser');
// router.use(cookieParser());


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/validate-token', validateToken);


module.exports = router;


// // Register
// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//       // Check if user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email already in use' });
//       }
  
//       const user = new User({ username, email, password });
//       await user.save();
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.status(200).json({ token, user: { username: user.username, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
