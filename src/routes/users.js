const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/database');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tier: 'FREE'
      }
    });

    // Create default subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'FREE',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    // Generate API key
    const apiKey = `uk_${user.tier.toLowerCase()}_${uuidv4().replace(/-/g, '')}`;
    await prisma.apiKey.create({
      data: {
        key: apiKey,
        name: 'Default API Key',
        userId: user.id
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier
      },
      token,
      apiKey
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
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
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.subscriptions[0]?.tier || user.tier
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
        },
        apiKeys: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.subscriptions[0]?.tier || user.tier,
        createdAt: user.createdAt
      },
      subscription: user.subscriptions[0] || null,
      apiKeys: user.apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        key: key.key,
        lastUsedAt: key.lastUsedAt,
        createdAt: key.createdAt
      }))
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile'
    });
  }
});

// Generate new API key
router.post('/api-keys', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'API key name is required'
      });
    }

    const userTier = req.userTier;
    const apiKey = `uk_${userTier}_${uuidv4().replace(/-/g, '')}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
        name,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key,
        createdAt: newApiKey.createdAt
      }
    });
  } catch (error) {
    console.error('API key creation error:', error);
    res.status(500).json({
      error: 'Failed to create API key'
    });
  }
});

// Delete API key
router.delete('/api-keys/:keyId', authenticateJWT, async (req, res) => {
  try {
    const { keyId } = req.params;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: req.user.id
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        error: 'API key not found'
      });
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false }
    });

    res.json({
      message: 'API key deactivated successfully'
    });
  } catch (error) {
    console.error('API key deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete API key'
    });
  }
});

module.exports = router;
