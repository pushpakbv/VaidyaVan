const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

const challenges = [
    {
        description: "Which herb is specifically known for boosting the immune system during cold and flu season?",
        type: "quiz",
        reward: 15,
        correctAnswer: "Elderberry",
        options: ["Lavender", "Elderberry", "Chamomile", "Thyme"]
    },
    {
        description: "What is the primary benefit of Ashwagandha?",
        type: "quiz",
        reward: 20,
        correctAnswer: "Reducing stress and lowering cortisol levels",
        options: ["Treating infections", "Reducing stress and lowering cortisol levels", "Boosting immune system", "Improving digestion"]
    },
    {
        description: "Which herb is known for its antimicrobial properties and ability to lower blood pressure?",
        type: "quiz",
        reward: 15,
        correctAnswer: "Garlic",
        options: ["Parsley", "Garlic", "Ginseng", "Dandelion"]
    },
    {
        description: "What is the main use of Lavender in herbal medicine?",
        type: "quiz",
        reward: 20,
        correctAnswer: "Stress relief and anxiety reduction",
        options: ["Immune system boost", "Pain relief", "Stress relief and anxiety reduction", "Liver detoxification"]
    },
    {
        description: "Which herb is particularly beneficial for liver health and detoxification?",
        type: "quiz",
        reward: 15,
        correctAnswer: "Dandelion",
        options: ["Dandelion", "Thyme", "Ginger", "Echinacea"]
    },
    {
        description: "What is the primary benefit of Chamomile?",
        type: "quiz",
        reward: 20,
        correctAnswer: "Promoting relaxation and better sleep",
        options: ["Boosting energy levels", "Fighting infections", "Promoting relaxation and better sleep", "Lowering blood pressure"]
    },
    {
        description: "Which herb is known for increasing energy and reducing chronic fatigue?",
        type: "quiz",
        reward: 25,
        correctAnswer: "Ginseng",
        options: ["Ginseng", "Lavender", "Parsley", "Elderberry"]
    },
    {
        description: "What is a key benefit of Thyme in herbal medicine?",
        type: "quiz",
        reward: 15,
        correctAnswer: "Treating respiratory conditions",
        options: ["Treating respiratory conditions", "Reducing stress", "Improving circulation", "Boosting energy"]
    }
];

const seedChallenges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing challenges
        await Challenge.deleteMany({});
        console.log('Cleared existing challenges');

        // Insert new challenges
        const result = await Challenge.insertMany(challenges);
        console.log(`Added ${result.length} challenges`);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedChallenges();
