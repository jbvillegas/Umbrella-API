import { useState } from 'react'
import Link from 'next/link'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for testing and small projects',
      features: [
        '3,000 requests/month',
        'Current weather data',
        'Basic weather info',
        'Community support',
        'Rate limit: 100/15min'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium',
      price: isAnnual ? 299 : 29.99,
      description: 'For serious applications and businesses',
      features: [
        '30,000 requests/month',
        'All Free features',
        '7-day forecasts',
        'Weather alerts',
        'UV index & air quality',
        'Email support',
        'Rate limit: 1,000/15min'
      ],
      cta: 'Start Premium',
      popular: true
    },
    {
      name: 'Enterprise',
      price: isAnnual ? 999 : 99.99,
      description: 'For large-scale applications',
      features: [
        '100,000 requests/month',
        'All Premium features',
        'Historical weather data',
        'Priority support',
        'SLA guarantee',
        'Custom integrations',
        'Rate limit: 10,000/15min'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for your project. All plans include our core features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                Save 17%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Free' ? '/signup' : '/dashboard'}
                  className={`w-full inline-block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Need custom pricing or have questions?
          </p>
          <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact our sales team →
          </Link>
        </div>
      </div>
    </section>
  )
}
