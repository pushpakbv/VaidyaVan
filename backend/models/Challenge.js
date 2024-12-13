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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Challenge', ChallengeSchema);