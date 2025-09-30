'use client';

import React, { useState } from 'react';
import VAPIWebCall from '../../components/VAPIWebCall';

export default function DemoPage() {
  const [showVAPICall, setShowVAPICall] = useState(false);
  const [callResult, setCallResult] = useState<any>(null);

  const handleEmergencyDetected = (severity: number, transcript: string) => {
    console.log(`🚨 EMERGENCY DETECTED: Severity ${severity}/10`);
    console.log(`📝 Transcript: ${transcript}`);
  };

  const handleVAPICallComplete = (result: any) => {
    console.log('✅ VAPI CALL COMPLETED:', result);
    setCallResult(result);
    setShowVAPICall(false);
  };

  const handleVAPICallError = (error: string) => {
    console.error('❌ VAPI CALL ERROR:', error);
    setShowVAPICall(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">🚨</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Emergency System Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Test the VAPI emergency call system with real speech recognition
          </p>
          
          <button
            onClick={() => setShowVAPICall(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🚨 Start Emergency Call Test
          </button>
          
          {callResult && (
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Call Completed!</h3>
              <div className="text-sm text-green-700">
                <p><strong>Status:</strong> {callResult.status}</p>
                <p><strong>Emergency Type:</strong> {callResult.emergencyType}</p>
                <p><strong>Severity:</strong> {callResult.severity}/10</p>
                <p><strong>Decision:</strong> {callResult.decision?.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VAPI Web Call Interface */}
      {showVAPICall && (
        <VAPIWebCall
          onCallComplete={handleVAPICallComplete}
          onError={handleVAPICallError}
          onEmergencyDetected={handleEmergencyDetected}
          emergencyType="demo_test"
        />
      )}
    </div>
  );
}
