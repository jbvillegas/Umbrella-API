export default function Features() {
  const features = [
    {
      icon: '🚀',
      title: 'Easy Integration',
      description: 'Simple RESTful API with comprehensive documentation. Get started in minutes with your favorite programming language.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Global CDN and smart caching ensure sub-second response times worldwide.'
    },
    {
      icon: '📊',
      title: 'Rich Data',
      description: 'Current weather, forecasts, alerts, UV index, air quality, and historical data.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: '99.9% uptime SLA, encrypted connections, and enterprise-grade security.'
    },
    {
      icon: '📈',
      title: 'Scalable Pricing',
      description: 'Start free and scale with usage-based pricing that grows with your business.'
    },
    {
      icon: '🛠️',
      title: 'Developer Tools',
      description: 'Interactive dashboard, usage analytics, and comprehensive monitoring tools.'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to build amazing weather apps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our API provides comprehensive weather data with the reliability and performance your applications demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* API Code Example */}
        <div className="mt-16 bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Start Example</h3>
            <pre className="text-sm">
              <code className="text-green-400">{`curl -H "x-api-key: YOUR_API_KEY" \\
  "https://api.umbrella-weather.com/api/weather/current?city=London"

{
  "data": {
    "city": "London",
    "temperature": {
      "current": 18.5,
      "feels_like": 17.2
    },
    "weather": {
      "description": "partly cloudy",
      "icon": "04d"
    },
    "humidity": 65,
    "wind": { "speed": 3.5 }
  },
  "tier": "free"
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
