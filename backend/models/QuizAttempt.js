const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attemptDate: {
        type: Date,
        default: Date.now
    }
});

// Method to check if user can take quiz today
QuizAttemptSchema.statics.canTakeQuiz = async function(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const attempt = await this.findOne({
        user: userId,
        attemptDate: {
            $gte: today,
            $lt: tomorrow
        }
    });
    
    return !attempt;
};

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
