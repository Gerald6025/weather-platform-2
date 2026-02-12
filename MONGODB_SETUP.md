# MongoDB Setup Guide for Windows

## Quick Setup (Recommended)

### Option 1: Install MongoDB Community Server

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows
   - Choose Version (latest stable)
   - Choose Package: `msi`

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service
   - Leave default settings (port 27017)

3. **Start MongoDB Service**
   ```cmd
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

4. **Verify Installation**
   ```cmd
   # Check if MongoDB is running
   mongosh
   # You should see a MongoDB shell prompt
   ```

### Option 2: Use Docker (Alternative)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop

2. **Run MongoDB Container**
   ```cmd
   docker run --name mongodb -p 27017:27017 -d mongo:latest
   ```

## Testing the Connection

After MongoDB is running, test the connection:

```cmd
cd backend
node test-db-connection.js
```

You should see:
```
✅ MongoDB connected successfully!
✅ Test document created successfully!
✅ Test document cleaned up!
✅ Connection closed successfully!
```

## Starting the Application

Once MongoDB is working:

```cmd
cd backend
npm run dev
```

The server should start on http://localhost:5000

## Troubleshooting

### MongoDB Service Won't Start
- Make sure you have administrator privileges
- Check Windows Services: MongoDB should be running
- Port 27017 might be blocked by firewall

### Connection Refused
- Verify MongoDB is running: `net start MongoDB`
- Check if port 27017 is available
- Try restarting the MongoDB service

### Permission Issues
- Run Command Prompt as Administrator
- Check MongoDB data directory permissions

## Alternative: MongoDB Atlas (Cloud)

If local installation fails:

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a free cluster
4. Get connection string
5. Update `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-platform
   ```

## Environment Variables

Make sure your `.env` file contains:
```
MONGO_URI=mongodb://localhost:27017/weather-platform
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```
