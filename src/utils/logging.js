const { v4: uuidv4 } = require('uuid');

// Add unique request ID to each request
const addRequestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Enhanced logging utility
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  error: (message, error = null, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      apiKey: req.apiKey ? 'present' : 'missing'
    };
    
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

// API metrics tracking
const trackApiUsage = (req, res, next) => {
  // In production, this would update database with usage metrics
  const usage = {
    apiKey: req.apiKey,
    endpoint: req.path,
    method: req.method,
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  // Store usage data (implement with database)
  logger.info('API usage tracked', { usage });
  
  next();
};

module.exports = { 
  addRequestId, 
  logger, 
  requestLogger, 
  trackApiUsage 
};
