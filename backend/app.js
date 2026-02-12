const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const locationRoutes = require('./routes/locationRoutes');
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weather-platform')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/locations', locationRoutes);
app.use('/api/preferences', userPreferencesRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
