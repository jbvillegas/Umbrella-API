import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import DashboardLayout from '../components/DashboardLayout'
import UsageChart from '../components/UsageChart'
import ApiKeyManager from '../components/ApiKeyManager'
import SubscriptionCard from '../components/SubscriptionCard'
import WeatherDemo from '../components/WeatherDemo'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    requestsThisMonth: 0,
    requestsLimit: 3000,
    tier: 'free'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <>
      <Head>
        <title>Dashboard - Umbrella Weather API</title>
      </Head>
      
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Here's your API usage overview and account details.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Requests This Month
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {stats.requestsThisMonth.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">
                of {stats.requestsLimit.toLocaleString()} limit
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(stats.requestsThisMonth / stats.requestsLimit) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Current Plan
              </h3>
              <p className="text-3xl font-bold text-gray-900 capitalize">
                {stats.tier}
              </p>
              <p className="text-gray-500 text-sm">
                {stats.tier === 'free' ? 'No charge' : 
                 stats.tier === 'premium' ? '$29.99/month' : '$99.99/month'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Success Rate
              </h3>
              <p className="text-3xl font-bold text-green-600">99.9%</p>
              <p className="text-gray-500 text-sm">Last 30 days</p>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Usage Analytics
            </h2>
            <UsageChart />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                API Keys
              </h2>
              <ApiKeyManager />
            </div>

            {/* Subscription */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Subscription
              </h2>
              <SubscriptionCard tier={stats.tier} />
            </div>
          </div>

          {/* Weather Demo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Try Your API
            </h2>
            <WeatherDemo />
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
