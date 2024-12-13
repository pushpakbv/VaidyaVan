const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');

const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Create a new challenge
const createChallenge = async (req, res) => {
    const { description, type, reward, correctAnswer, options } = req.body;

    try {
        const newChallenge = new Challenge({
            description,
            type,
            reward,
            correctAnswer,
            options: type === 'quiz' ? options : undefined
        });

        await newChallenge.save();
        res.status(201).json(newChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Check if user has already taken quiz today
const hasUserTakenQuizToday = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastAttempt = await Challenge.findOne({
        'attempts.userId': userId,
        'attempts.date': { $gte: today }
    });

    return !!lastAttempt;
};

// Fetch all challenges
const challenges = async (req, res) => {
    try {
        const userId = req.user.id;
        const hasTakenToday = await hasUserTakenQuizToday(userId);

        if (hasTakenToday) {
            return res.status(403).json({
                message: 'You have already taken today\'s quiz. Please come back tomorrow!',
                nextQuizTime: new Date(new Date().setHours(24, 0, 0, 0))
            });
        }

        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit challenge answers
const submit = async (req, res) => {
    try {
        const { answers } = req.body;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Missing or invalid answers' });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if user has already taken quiz today
        const hasTakenToday = await hasUserTakenQuizToday(userId);
        if (hasTakenToday) {
            return res.status(403).json({
                message: 'You have already taken today\'s quiz. Please come back tomorrow!',
                nextQuizTime: new Date(new Date().setHours(24, 0, 0, 0))
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let totalCoins = 0;
        let results = [];

        for (const { challengeId, answer } of answers) {
            const challenge = await Challenge.findById(challengeId);
            if (!challenge) {
                results.push({
                    challengeId,
                    correct: false,
                    message: 'Challenge not found'
                });
                continue;
            }

            // Record the attempt
            challenge.attempts = challenge.attempts || [];
            challenge.attempts.push({
                userId,
                date: new Date(),
                answer,
                correct: answer === challenge.correctAnswer
            });
            await challenge.save();

            const isCorrect = answer === challenge.correctAnswer;
            if (isCorrect) {
                totalCoins += challenge.reward;
            }

            results.push({
                challengeId,
                correct: isCorrect,
                message: isCorrect ? 'Correct!' : 'Incorrect',
                reward: isCorrect ? challenge.reward : 0
            });
        }

        if (totalCoins > 0) {
            user.coins = (user.coins || 0) + totalCoins;
            await user.save();
        }

        res.json({ 
            results,
            totalCoins,
            newBalance: user.coins,
            message: `You earned ${totalCoins} coins!`,
            nextQuizTime: new Date(new Date().setHours(24, 0, 0, 0))
        });
        
    } catch (error) {
        console.error('Error in submit:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createChallenge,
    challenges,
    submit,
};