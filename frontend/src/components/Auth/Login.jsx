import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { login, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const backgroundVariants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
// eslint-disable-next-line
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(-45deg, #4ade80, #22c55e, #86efac, #bbf7d0)',
        backgroundSize: '400% 400%'
      }}
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated Nature Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, y: Math.random() * window.innerHeight }}
            animate={{
              opacity: [0, 1, 0],
              y: [-50, window.innerHeight + 50],
              x: Math.sin(i) * 200,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              width: '20px',
              height: '20px',
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23047857'%3E%3Cpath d='M12 2L15 12L21 14L12 17L8 22L6 14L2 11L9 9L12 2Z'/%3E%3C/svg%3E") center/contain no-repeat`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-green-200"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-4xl font-bold text-green-700 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            VaidyaVan
          </motion.h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-green-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-green-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg transition-all duration-300 font-medium transform hover:translate-y-[-2px]"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-green-600 hover:text-green-700 font-medium hover:underline transform hover:scale-105 transition-all inline-block"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
