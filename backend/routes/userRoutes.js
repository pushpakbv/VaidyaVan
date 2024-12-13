const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');


router.get('/profile/:userId', authenticate, userController.getProfile);


module.exports = router; 