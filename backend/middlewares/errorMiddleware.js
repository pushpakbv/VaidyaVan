const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate field value entered'
    });
  }

  res.status(500).json({
    error: 'Server Error'
  });
};

module.exports = errorHandler; 