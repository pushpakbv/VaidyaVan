const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token;

    // Check for token in different places
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Get token from Bearer header
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from cookies
      token = req.cookies.token;
    }

    // If no token found
    if (!token) {
      return res.status(401).json({ error: 'No authentication token found' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = {
        id: decoded.id
      };
      next();
    } catch (jwtError) {
      console.log('Token verification failed:', token);
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Server authentication error' });
  }
};

module.exports = authenticate;
