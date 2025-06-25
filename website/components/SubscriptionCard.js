import Link from 'next/link'

export default function SubscriptionCard({ tier }) {
  const tierInfo = {
    free: {
      name: 'Free',
      price: '$0',
      color: 'gray',
      features: ['3,000 requests/month', 'Basic weather data', 'Community support']
    },
    premium: {
      name: 'Premium', 
      price: '$29.99',
      color: 'blue',
      features: ['30,000 requests/month', 'Forecasts & alerts', 'Email support']
    },
    enterprise: {
      name: 'Enterprise',
      price: '$99.99', 
      color: 'purple',
      features: ['100,000 requests/month', 'Historical data', 'Priority support']
    }
  }

  const info = tierInfo[tier] || tierInfo.free

  return (
    <div className="space-y-4">
      <div className={`border-l-4 border-${info.color}-500 pl-4`}>
        <h3 className="text-lg font-semibold text-gray-900">
          Current Plan: {info.name}
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {info.price}<span className="text-sm font-normal text-gray-500">/month</span>
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Plan includes:</h4>
        <ul className="space-y-1">
          {info.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {tier === 'free' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Ready to upgrade?</h4>
          <p className="text-sm text-blue-700 mb-3">
            Get access to forecasts, alerts, and premium features.
          </p>
          <Link href="/upgrade" className="btn-primary text-sm">
            Upgrade to Premium
          </Link>
        </div>
      )}

      {tier !== 'free' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Next billing date:</span>
            <span className="text-gray-900">July 24, 2025</span>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button className="btn-secondary text-sm">
              Change Plan
            </button>
            <button className="text-red-600 hover:text-red-700 text-sm">
              Cancel Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
