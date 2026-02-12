const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Setup Helper');
console.log('======================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ .env.example file not found!');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 MongoDB Setup Instructions:');
console.log('================================');
console.log('1. Install MongoDB Community Server:');
console.log('   - Download from: https://www.mongodb.com/try/download/community');
console.log('   - Choose Windows version and complete installation');
console.log('');
console.log('2. Start MongoDB Service:');
console.log('   - Open Command Prompt as Administrator');
console.log('   - Run: net start MongoDB');
console.log('');
console.log('3. Configure your .env file:');
console.log('   - Edit the .env file in this directory');
console.log('   - Add your OpenWeatherMap API key');
console.log('   - Default MongoDB URI should work for local installation');
console.log('');
console.log('4. Test the connection:');
console.log('   - Run: node test-db-connection.js');
console.log('');
console.log('5. Start the application:');
console.log('   - Run: npm run dev');
console.log('');

console.log('🚀 Alternative: MongoDB Atlas (Cloud)');
console.log('====================================');
console.log('If you prefer a cloud database:');
console.log('1. Sign up at https://www.mongodb.com/atlas');
console.log('2. Create a free cluster');
console.log('3. Get your connection string');
console.log('4. Update MONGO_URI in .env file');
console.log('');

console.log('✨ Setup complete! Follow the instructions above.');
