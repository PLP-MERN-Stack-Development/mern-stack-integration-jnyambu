const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('express-async-errors'); 

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get MONGO_URI from environment
const MONGO_URI = process.env.MONGO_URI;

// Check if MONGO_URI exists
if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Test Route 
app.get('/', (req, res) => {
  res.json({ 
    message: 'MERN Blog API is running!',
    status: 'success'
  });
});

//  debug code
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


// ROUTES
const postRoutes = require('./routes/post');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

console.log("Existing routes folder files:", require('fs').readdirSync('./routes'));

// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware 
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));