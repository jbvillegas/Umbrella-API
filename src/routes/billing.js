const router = require('express').Router();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateJWT } = require('../middlewares/auth');

// SUBSCRIPTION PLANS ENDPOINT
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

// STRIPE CHECKOUT SESSION ENDPOINT
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

// WEBHOOK
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // EVENT HANDLING
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      console.log('Subscription successful:', session.metadata);
      // UPDATE DATABASE
      break;
    case 'customer.subscription.deleted':
      // CANCELL SUBSCRIPTION
      console.log('Subscription cancelled');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// STATUS
router.get('/subscription', authenticateJWT, async (req, res) => {
  // FETCH FROM DATABASE
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
