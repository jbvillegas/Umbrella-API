// GLOBAL ERROR HANDLER MIDDLEWARE
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // OPENWEATHERMAP API ERRORS
  if (err.response && err.response.status) {
    const status = err.response.status;
    const message = err.response.data?.message || 'External API error';
    
    switch (status) {
      case 400:
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid request parameters',
          details: message
        });
      case 401:
        return res.status(500).json({
          error: 'Service Configuration Error',
          message: 'Weather service authentication failed'
        });
      case 404:
        return res.status(404).json({
          error: 'Location Not Found',
          message: 'The specified location could not be found'
        });
      case 429:
        return res.status(503).json({
          error: 'Service Temporarily Unavailable',
          message: 'Weather service rate limit exceeded. Please try again later.'
        });
      default:
        return res.status(502).json({
          error: 'External Service Error',
          message: 'Weather service is currently unavailable'
        });
    }
  }

  // JWT ERRORS
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided authentication token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The authentication token has expired'
    });
  }

  // VALIDATION ERRORS
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }

  // RATE LIMIT ERRORS
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: err.message || 'Too many requests. Please try again later.',
      retryAfter: err.retryAfter
    });
  }

  // DEFAULT SERVER ERROR
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
};

// 404 
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Endpoint Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    available_endpoints: {
      'GET /api/weather/current': 'Get current weather for a city',
      'GET /api/weather/forecast': 'Get weather forecast (Premium)',
      'GET /api/weather/alerts': 'Get weather alerts (Premium)',
      'GET /api/weather/usage': 'Get API usage statistics',
      'GET /api/billing/plans': 'Get available subscription plans',
      'GET /api/billing/subscription': 'Get current subscription status'
    }
  });
};

module.exports = { errorHandler, notFoundHandler };
