const rateLimit = require('express-rate-limit');

// Rate limiting configuration for different tiers
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Rate limit exceeded',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.apiKey || req.ip;
    }
  });
};

// Different rate limits for different subscription tiers
const freeTierLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Free tier limit: 100 requests per 15 minutes. Upgrade to premium for higher limits.'
);

const premiumTierLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  1000, // 1000 requests per 15 minutes
  'Premium tier limit: 1000 requests per 15 minutes.'
);

const enterpriseTierLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10000, // 10000 requests per 15 minutes
  'Enterprise tier limit: 10000 requests per 15 minutes.'
);

// Middleware to apply appropriate rate limit based on API key tier
const applyRateLimit = (req, res, next) => {
  // In production, determine tier from database lookup
  const apiKeyTier = getTierForApiKey(req.apiKey);
  
  switch (apiKeyTier) {
    case 'premium':
      return premiumTierLimit(req, res, next);
    case 'enterprise':
      return enterpriseTierLimit(req, res, next);
    default:
      return freeTierLimit(req, res, next);
  }
};

// Helper function to determine tier (implement with database lookup)
function getTierForApiKey(apiKey) {
  // Temporary implementation - in production, look up in database
  const premiumKeys = process.env.PREMIUM_API_KEYS ? process.env.PREMIUM_API_KEYS.split(',') : [];
  const enterpriseKeys = process.env.ENTERPRISE_API_KEYS ? process.env.ENTERPRISE_API_KEYS.split(',') : [];
  
  if (enterpriseKeys.includes(apiKey)) return 'enterprise';
  if (premiumKeys.includes(apiKey)) return 'premium';
  return 'free';
}

module.exports = { applyRateLimit, freeTierLimit, premiumTierLimit, enterpriseTierLimit };
