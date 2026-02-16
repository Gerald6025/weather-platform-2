# Weather Platform Deployment Guide

## Quick Overview
- **Backend**: Deploy to Railway (Express + persistent storage)
- **Frontend**: Deploy to Vercel (React/Vite)
- **Repository**: Already pushed to GitHub ✅

## Step 1: Deploy Backend to Railway

1. **Sign up/Login**: Go to [railway.com](https://railway.com)
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repo**: Choose `Gerald6025/weather-platform-2`
4. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables**:
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
   - `PORT`: `5000` (Railway sets this automatically)
6. **Deploy**: Click "Deploy"

After deployment, you'll get a URL like: `https://your-app-name.up.railway.app`

## Step 2: Deploy Frontend to Vercel

1. **Sign up/Login**: Go to [vercel.com](https://vercel.com)
2. **New Project**: Click "New Project" → "Import Git Repository"
3. **Select Repo**: Choose `Gerald6025/weather-platform-2`
4. **Configure**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.up.railway.app/api`
6. **Deploy**: Click "Deploy"

## Step 3: Update CORS (if needed)

If you get CORS errors, update backend CORS:

```javascript
// In backend/app.js
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## Environment Variables Summary

### Backend (Railway)
```
OPENWEATHER_API_KEY=your_real_api_key_here
PORT=5000
MONGO_URI=mongodb://localhost:27017/weather
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

## What's Deployed

✅ **GitHub**: Code is ready
✅ **Backend**: Ready for Railway deployment
✅ **Frontend**: Ready for Vercel deployment
✅ **Environment files**: .gitignore protects secrets
✅ **Proxy config**: Frontend will talk to backend

## Testing After Deployment

1. Backend: Visit `https://your-app.up.railway.app/api/locations`
2. Frontend: Visit your Vercel URL
3. Test adding a city - should work with real API key

## Troubleshooting

- **API Key errors**: Make sure OpenWeatherMap key is valid
- **CORS errors**: Add frontend URL to backend CORS origins
- **404 errors**: Check VITE_API_URL is correct
- **Build failures**: Verify root directories and build commands
