'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUserProfile, useEmergencyData } from '../../hooks/useStoryblok';

export default function DashboardPage() {
  const { profile, loading: profileLoading, error } = useUserProfile();
  const { contacts, hospitals, logs, loading: dataLoading } = useEmergencyData();
  const [currentTime] = useState(new Date().toLocaleTimeString());

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

  // Handle emergency button press
  const handleEmergencyPress = () => {
    console.log('🚨 EMERGENCY BUTTON PRESSED!');
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
    
    // Summary alert for demo
    const summary = `🚨 EMERGENCY ALERT INITIATED!\n\n` +
      `📊 DATA VERIFICATION:\n` +
      `✅ User: ${profile?.full_name || 'Unknown'}\n` +
      `✅ Location: ${profile?.address || 'Not set'}\n` +
      `✅ Contacts: ${contacts.length} available\n` +
      `✅ Hospitals: ${hospitals.length} nearby\n` +
      `✅ Emergency History: ${logs.length} records\n\n` +
      `🤖 Next: VAPI AI integration\n` +
      `📱 All data successfully fetched from Storyblok!`;
      
    alert(summary);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with Real User Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-4xl mr-4">{userData.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {userData.name}
                </h1>
                <p className="text-gray-600">
                  Emergency Dashboard • {currentTime}
                </p>
                {profile?.age && (
                  <p className="text-sm text-gray-500">
                    Age: {profile.age} • Phone: {profile.phone_number}
                    {profile?.insurance_provider && ` • Insurance: ${profile.insurance_provider}`}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">System Status</div>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-700 font-medium">{userData.systemStatus}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Location</div>
                <div className="text-gray-700 font-medium">📍 {userData.location}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emergency Status Cards with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-800 font-semibold">System Status</div>
                <div className="text-2xl font-bold text-green-900">Online</div>
                {profile?.preferred_hospital?.hospital_name && (
                  <div className="text-xs text-green-700 mt-1">
                    Preferred: {profile.preferred_hospital.hospital_name}
                  </div>
                )}
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-800 font-semibold">Emergency Contacts</div>
                <div className="text-2xl font-bold text-blue-900">{userData.activeContacts} Active</div>
                {profile?.emergency_contact_primary?.contact_name && (
                  <div className="text-xs text-blue-700 mt-1">
                    Primary: {profile.emergency_contact_primary.contact_name}
                  </div>
                )}
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-800 font-semibold">Emergency History</div>
                <div className="text-lg font-bold text-purple-900">{logs.length} Total</div>
                <div className="text-xs text-purple-700 mt-1">
                  Last: {userData.lastEmergency}
                </div>
                {logs.length > 0 && (
                  <div className="text-xs text-purple-600 mt-1">
                    Recent: {logs[0]?.agent_decision || 'Unknown action'}
                  </div>
                )}
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
        </div>

        {/* Recent Emergency Alert (if there are logs) */}
        {logs.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">🕒</div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Most Recent Emergency</h3>
                {(() => {
                  const lastLog = logs.sort((a, b) => {
                    const dateA = new Date(a.timestamp || a.created_at);
                    const dateB = new Date(b.timestamp || b.created_at);
                    return dateB.getTime() - dateA.getTime();
                  })[0];
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong className="text-blue-900">Date:</strong> <span className="text-gray-800">{new Date(lastLog.timestamp || lastLog.created_at).toLocaleDateString()}</span>
                        <br />
                        <strong className="text-blue-900">Time:</strong> <span className="text-gray-800">{new Date(lastLog.timestamp || lastLog.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div>
                        <strong className="text-blue-900">Severity:</strong> <span className="text-gray-800">{lastLog.severity_level}</span>
                        <br />
                        <strong className="text-blue-900">Action Taken:</strong> <span className="text-gray-800">{lastLog.agent_decision}</span>
                      </div>
                      <div>
                        <strong className="text-blue-900">Status:</strong> <span className="text-gray-800">{lastLog.outcome_status}</span>
                        <br />
                        <strong className="text-blue-900">Response Time:</strong> <span className="text-gray-800">{lastLog.response_time_seconds}s</span>
                      </div>
                      {lastLog.agent_summary && (
                        <div className="col-span-full">
                          <strong className="text-blue-900">Summary:</strong> <span className="text-gray-800">{lastLog.agent_summary}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Medical Info Alert (if user has medical conditions) */}
        {profile?.medical_conditions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">⚕️</div>
              <div>
                <h3 className="font-semibold text-yellow-800">Medical Information</h3>
                <p className="text-sm text-yellow-700">
                  Conditions: {profile.medical_conditions}
                  {profile.allergies && ` • Allergies: ${profile.allergies}`}
                  {profile.medications && ` • Medications: ${profile.medications}`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Emergency Button */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 inline-block border border-gray-100">
            <button 
              onClick={handleEmergencyPress}
              className="w-72 h-72 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-8 focus:ring-red-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
              <div className="relative text-center">
                <div className="text-8xl mb-4">🚨</div>
                <div className="text-3xl font-bold mb-2">EMERGENCY</div>
                <div className="text-xl">Press & Hold for Help</div>
              </div>
            </button>
            <p className="text-gray-600 mt-4 max-w-md mx-auto">
              Emergency contacts: {userData.activeContacts} available
              {profile?.preferred_hospital?.hospital_name && (
                <>
                  <br />
                  <span className="text-sm">Preferred hospital: {profile.preferred_hospital.hospital_name}</span>
                </>
              )}
              <br />
              <span className="text-xs text-gray-500">Hospitals nearby: {hospitals.length} available</span>
            </p>
          </div>
        </div>

        {/* Real Data Preview Section - Enhanced */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Live Storyblok Data Verification</h3>
          
          {/* User Profile Data */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h4 className="font-medium text-gray-800 mb-2">👤 User Profile Data (from: test-user)</h4>
            {profile ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">Name:</strong> <span className="text-gray-800">{profile.full_name || 'Not set'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Age:</strong> <span className="text-gray-800">{profile.age || 'Not set'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Phone:</strong> <span className="text-gray-800">{profile.phone_number || 'Not set'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Email:</strong> <span className="text-gray-800">{profile.email || 'Not set'}</span>
                </div>
                <div className="col-span-2">
                  <strong className="text-gray-900">Address:</strong> <span className="text-gray-800">{profile.address || 'Not set'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Medical Conditions:</strong> <span className="text-gray-800">{profile.medical_conditions || 'None'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Allergies:</strong> <span className="text-gray-800">{profile.allergies || 'None'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Medications:</strong> <span className="text-gray-800">{profile.medications || 'None'}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Insurance:</strong> <span className="text-gray-800">{profile.insurance_provider || 'Not set'}</span>
                </div>
              </div>
            ) : (
              <div className="text-red-600">❌ User profile not loaded</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-medium text-gray-800 mb-2">👥 Emergency Contacts ({contacts.length})</h4>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <div key={index} className="text-gray-800 mb-2 p-2 bg-gray-50 rounded">
                    <div><strong className="text-gray-900">{contact.contact_name}</strong></div>
                    <div className="text-gray-800">Relationship: {contact.relationship}</div>
                    <div className="text-gray-800">Phone: {contact.phone_number}</div>
                    <div className="text-gray-800">Primary: {contact.is_primary ? 'Yes' : 'No'}</div>
                  </div>
                ))
              ) : (
                <div className="text-red-600">❌ No emergency contacts loaded</div>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-medium text-gray-800 mb-2">🏥 Hospitals ({hospitals.length})</h4>
              {hospitals.length > 0 ? (
                hospitals.map((hospital, index) => (
                  <div key={index} className="text-gray-800 mb-2 p-2 bg-gray-50 rounded">
                    <div><strong className="text-gray-900">{hospital.hospital_name}</strong></div>
                    <div className="text-gray-800">Phone: {hospital.phone_number}</div>
                    <div className="text-gray-800">Emergency: {hospital.emergency_phone}</div>
                    <div className="text-gray-800">Status: {hospital.availability_status}</div>
                  </div>
                ))
              ) : (
                <div className="text-red-600">❌ No hospitals loaded</div>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-medium text-gray-800 mb-2">📋 Emergency Logs ({logs.length})</h4>
              {logs.length > 0 ? (
                logs.slice(0, 3).map((log, index) => (
                  <div key={index} className="text-gray-800 mb-2 p-2 bg-gray-50 rounded">
                    <div><strong className="text-gray-900">Severity:</strong> <span className="text-gray-800">{log.severity_level}</span></div>
                    <div><strong className="text-gray-900">Decision:</strong> <span className="text-gray-800">{log.agent_decision}</span></div>
                    <div><strong className="text-gray-900">Status:</strong> <span className="text-gray-800">{log.outcome_status}</span></div>
                    <div><strong className="text-gray-900">Summary:</strong> <span className="text-gray-800">{log.agent_summary?.substring(0, 50)}...</span></div>
                  </div>
                ))
              ) : (
                <div className="text-yellow-600">⚠️ No emergency history</div>
              )}
            </div>
          </div>

          {/* API Status Summary */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow border-l-4 border-green-500">
            <h4 className="font-medium text-green-700 mb-2">✅ API Connection Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>User Profile:</strong> {profile ? '✅ Loaded' : '❌ Failed'}
              </div>
              <div>
                <strong>Contacts:</strong> {contacts.length > 0 ? `✅ ${contacts.length} found` : '❌ None found'}
              </div>
              <div>
                <strong>Hospitals:</strong> {hospitals.length > 0 ? `✅ ${hospitals.length} found` : '❌ None found'}
              </div>
              <div>
                <strong>Logs:</strong> {logs.length > 0 ? `✅ ${logs.length} found` : '⚠️ None found'}
              </div>
            </div>
          </div>
        </div>
        
        {/* User Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Profile Management */}
          <Link href="/profile" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">👤</div>
                <div className="text-blue-600 group-hover:translate-x-2 transition-transform duration-200">→</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 mb-4">
                Manage personal information, medical details, and account settings
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Update Profile →
              </div>
            </div>
          </Link>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="text-green-600 group-hover:translate-x-2 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Contacts</h3>
            <p className="text-gray-600 mb-4">
              Add, edit, and manage your emergency contact list
            </p>
            <div className="text-sm text-green-600 font-medium">
              Manage Contacts →
            </div>
          </div>

          {/* Emergency Log */}
          <Link href="/emergency-log" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📋</div>
                <div className="text-purple-600 group-hover:translate-x-2 transition-transform duration-200">→</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency History</h3>
              <p className="text-gray-600 mb-4">
                View past emergencies, responses, and incident reports
              </p>
              <div className="text-sm text-purple-600 font-medium">
                View History →
              </div>
            </div>
          </Link>

          {/* Hospital Finder */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🏥</div>
              <div className="text-red-600 group-hover:translate-x-2 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Hospitals</h3>
            <p className="text-gray-600 mb-4">
              Locate nearby hospitals and medical facilities
            </p>
            <div className="text-sm text-red-600 font-medium">
              Find Nearby →
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">⚙️</div>
              <div className="text-gray-600 group-hover:translate-x-2 transition-transform duration-200">→</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">
              Configure notifications, privacy, and emergency preferences
            </p>
            <div className="text-sm text-gray-600 font-medium">
              Open Settings →
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6 border border-indigo-200">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="flex items-center">
                  <span className="mr-3">📞</span>
                  <span className="font-medium">Call 911</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="flex items-center">
                  <span className="mr-3">📍</span>
                  <span className="font-medium">Share Location</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Information Footer */}
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Emergency Reminder
              </h3>
              <p className="text-red-700 mb-4">
                For immediate life-threatening emergencies, always call 911 first. 
                This dashboard supplements but does not replace professional emergency services.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:911"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
                >
                  📞 Call 911 Now
                </a>
                <button className="bg-red-100 text-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors">
                  🚨 Test Emergency Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}