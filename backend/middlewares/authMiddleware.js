const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token && req.cookies) {
      token = req.cookies.token;
    } else if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
