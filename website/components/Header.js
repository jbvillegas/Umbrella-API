import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌤️</span>
            <span className="text-xl font-bold text-gray-900">Umbrella</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/#docs" className="text-gray-600 hover:text-gray-900">
              Docs
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/#features" className="text-gray-600">Features</Link>
              <Link href="/#pricing" className="text-gray-600">Pricing</Link>
              <Link href="/#docs" className="text-gray-600">Docs</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600">Dashboard</Link>
                  <button onClick={logout} className="text-left text-gray-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600">Login</Link>
                  <Link href="/signup" className="btn-primary w-fit">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
