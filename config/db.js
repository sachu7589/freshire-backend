const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sachu7589:Freshhire25@freshhire.kh1un.mongodb.net/?retryWrites=true&w=majority&appName=freshhire'); 
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = { connectDB };



