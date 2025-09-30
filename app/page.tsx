import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80"
            alt="Emergency Response Technology"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Emergency Response
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              LifeGuard Pro
              <span className="block text-blue-200">Emergency Response</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-blue-100">
              Your Safety, Our Priority
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered emergency response system that connects you with help instantly. 
              Stay safe, stay connected, stay protected with our cutting-edge technology.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-16">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Started Free
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">&lt; 3s</div>
                <div className="text-blue-200 text-sm">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-blue-200 text-sm">Lives Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Revolutionary Emergency Response Technology
                  </h2>
                  <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
                </div>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our AI-powered emergency response system combines advanced technology with human compassion to provide instant help when you need it most. With real-time location tracking, intelligent assessment, and seamless integration with emergency services, we ensure help is always just one button press away.
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h3>
                      <p className="text-gray-600 text-sm">Advanced machine learning algorithms assess emergency situations and coordinate optimal responses.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Instant Response</h3>
                      <p className="text-gray-600 text-sm">Get help in seconds with our optimized emergency response workflow and real-time monitoring.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Privacy & Security</h3>
                      <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade encryption and privacy-first design principles.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Medical Integration</h3>
                      <p className="text-gray-600 text-sm">Seamlessly connects with hospitals, emergency services, and medical professionals.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                  <Image
                    src="/images/emergency-response.jpg"
                    alt="AI Emergency Response Technology"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">&lt; 3s</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-us" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose LifeGuard Pro?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the future of emergency response with our comprehensive suite of safety features designed to protect you and your loved ones.
              </p>
              <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-8"></div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🚨',
                  title: 'One-Touch Emergency',
                  description: 'Press the panic button to instantly alert emergency services and your contacts with your exact location.',
                  color: 'red',
                  image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80'
                },
                {
                  icon: '🤖',
                  title: 'AI-Powered Assessment',
                  description: 'Our intelligent AI agent assesses your situation and coordinates the most appropriate response.',
                  color: 'blue',
                  image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80'
                },
                {
                  icon: '📍',
                  title: 'GPS Location Sharing',
                  description: 'Your precise location is automatically shared with responders for faster emergency response times.',
                  color: 'green',
                  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
                },
                {
                  icon: '👥',
                  title: 'Emergency Contacts',
                  description: 'Instantly notify your family, friends, and medical professionals when you need help most.',
                  color: 'purple',
                  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
                },
                {
                  icon: '📱',
                  title: 'Smart Integration',
                  description: 'Seamlessly integrates with your existing devices and emergency services for maximum coverage.',
                  color: 'indigo',
                  image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                },
                {
                  icon: '⚡',
                  title: 'Instant Response',
                  description: 'Get help in seconds with our optimized emergency response workflow and real-time monitoring.',
                  color: 'yellow',
                  image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80'
                }
              ].map((feature, index) => (
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Learn More Link */}
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                      <span className="text-sm">Learn More</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Quick Access
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get instant access to all your emergency tools and information
              </p>
              <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-8"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/dashboard"
                className="group flex flex-col items-center p-8 rounded-2xl bg-white hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚨</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Emergency Dashboard</h3>
                <p className="text-sm text-gray-600 text-center">Access panic button and emergency tools</p>
              </Link>

              <Link
                href="/profile"
                className="group flex flex-col items-center p-8 rounded-2xl bg-white hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">My Profile</h3>
                <p className="text-sm text-gray-600 text-center">Medical info & personal settings</p>
              </Link>

              <Link
                href="/emergency-log"
                className="group flex flex-col items-center p-8 rounded-2xl bg-white hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Emergency History</h3>
                <p className="text-sm text-gray-600 text-center">View past emergency incidents</p>
              </Link>

              <div className="group flex flex-col items-center p-8 rounded-2xl bg-white hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Find Hospitals</h3>
                <p className="text-sm text-gray-600 text-center">Locate nearby medical facilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Info Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-3xl p-12 shadow-lg">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-3xl font-bold text-red-800 mb-6">
                In Case of Emergency
              </h3>
              <p className="text-xl text-red-700 mb-8 leading-relaxed">
                For immediate life-threatening emergencies, always call 911 first. 
                This app is designed to supplement, not replace, traditional emergency services.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="tel:911"
                  className="group inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-2xl mr-3">📞</span>
                  Call 911 Now
                </a>
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-2xl mr-3">🚨</span>
                  Use Panic Button
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">LifeGuard Pro</h3>
                    <p className="text-gray-400 text-sm">Emergency Response</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                  Advanced AI-powered emergency response system that connects you with help instantly. 
                  Stay safe, stay connected, stay protected.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social, index) => (
                    <a key={index} href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                      <span className="text-sm font-medium">{social[0]}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  {[
                    { name: 'Emergency Dashboard', href: '/dashboard' },
                    { name: 'My Profile', href: '/profile' },
                    { name: 'Emergency History', href: '/emergency-log' },
                    { name: 'About Us', href: '/about' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Support</h4>
                <ul className="space-y-4">
                  {[
                    { name: 'Privacy Policy', href: '/privacy' },
                    { name: 'Terms of Service', href: '/terms' },
                    { name: 'Contact Us', href: '/contact' },
                    { name: 'Emergency', href: '/dashboard' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  © 2025 LifeGuard Pro Emergency Response. All rights reserved.
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    System Online
                  </span>
                  <span>Version 1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
