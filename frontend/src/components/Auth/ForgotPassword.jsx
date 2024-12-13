import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ isReset = false }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const [showResetForm, setShowResetForm] = useState(isReset);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (showResetForm) {
      if (newPassword !== confirmPassword) {
        setStatus({
          type: 'error',
          message: 'Passwords do not match!'
        });
        setIsLoading(false);
        return;
      }
      // Simulate password reset API call
      setTimeout(() => {
        setStatus({
          type: 'success',
          message: 'Password reset successful!'
        });
        setIsLoading(false);
        // Redirect to login after successful reset
        setTimeout(() => navigate('/login'), 1500);
      }, 1500);
    } else {
      // Simulate email verification API call
      setTimeout(() => {
        setStatus({
          type: 'success',
          message: 'Email verified successfully!'
        });
        setIsLoading(false);
        navigate('/reset-password');
      }, 1500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Constellation effect variants
  const constellationVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
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
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }}
    >
      {/* Constellation Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            variants={constellationVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: i * 0.2
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M0 0 L100 100 M200 150 L300 200 M50 200 L150 250"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>

      {/* Floating Leaves */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-green-200"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-green-700 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {showResetForm ? 'Reset Password' : 'Forgot Password'}
          </motion.h1>
          <motion.p
            className="text-green-600"
            variants={itemVariants}
          >
            {showResetForm ? 'Create your new password' : 'Verify your email'}
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!showResetForm ? (
              <motion.div
                key="email-form"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Your Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="password-form"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    New Password
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Enter new password"
                    required
                  />
                </motion.div>
                <motion.div
                  key="confirm-password-form"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Confirm Password
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Confirm new password"
                    required
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm text-center ${
                  status.type === 'success' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg transition-all duration-300 font-medium transform hover:translate-y-[-2px] relative overflow-hidden"
          >
            {isLoading ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              showResetForm ? 'Reset Password' : 'Verify Email'
            )}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <motion.button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline transform hover:scale-105 transition-all inline-block"
            >
              Back to Login
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
