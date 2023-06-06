const mongoose = require('mongoose');
const express  = require('express');
// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.dbstring, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
  ()=>console.log('Connected to database')
);


// Create express app
const app = express();

// Add middleware
app.use(express.json());

// Add routes
app.use('/listing', require('./routes/listing'));
app.use('/user', require('./routes/user'));

module.exports = app;