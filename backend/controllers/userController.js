const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await user.comparePassword(req.body.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout =  (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // If it's the /me endpoint or we have a user in the request
    if (req.path === '/profile/me' || !req.params.userId) {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }

    // If we have a userId parameter
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deductCoins = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    // Find user and update coins
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has enough coins
    if (user.coins < amount) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    // Deduct coins
    user.coins -= amount;
    await user.save();

    res.json({ 
      success: true, 
      newBalance: user.coins,
      message: `Successfully deducted ${amount} coins` 
    });
  } catch (error) {
    console.error('Deduct coins error:', error);
    res.status(500).json({ error: 'Error deducting coins' });
  }
};