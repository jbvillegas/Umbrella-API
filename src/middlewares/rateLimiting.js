const prisma = require('../utils/database');

// Rate limiting configuration for different tiers
const RATE_LIMITS = {
  free: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
  premium: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
  enterprise: { windowMs: 15 * 60 * 1000, max: 10000 } // 10000 requests per 15 minutes
};

// Database-backed rate limiting middleware
const applyRateLimit = async (req, res, next) => {
  try {
    const tier = req.userTier || 'free';
    const identifier = req.apiKey || req.ip;
    const endpoint = req.route?.path || req.path;
    
    const limit = RATE_LIMITS[tier];
    if (!limit) {
      return next(); // No rate limit defined, allow request
    }

    const windowStart = new Date(Math.floor(Date.now() / limit.windowMs) * limit.windowMs);
    
    // Check current count for this window
    const existingRecord = await prisma.rateLimit.findUnique({
      where: {
        identifier_endpoint_windowStart: {
          identifier,
          endpoint,
          windowStart
        }
      }
    });

    if (existingRecord) {
      if (existingRecord.count >= limit.max) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `${tier} tier limit: ${limit.max} requests per ${limit.windowMs / 60000} minutes`,
          retryAfter: Math.ceil(limit.windowMs / 1000),
          limit: limit.max,
          remaining: 0,
          resetTime: new Date(windowStart.getTime() + limit.windowMs).toISOString()
        });
      }

      // Increment counter
      await prisma.rateLimit.update({
        where: { id: existingRecord.id },
        data: { count: existingRecord.count + 1 }
      });

      // Set response headers
      res.set({
        'X-RateLimit-Limit': limit.max,
        'X-RateLimit-Remaining': Math.max(0, limit.max - existingRecord.count - 1),
        'X-RateLimit-Reset': Math.ceil((windowStart.getTime() + limit.windowMs) / 1000)
      });
    } else {
      // Create new record
      await prisma.rateLimit.create({
        data: {
          identifier,
          endpoint,
          windowStart,
          count: 1
        }
      });

      // Set response headers
      res.set({
        'X-RateLimit-Limit': limit.max,
        'X-RateLimit-Remaining': limit.max - 1,
        'X-RateLimit-Reset': Math.ceil((windowStart.getTime() + limit.windowMs) / 1000)
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If rate limiting fails, allow the request to proceed
    next();
  }
};

// Cleanup old rate limit records (call this periodically)
const cleanupOldRateLimits = async () => {
  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    await prisma.rateLimit.deleteMany({
      where: {
        windowStart: {
          lt: cutoffTime
        }
      }
    });
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
  }
};

module.exports = { applyRateLimit, cleanupOldRateLimits };
