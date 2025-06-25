export default function Documentation() {
  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/weather/current',
      description: 'Get current weather for a city',
      tier: 'All tiers',
      example: `{
  "data": {
    "city": "London",
    "temperature": { "current": 18.5 },
    "weather": { "description": "partly cloudy" }
  }
}`
    },
    {
      method: 'GET', 
      endpoint: '/api/weather/forecast',
      description: 'Get 7-day weather forecast',
      tier: 'Premium+',
      example: `{
  "data": {
    "city": "London",
    "forecast": [...]
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/weather/alerts',
      description: 'Get weather alerts and warnings',
      tier: 'Premium+',
      example: `{
  "data": {
    "alerts": [...]
  }
}`
    }
  ]

  return (
    <section id="docs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h2>
          <p className="text-xl text-gray-600">
            Simple, RESTful API designed for developers
          </p>
        </div>

        {/* Authentication */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              All API requests require authentication using your API key. Include it in the request header:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
              <code>x-api-key: YOUR_API_KEY</code>
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-gray-900">Endpoints</h3>
          
          {endpoints.map((endpoint, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-900">
                  {endpoint.endpoint}
                </code>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {endpoint.tier}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{endpoint.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Example Request:</h4>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>
{`curl -H "x-api-key: YOUR_KEY" \\
  "https://api.umbrella-weather.com${endpoint.endpoint}?city=London"`}
                    </code>
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Example Response:</h4>
                  <pre className="bg-gray-900 text-yellow-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{endpoint.example}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'Free', limit: '100 requests / 15 minutes' },
              { tier: 'Premium', limit: '1,000 requests / 15 minutes' },
              { tier: 'Enterprise', limit: '10,000 requests / 15 minutes' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900">{item.tier}</h4>
                <p className="text-gray-600">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
