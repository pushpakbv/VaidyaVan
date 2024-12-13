import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Virtual Tour', path: '/virtual-tour' },
    // { name: 'Advanced Search', path: '/advanced-search' },
    // { name: 'Quiz', path: '/quiz' },
    { name: 'Story', path: '/story' },
    { name: 'AYUSH-o-PEDIA', path: '/advanced-search' },
    { name: 'Discussion', path: '/quiz' },
    { name: 'Stories', path: '/story' },
    { name: 'Chatbot', path: '/chatbot' },
  ];

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Background Leaf Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url('/leaf-pattern.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold text-green-700"
            >
              VaidyaVan
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all"
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-green-800 mb-6">
              Discover AYUSH Medicinal Plants
            </h1>
            
            <p className="text-gray-600 mb-8">
              Explore our virtual herbal garden and uncover the healing power of plants used in Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for plants..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Discover
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
