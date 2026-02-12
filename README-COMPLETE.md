# Weather Data Integration Platform

A full-stack weather tracking application that integrates with OpenWeatherMap API, stores weather data locally, and provides a clean interface for users to manage and view weather information for their favorite locations.

##  Features

- **API Integration**: Connects to OpenWeatherMap API for current weather and 5-day forecasts
- **Database Persistence**: Stores locations, weather snapshots, and user preferences in MongoDB
- **Full CRUD Operations**: Complete management of tracked locations
- **Modern UI**: Responsive React frontend with real-time weather data
- **Error Handling**: Comprehensive error handling throughout the application
- **Data Synchronization**: Manual sync with timestamps and weather history
- **Unit Testing**: Test coverage for API endpoints

##  Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with async/await
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: Axios for OpenWeatherMap API
- **Error Handling**: Custom middleware with asyncHandler
- **Testing**: Jest with Supertest

### Frontend (React)
- **Framework**: React 19 with hooks
- **Build Tool**: Vite
- **Styling**: CSS Grid/Flexbox with responsive design
- **HTTP Client**: Axios for API communication

### Database Schema
- **Locations**: City information with coordinates and sync timestamps
- **Weather Snapshots**: Historical weather data with comprehensive metrics
- **User Preferences**: Settings for units, refresh intervals, and UI preferences

##  Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally)
- OpenWeatherMap API key

### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/weather-platform

# OpenWeather API Key (get from https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

Ensure MongoDB is running:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 4. Run the Application

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

#### Frontend (Terminal 2)
```bash
cd frontend/frontend
npm run dev
```
Frontend runs on: http://localhost:5175

## 📡 API Endpoints

### Locations
- `GET /api/locations` - Get all tracked locations
- `POST /api/locations` - Add new location (requires `{ "city": "city_name" }`)
- `PUT /api/locations/:id` - Update location (favorite status, etc.)
- `DELETE /api/locations/:id` - Delete location and associated weather data
- `POST /api/locations/:id/sync` - Manually sync weather data
- `GET /api/locations/:id/forecast` - Get 5-day forecast
- `GET /api/locations/:id/history` - Get weather history (last 50 snapshots)

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

##  Testing

Run the test suite:

```bash
cd backend
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

##  UI Features

- **Location Management**: Add, remove, and favorite cities
- **Weather Display**: Current weather with detailed metrics
- **5-Day Forecast**: Visual forecast cards with temperature, humidity, and conditions
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Manual sync with loading states
- **Error Feedback**: User-friendly error messages

##  Data Models

### Location Schema
```javascript
{
  city: String (required),
  country: String,
  lat: Number,
  lon: Number,
  isFavorite: Boolean (default: false),
  lastSynced: Date,
  timestamps: true
}
```

### Weather Snapshot Schema
```javascript
{
  location: ObjectId (ref: 'Location'),
  temperature: Number (required),
  humidity: Number (required),
  description: String (required),
  windSpeed: Number,
  pressure: Number,
  feelsLike: Number,
  timestamp: Date (default: Date.now)
}
```

### User Preferences Schema
```javascript
{
  units: String (enum: ['metric', 'imperial', 'kelvin'], default: 'metric'),
  refreshInterval: Number (default: 300000, min: 60000),
  autoSync: Boolean (default: false),
  theme: String (enum: ['light', 'dark'], default: 'light'),
  notifications: {
    enabled: Boolean (default: false),
    weatherAlerts: Boolean (default: false)
  }
}
```

##  Technical Decisions

### API Integration
- **OpenWeatherMap API**: Chosen for free tier and comprehensive documentation
- **Error Handling**: Graceful handling of rate limits, invalid cities, and network failures
- **Data Caching**: Local storage reduces API calls and provides offline capability

### Database Design
- **MongoDB**: Document-based storage fits well with weather data structure
- **Mongoose**: Provides schema validation and convenient query methods
- **Relationships**: Proper foreign key relationships between locations and weather data

### Frontend Architecture
- **React Hooks**: Modern state management with useState and useEffect
- **Component Structure**: Single-page application with modular components
- **CSS Grid**: Responsive layout without external UI libraries

### Error Handling Strategy
- **Backend**: Centralized error handling middleware with asyncHandler
- **Frontend**: Try-catch blocks with user-friendly error messages
- **API Errors**: Proper HTTP status codes and descriptive error responses

##  Assessment Requirements Met

✅ **API Integration**: Current weather and 5-day forecast with error handling  
✅ **Database & Data Persistence**: MongoDB with proper schema and relationships  
✅ **CRUD Operations**: Full functionality for location management  
✅ **User Interface**: Modern React interface with all required features  
✅ **Data Synchronization**: Manual sync with timestamps and history  
✅ **Code Quality**: Clean, readable code with proper structure  
✅ **Documentation**: Comprehensive README and inline comments  
✅ **Testing**: Unit tests for API endpoints  

##  Bonus Features Implemented

- **Responsive Design**: Mobile-friendly interface
- **Comprehensive Error Handling**: Graceful failure management
- **Data History**: Weather snapshot storage and retrieval
- **User Preferences**: Customizable settings
- **Modern UI**: Clean, professional design with animations

##  Future Enhancements

- **Automatic Sync**: Background jobs for periodic weather updates
- **Weather Alerts**: Notification system for severe weather
- **Data Visualization**: Charts for weather trends
- **Authentication**: User accounts and data isolation
- **API Rate Limiting**: Built-in rate limiting for endpoints
- **Docker Support**: Containerized deployment

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

