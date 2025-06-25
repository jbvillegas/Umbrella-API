import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌤️</span>
              <span className="text-xl font-bold">Umbrella</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium weather API for modern developers. Reliable, fast, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white">Discord</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#features" className="hover:text-white">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/#docs" className="hover:text-white">Documentation</Link></li>
              <li><Link href="/status" className="hover:text-white">Status</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/community" className="hover:text-white">Community</Link></li>
              <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/security" className="hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Umbrella Weather API. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
