import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Chandan</h3>
              <p>Full-Stack Developer</p>
            </motion.div>
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3>Pushpak</h3>
              <p>Full-stack Developer</p>
            </motion.div>
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>V Vishwas Joshi</h3>
              <p>Frontend Developer</p>
            </motion.div>
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3>Manu</h3>
              <p>ML Engineer</p>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="quote-section"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ancient Wisdom</h2>
          <div className="quote">
            When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.
          </div>
          <div className="quote-author">- Ayurvedic Proverb</div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
