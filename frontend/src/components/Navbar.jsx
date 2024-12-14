import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import logo from './images/logo.png';
import axiosInstance from '../api/axiosInstance';

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        // Get the current user's profile using the auth token
        const response = await axiosInstance.get('/users/profile/me');
        if (response.data && response.data.coins !== undefined) {
          setCoins(response.data.coins);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchUserCoins();
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo-container">
          <img src={logo} alt="Vaidyavan Logo" className="nav-logo" />
          <div className="logo">VAIDYAVAN</div>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/virtual-tour">Virtual Garden</Link></li>
          <li><Link to="/daily-challenges">Daily Challenge</Link></li>
          <li><Link to="/stories">Stories</Link></li>
          <li className="coins-display"> {coins}🪙</li>
          <li><button onClick={handleLogout} className="nav-link-button">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
