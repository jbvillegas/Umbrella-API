# 🌤️ Umbrella Weather API

A premium weather API service with tiered subscription plans, built for developers and businesses who need reliable weather data.

## ✨ Features

### Free Tier
- ✅ Current weather data
- ✅ Basic weather information (temperature, description, humidity)
- ✅ 100 requests per 15 minutes
- ✅ Community support

### Premium Tier ($29.99/month)
- ✅ All Free features
- ✅ 7-day weather forecasts
- ✅ Weather alerts and warnings
- ✅ UV index data
- ✅ Air quality information
- ✅ 1,000 requests per 15 minutes
- ✅ Email support

### Enterprise Tier ($99.99/month)
- ✅ All Premium features
- ✅ Historical weather data
- ✅ Premium data accuracy
- ✅ 10,000 requests per 15 minutes
- ✅ Priority support
- ✅ Custom integrations
- ✅ SLA guarantee

## 🚀 Quick Start

### 1. Get Your API Key
Visit our dashboard to get your free API key or upgrade to premium.

### 2. Make Your First Request
```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://api.umbrella-weather.com/api/weather/current?city=London"
```

### 3. Response
```json
{
  "data": {
    "city": "London",
    "country": "GB",
    "temperature": {
      "current": 18.5,
      "feels_like": 17.2,
      "min": 15.0,
      "max": 22.0
    },
    "weather": {
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04d"
    },
    "humidity": 65,
    "pressure": 1013,
    "wind": {
      "speed": 3.5,
      "direction": 230
    },
    "timestamp": "2025-06-24T10:30:00.000Z",
    "cached": false
  },
  "tier": "free"
}
```

## 📋 API Endpoints

### Weather Data
- `GET /api/weather/current` - Current weather (All tiers)
- `GET /api/weather/forecast` - Weather forecast (Premium+)
- `GET /api/weather/alerts` - Weather alerts (Premium+)
- `GET /api/weather/usage` - API usage stats (All tiers)

### Billing & Subscription
- `GET /api/billing/plans` - Available plans
- `GET /api/billing/subscription` - Current subscription
- `POST /api/billing/create-checkout-session` - Upgrade subscription

### Utility
- `GET /` - API information
- `GET /api/status` - Health check
- `GET /api/docs` - API documentation

## 🔧 Installation & Development

### Prerequisites
- Node.js 18+
- OpenWeather API key
- Stripe account (for payments)

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/umbrella-api.git
cd umbrella-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your keys
nano .env

# Install new dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
```env
# Required
OPENWEATHER_KEY=your_openweather_api_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# API Keys for testing
VALID_API_KEYS=demo_free_key,demo_premium_key
PREMIUM_API_KEYS=demo_premium_key
ENTERPRISE_API_KEYS=demo_enterprise_key
```

## 🧪 Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔐 Authentication

All weather endpoints require an API key:

**Header Method (Recommended):**
```
x-api-key: YOUR_API_KEY
```

**Query Parameter Method:**
```
?api_key=YOUR_API_KEY
```

## 📊 Rate Limits

| Tier | Requests per 15 min | Monthly Requests |
|------|---------------------|------------------|
| Free | 100 | 3,000 |
| Premium | 1,000 | 30,000 |
| Enterprise | 10,000 | 100,000 |

## 💳 Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic weather data |
| Premium | $29.99/month | Forecasts, alerts, UV/AQ data |
| Enterprise | $99.99/month | Historical data, priority support |

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Payment Processing:** Stripe
- **Weather Data:** OpenWeather API
- **Caching:** Node-Cache
- **Security:** Helmet, CORS, Rate Limiting
- **Testing:** Jest, Supertest

## 📈 Monetization Features

- ✅ Tiered subscription plans
- ✅ API key authentication
- ✅ Rate limiting per tier
- ✅ Usage tracking
- ✅ Stripe payment integration
- ✅ Feature gating
- ✅ Comprehensive error handling
- ✅ Request/response caching
- ✅ Detailed API documentation

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create umbrella-weather-api

# Set environment variables
heroku config:set OPENWEATHER_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_key

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Free Tier:** Community support via GitHub issues
- **Premium:** Email support within 24 hours
- **Enterprise:** Priority support within 4 hours

## 🔗 Links

- [Dashboard](https://dashboard.umbrella-weather.com)
- [API Documentation](https://api.umbrella-weather.com/api/docs)
- [Status Page](https://status.umbrella-weather.com)
- [Pricing](https://umbrella-weather.com/pricing)

---

Built with ❤️ for developers who need reliable weather data.
