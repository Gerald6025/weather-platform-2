const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Location = require('../models/location');
const WeatherSnapshot = require('../models/weatherSnapshot');

describe('Weather API', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/weather-platform-test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clear database before each test
    await Location.deleteMany({});
    await WeatherSnapshot.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('Location Routes', () => {
    test('GET /api/locations should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/locations')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/locations should create a new location', async () => {
      // Mock the weather service to avoid API calls
      jest.mock('../services/weatherService', () => ({
        getCurrentWeather: jest.fn().mockResolvedValue({
          name: 'London',
          sys: { country: 'GB' },
          coord: { lat: 51.5074, lon: -0.1278 }
        })
      }));

      const response = await request(app)
        .post('/api/locations')
        .send({ city: 'London' })
        .expect(201);

      expect(response.body.city).toBe('London');
      expect(response.body.country).toBe('GB');
      expect(response.body.lat).toBe(51.5074);
      expect(response.body.lon).toBe(-0.1278);
    });

    test('POST /api/locations should return 400 for invalid city', async () => {
      const response = await request(app)
        .post('/api/locations')
        .send({ city: '' })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('PUT /api/locations/:id should update location', async () => {
      const location = await Location.create({
        city: 'Test City',
        country: 'TC',
        lat: 0,
        lon: 0
      });

      const response = await request(app)
        .put(`/api/locations/${location._id}`)
        .send({ isFavorite: true })
        .expect(200);

      expect(response.body.isFavorite).toBe(true);
    });

    test('DELETE /api/locations/:id should delete location', async () => {
      const location = await Location.create({
        city: 'Test City',
        country: 'TC',
        lat: 0,
        lon: 0
      });

      await request(app)
        .delete(`/api/locations/${location._id}`)
        .expect(200);

      const deletedLocation = await Location.findById(location._id);
      expect(deletedLocation).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('GET /api/locations/invalid-id should return 400', async () => {
      const response = await request(app)
        .get('/api/locations/invalid-id/forecast')
        .expect(400);

      expect(response.body.error).toContain('Invalid ID format');
    });

    test('GET /nonexistent-route should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });
  });
});
