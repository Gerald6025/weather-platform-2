require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/weather-platform');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weather-platform');
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const Location = require('./models/location');
    const testLocation = new Location({
      city: 'Test City',
      country: 'Test Country',
      lat: 0,
      lon: 0
    });
    
    await testLocation.save();
    console.log('✅ Test document created successfully!');
    
    // Clean up
    await Location.deleteOne({ _id: testLocation._id });
    console.log('✅ Test document cleaned up!');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
