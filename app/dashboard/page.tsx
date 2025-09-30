'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUserProfile, useEmergencyData } from '../../hooks/useStoryblok';
import PanicButton from '../../components/PanicButton';
import EmergencyLogViewer from '../../components/EmergencyLogViewer';

export default function DashboardPage() {
  const { profile, loading: profileLoading, error } = useUserProfile();
  const { contacts, hospitals, logs, loading: dataLoading } = useEmergencyData();
  const [currentTime] = useState(new Date().toLocaleTimeString());
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show loading state
  if (profileLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl font-semibold text-gray-700">Loading from Storyblok...</div>
          <div className="text-sm text-gray-500 mt-2">Fetching your profile and emergency data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-red-600">Error loading profile</div>
          <div className="text-gray-600 mt-2">{error}</div>
          <div className="text-sm text-gray-500 mt-4">
            Check your Storyblok configuration and try again.
          </div>
        </div>
      </div>
    );
  }

  // Get user data from Storyblok or fallback
  const userData = {
    name: profile?.full_name || 'User',
    avatar: '👤',
    lastEmergency: getLastEmergencyDisplay(logs),
    activeContacts: contacts.length,
    systemStatus: 'Active',
    location: profile?.address?.split(',').slice(-2).join(',').trim() || 'Location not set'
  };

  // Helper function to get last emergency display
  function getLastEmergencyDisplay(emergencyLogs: any[]) {
    if (emergencyLogs.length === 0) {
      return 'None';
    }
    
    // Sort logs by timestamp/created_at and get the most recent
    const sortedLogs = emergencyLogs.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.created_at);
      const dateB = new Date(b.timestamp || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
    
    const lastLog = sortedLogs[0];
    const logDate = new Date(lastLog.timestamp || lastLog.created_at);
    const daysSince = Math.floor((Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) {
      return `Today - ${lastLog.severity_level} (${lastLog.outcome_status})`;
    } else if (daysSince === 1) {
      return `Yesterday - ${lastLog.severity_level} (${lastLog.outcome_status})`;
    } else if (daysSince < 7) {
      return `${daysSince} days ago - ${lastLog.severity_level} (${lastLog.outcome_status})`;
    } else {
      return `${logDate.toLocaleDateString()} - ${lastLog.severity_level}`;
    }
  }

  // Data verification function for debugging (kept for reference)
  const logDataVerification = () => {
    console.log('===== COMPLETE DATA VERIFICATION =====');
    
    console.log('👤 USER PROFILE DATA:');
    console.log('- Name:', profile?.full_name);
    console.log('- Age:', profile?.age);
    console.log('- Phone:', profile?.phone_number);
    console.log('- Address:', profile?.address);
    console.log('- Medical Conditions:', profile?.medical_conditions);
    console.log('- Allergies:', profile?.allergies);
    console.log('- Insurance:', profile?.insurance_provider);
    
    console.log('👥 EMERGENCY CONTACTS (' + contacts.length + '):');
    contacts.forEach((contact, index) => {
      console.log(`- Contact ${index + 1}:`, {
        name: contact.contact_name,
        relationship: contact.relationship,
        phone: contact.phone_number,
        isPrimary: contact.is_primary
      });
    });
    
    console.log('🏥 HOSPITALS (' + hospitals.length + '):');
    hospitals.forEach((hospital, index) => {
      console.log(`- Hospital ${index + 1}:`, {
        name: hospital.hospital_name,
        phone: hospital.phone_number,
        emergency: hospital.emergency_phone,
        status: hospital.availability_status,
        address: hospital.address
      });
    });
    
    console.log('📋 EMERGENCY LOGS (' + logs.length + '):');
    logs.forEach((log, index) => {
      console.log(`- Log ${index + 1}:`, {
        severity: log.severity_level,
        decision: log.agent_decision,
        status: log.outcome_status,
        summary: log.agent_summary
      });
    });
    
    console.log('===== END DATA VERIFICATION =====');
  };

  // Navigation menu items
  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: '🏠', description: 'Dashboard home' },
    { id: 'emergency', name: 'Emergency', icon: '🚨', description: 'Emergency tools' },
    { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal info' },
    { id: 'contacts', name: 'Contacts', icon: '👥', description: 'Emergency contacts' },
    { id: 'history', name: 'History', icon: '📋', description: 'Emergency logs' },
    { id: 'hospitals', name: 'Hospitals', icon: '🏥', description: 'Find hospitals' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Preferences' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex h-screen flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🚨</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">LifeGuard Pro Dashboard</h1>
                  <p className="text-sm text-gray-600">Emergency Response System • {currentTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">System Online</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    📍 {userData.location}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userData.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'overview' && (
              <div className="max-w-4xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome back, {userData.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Your emergency response system is ready and monitoring
                    </p>
                    
                    {/* Main Emergency Button */}
                    <div className="mb-8">
                      <PanicButton 
                        size="xl"
                        onEmergency={() => {
                          // Emergency callback handled
                        }}
                      />
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="text-3xl mb-2">✅</div>
                        <div className="text-2xl font-bold text-green-900">System Active</div>
                        <div className="text-sm text-green-700">All systems operational</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <div className="text-3xl mb-2">👥</div>
                        <div className="text-2xl font-bold text-blue-900">{userData.activeContacts} Contacts</div>
                        <div className="text-sm text-blue-700">Emergency contacts ready</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="text-2xl font-bold text-purple-900">{logs.length} Logs</div>
                        <div className="text-sm text-purple-700">Emergency history</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {logs.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Emergency Activity</h3>
                    <div className="space-y-4">
                      {logs.slice(0, 3).map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600">🚨</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{log.severity_level} Emergency</div>
                              <div className="text-sm text-gray-600">{log.agent_decision}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {new Date(log.timestamp || log.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm font-medium text-gray-700">{log.outcome_status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Information */}
                {profile?.medical_conditions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <div className="text-2xl mr-4">⚕️</div>
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">Medical Information</h3>
                        <p className="text-sm text-yellow-700">
                          Conditions: {profile.medical_conditions}
                          {profile.allergies && ` • Allergies: ${profile.allergies}`}
                          {profile.medications && ` • Medications: ${profile.medications}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'emergency' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Tools</h2>
                  <div className="text-center">
                    <PanicButton 
                      size="xl"
                      onEmergency={() => {
                        // Emergency callback handled
                      }}
                    />
                    <p className="text-gray-600 mt-6 max-w-md mx-auto">
                      Press the emergency button to connect with our AI Emergency Agent who will assess your situation and coordinate the appropriate response
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  {profile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Personal Details</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Name:</strong> {profile.full_name || 'Not set'}</div>
                          <div><strong>Age:</strong> {profile.age || 'Not set'}</div>
                          <div><strong>Phone:</strong> {profile.phone_number || 'Not set'}</div>
                          <div><strong>Email:</strong> {profile.email || 'Not set'}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Conditions:</strong> {profile.medical_conditions || 'None'}</div>
                          <div><strong>Allergies:</strong> {profile.allergies || 'None'}</div>
                          <div><strong>Medications:</strong> {profile.medications || 'None'}</div>
                          <div><strong>Insurance:</strong> {profile.insurance_provider || 'Not set'}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">Profile not loaded</div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'contacts' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
                  {contacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contacts.map((contact, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{contact.contact_name}</h3>
                            {contact.is_primary && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Primary</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Relationship: {contact.relationship}</div>
                            <div>Phone: {contact.phone_number}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No emergency contacts found</div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'history' && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency History</h2>
                  <EmergencyLogViewer 
                    userId="test-user"
                    maxLogs={10}
                    showRefreshButton={true}
                  />
                </div>
              </div>
            )}

            {activeSection === 'hospitals' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Hospitals</h2>
                  {hospitals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospitals.map((hospital, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">{hospital.hospital_name}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Phone: {hospital.phone_number}</div>
                            <div>Emergency: {hospital.emergency_phone}</div>
                            <div>Status: {hospital.availability_status}</div>
                            <div>Address: {hospital.address}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No hospitals found</div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Emergency Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Auto-call 911 on emergency</span>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Location sharing enabled</span>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">AI assessment enabled</span>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Email notifications</span>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">SMS notifications</span>
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Navigation */}
        <div className={`w-full lg:w-80 bg-white shadow-lg border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col order-first lg:order-last ${isMobileMenuOpen ? 'block' : 'hidden lg:flex'}`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
                <p className="text-sm text-gray-600">Quick access to all features</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* User Info Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userData.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900">{userData.name}</div>
                <div className="text-xs text-gray-500">Emergency System User</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}