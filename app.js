const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contactUpdateRoutes = require('./routes/contactUpdateRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { connectDB } = require('./config/db');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://freshire-frontend.vercel.app', 'https://freshhire.vercel.app', 'http://localhost:5174'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/contact-updates', contactUpdateRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
