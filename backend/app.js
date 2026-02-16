const express = require('express');
const cors = require('cors');

const locationRoutes = require('./routes/locationRoutes');

const app = express();


const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/locations', locationRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
