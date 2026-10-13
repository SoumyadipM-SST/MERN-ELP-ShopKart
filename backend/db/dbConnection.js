const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('DB connected');
  } catch (error) {
    console.log('DB connection failed:', error);
  }
};

module.exports = { connect };