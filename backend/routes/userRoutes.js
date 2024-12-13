const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/profile/:userId', authenticate, userController.getProfile);
router.post('/deduct-coins', authenticate, userController.deductCoins);

module.exports = router;