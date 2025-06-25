const { v4: uuidv4 } = require('uuid');
const prisma = require('./database');

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

// API metrics tracking with database storage
const trackApiUsage = async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    try {
      const duration = Date.now() - start;
      
      // Only track if we have a valid API key and user
      if (req.apiKeyRecord && req.user) {
        await prisma.usageRecord.create({
          data: {
            userId: req.user.id,
            apiKeyId: req.apiKeyRecord.id,
            endpoint: req.route?.path || req.path,
            method: req.method,
            statusCode: res.statusCode,
            responseTime: duration,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent') || null
          }
        });
      }
    } catch (error) {
      logger.error('Failed to track API usage', error);
    }
  });
  
  next();
};

// Get usage statistics for a user
const getUserUsageStats = async (userId, startDate, endDate) => {
  try {
    const stats = await prisma.usageRecord.groupBy({
      by: ['endpoint'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      },
      _avg: {
        responseTime: true
      }
    });

    const totalRequests = await prisma.usageRecord.count({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return {
      totalRequests,
      endpointStats: stats.map(stat => ({
        endpoint: stat.endpoint,
        requests: stat._count.id,
        avgResponseTime: Math.round(stat._avg.responseTime || 0)
      }))
    };
  } catch (error) {
    logger.error('Failed to get usage stats', error);
    throw error;
  }
};

// Get daily usage for charts
const getDailyUsage = async (userId, days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const usage = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as requests
      FROM usage_records 
      WHERE user_id = ${userId}
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return usage;
  } catch (error) {
    logger.error('Failed to get daily usage', error);
    throw error;
  }
};

module.exports = { 
  addRequestId, 
  logger, 
  requestLogger, 
  trackApiUsage,
  getUserUsageStats,
  getDailyUsage
};
