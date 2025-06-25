import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Weather API for
            <span className="text-primary-600"> Modern Developers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get reliable, real-time weather data with our premium API. 
            Start free, scale with confidence, and build amazing weather-powered applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link href="/#docs" className="btn-secondary text-lg px-8 py-3">
              View Documentation
            </Link>
          </div>

          {/* Live Weather Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Live Weather Demo</h3>
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">London, UK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-medium">18°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium">Partly Cloudy ⛅</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-medium">65%</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Powered by Umbrella Weather API
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
