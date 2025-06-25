const router = require('express').Router();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateJWT } = require('../middlewares/auth');

// Get available subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: 0,
      currency: 'usd',
      requests_per_month: 3000,
      features: [
        'Current weather data',
        'Basic weather information',
        '100 requests per 15 minutes'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 2999, // $29.99
      currency: 'usd',
      requests_per_month: 30000,
      features: [
        'All Free features',
        '7-day weather forecasts',
        'Weather alerts',
        'UV index data',
        'Air quality information',
        '1,000 requests per 15 minutes',
        'Email support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 9999, // $99.99
      currency: 'usd',
      requests_per_month: 100000,
      features: [
        'All Premium features',
        'Historical weather data',
        'Premium data accuracy',
        '10,000 requests per 15 minutes',
        'Priority support',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  ];

  res.json({ plans });
});

// Create Stripe checkout session
router.post('/create-checkout-session', authenticateJWT, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    
    const planPrices = {
      premium: process.env.STRIPE_PREMIUM_PRICE_ID,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
    };

    if (!planPrices[planId]) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planPrices[planId],
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId: planId
      }
    });

    res.json({ checkout_url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful subscription
      console.log('Subscription successful:', session.metadata);
      // Update user's subscription in database
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get user's current subscription status
router.get('/subscription', authenticateJWT, async (req, res) => {
  // In production, fetch from database
  const mockSubscription = {
    user_id: req.user.id,
    plan: 'free',
    status: 'active',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usage: {
      requests_this_month: Math.floor(Math.random() * 1000),
      requests_limit: 3000
    }
  };

  res.json(mockSubscription);
});

module.exports = router;
