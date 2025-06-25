const jwt = require('jsonwebtoken');

// API KEY AUTHENTICATION MIDDLEWARE
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide a valid API key in x-api-key header or api_key query parameter'
    });
  }

  //THIS NEEDS VALIDATION AGAINST A DATABASE OR ENVIRONMENT VARIABLE
  const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  // RATE LIMITING LOGIC: 
  req.apiKey = apiKey;
  next();
};

// JWT authentication for admin endpoints
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateApiKey, authenticateJWT };
