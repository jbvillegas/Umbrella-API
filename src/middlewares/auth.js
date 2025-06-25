const jwt = require('jsonwebtoken');
const prisma = require('../utils/database');

// API KEY AUTHENTICATION MIDDLEWARE
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide a valid API key in x-api-key header or api_key query parameter'
    });
  }

  try {
    // Look up API key in database
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { 
        key: apiKey,
        isActive: true 
      },
      include: {
        user: {
          include: {
            subscriptions: {
              where: {
                status: 'ACTIVE',
                currentPeriodEnd: {
                  gte: new Date()
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });

    if (!apiKeyRecord) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is not valid or has been deactivated'
      });
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    });

    // Determine user's tier
    const userTier = apiKeyRecord.user.subscriptions[0]?.tier || apiKeyRecord.user.tier;

    // Attach info to request
    req.apiKey = apiKey;
    req.apiKeyRecord = apiKeyRecord;
    req.user = apiKeyRecord.user;
    req.userTier = userTier.toLowerCase();
    
    next();
  } catch (error) {
    console.error('Database error in API key authentication:', error);
    return res.status(500).json({ 
      error: 'Authentication service unavailable',
      message: 'Please try again later'
    });
  }
};

// JWT authentication for admin endpoints
const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Look up user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gte: new Date()
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userTier = user.subscriptions[0]?.tier?.toLowerCase() || user.tier.toLowerCase();
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    console.error('Database error in JWT authentication:', error);
    return res.status(500).json({ error: 'Authentication service unavailable' });
  }
};

module.exports = { authenticateApiKey, authenticateJWT };
