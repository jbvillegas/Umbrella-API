const rateLimit = require('express-rate-limit');

// TIER DEPENDENT RATE LIMITING
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

const freeTierLimit = createRateLimiter(
  15 * 60 * 1000, //15 MINUTES
  100, // 100 REQUESTS
  'Free tier limit: 100 requests per 15 minutes. Upgrade to premium for higher limits.'
);

const premiumTierLimit = createRateLimiter(
  15 * 60 * 1000, // 15 MINUTES
  1000, // 1000 REQUESTS
  'Premium tier limit: 1000 requests per 15 minutes.'
);

const enterpriseTierLimit = createRateLimiter(
  15 * 60 * 1000, // 15 MINUTES
  10000, // 10000 REQUESTS
  'Enterprise tier limit: 10000 requests per 15 minutes.'
);

// MIDDLEWARE
const applyRateLimit = (req, res, next) => {
  // IN REALITY THIS LOOKS UP TO THE DATABASE OR ENVIRONMENT VARIABLE
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

// DATABASE LOOKUP FUNCTION
function getTierForApiKey(apiKey) {
  
  const premiumKeys = process.env.PREMIUM_API_KEYS ? process.env.PREMIUM_API_KEYS.split(',') : [];
  const enterpriseKeys = process.env.ENTERPRISE_API_KEYS ? process.env.ENTERPRISE_API_KEYS.split(',') : [];
  
  if (enterpriseKeys.includes(apiKey)) return 'enterprise';
  if (premiumKeys.includes(apiKey)) return 'premium';
  return 'free';
}

module.exports = { applyRateLimit, freeTierLimit, premiumTierLimit, enterpriseTierLimit };
