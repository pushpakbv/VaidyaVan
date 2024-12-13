const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['quiz', 'task'],
    },
    options: {
        type: [String],
        required: function() { return this.type === 'quiz'; }
    },
    reward: {
        type: Number,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    attempts: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        correct: {
            type: Boolean,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Challenge', ChallengeSchema);