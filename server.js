require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route imports
const weatherRouter = require('./src/routes/weather');
const billingRouter = require('./src/routes/billing');

// Middleware imports
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');
const { addRequestId, requestLogger, trackApiUsage } = require('./src/utils/logging');

const app = express();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(addRequestId);
app.use(requestLogger);

// Public endpoints (no authentication required)
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Umbrella Weather API',
    version: '2.0.0',
    documentation: '/api/docs',
    endpoints: {
      weather: '/api/weather',
      billing: '/api/billing'
    },
    status: 'operational'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/weather', trackApiUsage, weatherRouter);
app.use('/api/billing', billingRouter);

// Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Umbrella Weather API Documentation',
    version: '2.0.0',
    base_url: `${req.protocol}://${req.get('host')}/api`,
    authentication: {
      type: 'API Key',
      header: 'x-api-key',
      description: 'Obtain API key from your dashboard'
    },
    rate_limits: {
      free: '100 requests per 15 minutes',
      premium: '1,000 requests per 15 minutes',
      enterprise: '10,000 requests per 15 minutes'
    },
    endpoints: {
      'GET /weather/current': {
        description: 'Get current weather for a city',
        parameters: {
          city: 'string (required) - City name'
        },
        tiers: 'All'
      },
      'GET /weather/forecast': {
        description: 'Get weather forecast',
        parameters: {
          city: 'string (required) - City name',
          days: 'number (optional) - Number of days (1-7)'
        },
        tiers: 'Premium, Enterprise'
      },
      'GET /weather/alerts': {
        description: 'Get weather alerts',
        parameters: {
          city: 'string (required) - City name'
        },
        tiers: 'Premium, Enterprise'
      },
      'GET /weather/usage': {
        description: 'Get API usage statistics',
        parameters: {},
        tiers: 'All'
      }
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌤️  Umbrella Weather API v2.0.0 running on port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/status`);
});