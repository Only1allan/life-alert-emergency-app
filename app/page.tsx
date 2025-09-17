import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Header */}
          <div className="mb-8">
            <div className="text-6xl mb-4">🚨</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Life Alert
              <span className="text-blue-600 block">Emergency Response</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your personal emergency response system. Help is just one button press away. 
              Stay safe, stay connected, stay protected.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4 text-center">🆘</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              One-Touch Emergency
            </h3>
            <p className="text-gray-600 text-center">
              Press the panic button to instantly alert emergency services and your contacts with your exact location.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4 text-center">📍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              GPS Location Sharing
            </h3>
            <p className="text-gray-600 text-center">
              Your precise location is automatically shared with responders for faster emergency response times.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4 text-center">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Emergency Contacts
            </h3>
            <p className="text-gray-600 text-center">
              Instantly notify your family, friends, and medical professionals when you need help most.
            </p>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Quick Access
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/dashboard"
              className="flex flex-col items-center p-6 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🚨</div>
              <span className="font-semibold text-gray-900">Emergency Dashboard</span>
              <span className="text-sm text-gray-600 text-center">Access panic button</span>
            </Link>

            <Link
              href="/profile"
              className="flex flex-col items-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">👤</div>
              <span className="font-semibold text-gray-900">My Profile</span>
              <span className="text-sm text-gray-600 text-center">Medical info & settings</span>
            </Link>

            <Link
              href="/emergency-log"
              className="flex flex-col items-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📋</div>
              <span className="font-semibold text-gray-900">Emergency Log</span>
              <span className="text-sm text-gray-600 text-center">View history</span>
            </Link>

            <div className="flex flex-col items-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200 group cursor-pointer">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🏥</div>
              <span className="font-semibold text-gray-900">Find Hospitals</span>
              <span className="text-sm text-gray-600 text-center">Nearby medical facilities</span>
            </div>
          </div>
        </div>

        {/* Emergency Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              In Case of Emergency
            </h3>
            <p className="text-red-700 mb-6">
              For immediate life-threatening emergencies, always call 911 first. 
              This app is designed to supplement, not replace, traditional emergency services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:911"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                📞 Call 911
              </a>
              <Link
                href="/dashboard"
                className="bg-red-100 text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors duration-200"
              >
                🚨 Use Panic Button
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
