import { useState } from 'react'
import toast from 'react-hot-toast'

export default function WeatherDemo() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState(null)

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.error('Please enter a city name')
      return
    }

    setLoading(true)
    try {
      // Demo data - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setWeather({
        city: city,
        country: 'UK',
        temperature: {
          current: Math.round(Math.random() * 30 + 5),
          feels_like: Math.round(Math.random() * 30 + 5),
          min: Math.round(Math.random() * 20 + 5),
          max: Math.round(Math.random() * 35 + 10)
        },
        weather: {
          main: 'Clouds',
          description: 'broken clouds',
          icon: '04d'
        },
        humidity: Math.round(Math.random() * 100),
        pressure: Math.round(Math.random() * 100 + 1000),
        wind: {
          speed: Math.round(Math.random() * 10 + 1),
          direction: Math.round(Math.random() * 360)
        },
        cached: false
      })
      
      toast.success('Weather data fetched!')
    } catch (error) {
      toast.error('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city name (e.g., London)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          className="input-field flex-1"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {weather && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {weather.city}, {weather.country}
              </h3>
              <p className="text-gray-600 capitalize">
                {weather.weather.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {weather.temperature.current}°C
              </div>
              <div className="text-sm text-gray-600">
                Feels like {weather.temperature.feels_like}°C
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Min/Max:</span>
              <div className="font-medium">
                {weather.temperature.min}°C / {weather.temperature.max}°C
              </div>
            </div>
            <div>
              <span className="text-gray-600">Humidity:</span>
              <div className="font-medium">{weather.humidity}%</div>
            </div>
            <div>
              <span className="text-gray-600">Pressure:</span>
              <div className="font-medium">{weather.pressure} hPa</div>
            </div>
            <div>
              <span className="text-gray-600">Wind:</span>
              <div className="font-medium">{weather.wind.speed} m/s</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 flex justify-between">
            <span>Response time: 0.8s</span>
            <span>{weather.cached ? 'Cached' : 'Fresh data'}</span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">API Call Example:</h4>
        <pre className="text-sm text-gray-700 overflow-x-auto">
          <code>
{`curl -H "x-api-key: YOUR_API_KEY" \\
  "${process.env.NEXT_PUBLIC_API_URL || 'https://api.umbrella-weather.com'}/api/weather/current?city=${city || 'London'}"`}
          </code>
        </pre>
      </div>
    </div>
  )
}
