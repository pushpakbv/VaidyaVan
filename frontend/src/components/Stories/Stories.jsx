import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShare, FaComment } from 'react-icons/fa';
import './Stories.css';

const Stories = () => {
  const [stories, setStories] = useState([
    {
      id: 1,
      author: "Rajesh Kumar",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      date: "Dec 10, 2023",
      content: "After following Ayurvedic practices for 3 months, my chronic digestive issues have completely resolved. The combination of dietary changes and herbal supplements recommended by my Vaidya has transformed my life!",
      likes: 45,
      comments: 12,
      shares: 8
    },
    {
      id: 2,
      author: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      date: "Dec 12, 2023",
      content: "I've been using Ashwagandha for stress management, and the results are amazing. My sleep quality has improved significantly, and I feel more energetic throughout the day. Ayurveda is truly a blessing!",
      likes: 32,
      comments: 8,
      shares: 5
    },
    {
      id: 3,
      author: "Amit Patel",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      date: "Dec 13, 2023",
      content: "Started practicing yoga and meditation along with Ayurvedic diet. My anxiety levels have decreased dramatically, and I feel more balanced than ever. The holistic approach of Ayurveda really works!",
      likes: 67,
      comments: 15,
      shares: 11
    },
    {
      id: 4,
      author: "Meera Reddy",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      date: "Dec 14, 2023",
      content: "Triphala has been a game-changer for my gut health! Combined with proper diet timing as suggested in Ayurveda, I've noticed improved digestion and better immunity. So grateful for this ancient wisdom.",
      likes: 28,
      comments: 6,
      shares: 4
    },
    {
      id: 5,
      author: "Dr. Suresh Iyer",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      date: "Dec 14, 2023",
      content: "As an Ayurvedic practitioner, I'm always amazed by the transformative power of simple lifestyle changes. Recently helped a patient overcome chronic migraines through Shirodhara and dietary modifications. Ayurveda's personalized approach continues to prove its effectiveness.",
      likes: 89,
      comments: 23,
      shares: 15
    }
  ]);

  const [newStory, setNewStory] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStory.trim()) return;

    const story = {
      id: stories.length + 1,
      author: "Anonymous User",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      content: newStory,
      likes: 0,
      comments: 0,
      shares: 0
    };

    setStories([story, ...stories]);
    setNewStory('');
  };

  const handleLike = (id) => {
    setStories(stories.map(story => 
      story.id === id ? { ...story, likes: story.likes + 1 } : story
    ));
  };

  const handleShare = (id) => {
    setStories(stories.map(story => 
      story.id === id ? { ...story, shares: story.shares + 1 } : story
    ));
  };

  return (
    <div className="stories-container">
      <motion.h1 
        className="stories-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Ayurvedic Success Stories
      </motion.h1>

      <motion.div 
        className="story-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit}>
          <textarea
            className="story-input"
            placeholder="Share your Ayurvedic success story..."
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            rows={4}
          />
          <button type="submit" className="submit-story-btn">
            Share Your Story
          </button>
        </form>
      </motion.div>

      <div className="stories-list">
        {stories.map((story, index) => (
          <motion.div 
            key={story.id}
            className="story-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="story-header">
              <div className="author-info">
                <img src={story.avatar} alt={story.author} className="author-avatar" />
                <div>
                  <h3>{story.author}</h3>
                  <span className="story-date">{story.date}</span>
                </div>
              </div>
            </div>
            <p className="story-content">{story.content}</p>
            <div className="story-footer">
              <button 
                className="action-button"
                onClick={() => handleLike(story.id)}
              >
                <FaHeart className={`icon ${story.likes > 0 ? 'liked' : ''}`} />
                <span>{story.likes}</span>
              </button>
              <button 
                className="action-button"
                onClick={() => setShowCommentInput(showCommentInput === story.id ? null : story.id)}
              >
                <FaComment className="icon" />
                <span>{story.comments}</span>
              </button>
              <button 
                className="action-button"
                onClick={() => handleShare(story.id)}
              >
                <FaShare className="icon" />
                <span>{story.shares}</span>
              </button>
            </div>
            {showCommentInput === story.id && (
              <div className="comment-input-container">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="comment-input"
                />
                <button className="comment-submit-btn">Post</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
