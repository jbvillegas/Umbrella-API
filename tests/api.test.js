const request = require('supertest');
const app = require('../server');

describe('Umbrella Weather API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body.message).toBe('Welcome to Umbrella Weather API');
      expect(response.body.version).toBe('2.0.0');
    });
  });

  describe('GET /api/status', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/status')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.version).toBe('2.0.0');
    });
  });

  describe('GET /api/docs', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/api/docs')
        .expect(200);
      
      expect(response.body.title).toBe('Umbrella Weather API Documentation');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('Weather endpoints', () => {
    it('should require API key for weather data', async () => {
      await request(app)
        .get('/api/weather/current?city=London')
        .expect(401);
    });

    it('should return weather data with valid API key', async () => {
      const response = await request(app)
        .get('/api/weather/current?city=London')
        .set('x-api-key', 'demo_free_key')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(response.body.tier).toBe('free');
    });

    it('should reject forecast requests for free tier', async () => {
      await request(app)
        .get('/api/weather/forecast?city=London')
        .set('x-api-key', 'demo_free_key')
        .expect(403);
    });
  });

  describe('Billing endpoints', () => {
    it('should return subscription plans', async () => {
      const response = await request(app)
        .get('/api/billing/plans')
        .expect(200);
      
      expect(response.body.plans).toHaveLength(3);
      expect(response.body.plans[0].id).toBe('free');
    });
  });
});
