import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './Dashboard.css';


const Dashboard = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Column - Image */}
          <motion.div 
            className="hero-image-container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/images/hero1.jpg" alt="Herbal Plants" className="hero-image" />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-text">
              <h1>
                Welcome to<br />
                Vaidyavan Your<br />
                Virtual Garden<br />
                of Healing<br />
                Plants <span role="img" aria-label="leaf">🌿</span>
              </h1>
              <p>
                Explore the Natural Wonders of Medicinal Plants,<br />
                Anytime, Anywhere
              </p>
              <button className="virtual-garden-btn" onClick={() => window.location.href = '/virtual-tour'}>
                Virtual Garden
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="discover-frame">
        <div className="discover-grid">
          {/* Left Column */}
          <motion.div 
            className="discover-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="herbal-info-container">
              {/* Herb Cards */}
              {[
                {
                  name: "Tulsi (Holy Basil)",
                  description: "A sacred plant in Ayurveda, known for its powerful healing properties.",
                  benefits: "Boosts immunity, reduces stress, improves respiratory health"
                },
                {
                  name: "Ashwagandha",
                  description: "An ancient medicinal herb used to reduce stress and anxiety.",
                  benefits: "Enhances energy, improves concentration, promotes better sleep"
                },
                {
                  name: "Turmeric (Haldi)",
                  description: "A golden spice with powerful anti-inflammatory properties.",
                  benefits: "Reduces inflammation, supports joint health, boosts immunity"
                },
                {
                  name: "Brahmi",
                  description: "A brain tonic herb that enhances memory and cognitive function.",
                  benefits: "Improves memory, reduces anxiety, enhances brain function"
                },
                {
                  name: "Neem",
                  description: "A versatile herb known for its antibacterial and antifungal properties.",
                  benefits: "Purifies blood, improves skin health, boosts immune system"
                },
                {
                  name: "Triphala",
                  description: "A combination of three fruits used for digestive health.",
                  benefits: "Improves digestion, cleanses body, supports eye health"
                },
                {
                  name: "Shatavari",
                  description: "An adaptogenic herb that promotes vitality and strength.",
                  benefits: "Supports female health, boosts immunity, increases energy"
                }
              ].map((herb, index) => (
                <motion.div 
                  key={index} 
                  className="herb-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3>{herb.name}</h3>
                  <p>{herb.description}</p>
                  <p className="benefits">Benefits: {herb.benefits}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="discover-column bg-peach">
            <motion.div 
              className="discover-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Section */}
              <div className="video-container">
                <iframe 
                  src="https://www.youtube.com/embed/RZiqFLecohE?si=LLVwY_ArvWcQGha5" 
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen>
                </iframe>
              </div>

              {/* Ayurveda Table */}
              <table className="ayurveda-table">
                <tbody>
                  <tr>
                    <th>Definition</th>
                    <td>Ayurveda is a holistic Indian medical system balancing.</td>
                  </tr>
                  <tr>
                    <th>Principles</th>
                    <td>It focuses on balancing three doshas: Vata, Pitta, and Kapha.</td>
                  </tr>
                  <tr>
                    <th>Remedies</th>
                    <td>Uses herbs, diet, yoga, and meditation for healing.</td>
                  </tr>
                  <tr>
                    <th>Benefits</th>
                    <td>Enhances immunity, treats chronic issues, and promotes wellness.</td>
                  </tr>
                  <tr>
                    <th>Prevention</th>
                    <td>Emphasizes a balanced lifestyle to prevent illnesses.</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
