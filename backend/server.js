require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`); } );