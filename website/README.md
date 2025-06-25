# 🌐 Umbrella Weather API Website

A modern, responsive website for the Umbrella Weather API with user dashboard, subscription management, and comprehensive documentation.

## ✨ Features

- 🎨 **Modern Design** - Clean, professional interface with Tailwind CSS
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔐 **User Authentication** - Secure login/signup system
- 📊 **Dashboard** - Usage analytics, API key management, subscription details
- 💳 **Stripe Integration** - Subscription management and payments
- 📚 **Documentation** - Interactive API documentation
- ⚡ **Live Demo** - Try the API directly from the website
- 🎯 **Conversion Optimized** - Designed to convert visitors to customers

## 🚀 Quick Start

```bash
# Navigate to website directory
cd website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3001 to see the website.

## 🔧 Configuration

Update `.env.local` with your settings:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

## 📄 Pages

- **Homepage** (`/`) - Landing page with features, pricing, and documentation
- **Dashboard** (`/dashboard`) - User account and API management
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

## 🎨 Design System

Built with Tailwind CSS featuring:
- Consistent color palette (blue primary)
- Responsive typography
- Modern card-based layouts
- Smooth animations and transitions
- Professional weather-themed design

## 💻 Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Payments:** Stripe
- **Authentication:** Custom auth context
- **Notifications:** React Hot Toast

## 🔗 Integration with API

The website seamlessly integrates with your Umbrella Weather API:
- Real-time API testing
- Usage analytics display
- Subscription management
- API key generation

## 📈 Conversion Features

- **Social proof** - Customer testimonials and usage stats
- **Clear pricing** - Transparent subscription tiers
- **Easy onboarding** - Quick signup and API key generation
- **Interactive demos** - Try before you buy
- **Professional design** - Builds trust and credibility

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```bash
docker build -t umbrella-website .
docker run -p 3001:3001 umbrella-website
```

## 📊 Analytics

The website is designed to track:
- Visitor conversion rates
- API trial signups
- Subscription upgrades
- User engagement metrics

Integrate with Google Analytics, Mixpanel, or your preferred analytics platform.

## 🎯 SEO Optimized

- Semantic HTML structure
- Meta tags and Open Graph
- Fast loading times
- Mobile-first design
- Clean URLs

## 🔮 Future Enhancements

- Blog/content marketing section
- Customer testimonials
- Integration tutorials
- Community forum
- Advanced analytics dashboard

---

**This website will significantly boost your API's monetization potential by providing a professional, conversion-optimized interface for your customers.**
