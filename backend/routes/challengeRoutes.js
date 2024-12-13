const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const router = express.Router();
const {challenges,submit,createChallenge} = require('../controllers/challengeController');
const authenticate = require('../middlewares/authMiddleware');

// Fetch challenges
router.get('/', challenges);

// Submit challenge answer
router.post('/submit', authenticate, submit);

// Create a new challenge
router.post('/create', authenticate, createChallenge);

module.exports = router;
