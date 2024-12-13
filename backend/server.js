const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');



// Load environment variables first
dotenv.config();

const app = express();

app.use(cookieParser());

// Configure CORS before any routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static files with proper headers


// Pre-flight OPTIONS handler
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));