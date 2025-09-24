'use client';

import React, { useState, useEffect } from 'react';

interface VAPIWebCallProps {
  onCallComplete: (result: any) => void;
  onError: (error: string) => void;
  emergencyType?: string;
}

export default function VAPIWebCall({ 
  onCallComplete, 
  onError, 
  emergencyType = 'panic_button' 
}: VAPIWebCallProps) {
  const [status, setStatus] = useState<string>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [vapi, setVapi] = useState<any>(null);

  // Initialize VAPI with minimal setup
  useEffect(() => {
    const initVAPI = async () => {
      try {
        console.log('🔧 Initializing Basic VAPI...');
        
        const publicKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        if (!publicKey || !assistantId) {
          throw new Error('VAPI keys not configured');
        }
        
        // Import VAPI
        const VapiModule = await import('@vapi-ai/web');
        const Vapi = VapiModule.default;
        
        // Create instance
        const vapiInstance = new Vapi(publicKey);
        
        // Minimal event listeners
        vapiInstance.on('call-start', () => {
          console.log('📞 Call started');
          setStatus('connected');
        });
        
        vapiInstance.on('call-end', () => {
          console.log('📞 Call ended');
          setStatus('completed');
        });
        
        vapiInstance.on('error', (err: any) => {
          console.error('❌ VAPI Error:', err);
          setError(err.message || 'VAPI error');
          setStatus('error');
          onError(err.message || 'VAPI error');
        });
        
        setVapi(vapiInstance);
        setStatus('ready');
        console.log('✅ Basic VAPI initialized');
        
      } catch (err) {
        console.error('❌ Init error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Init failed';
        setError(errorMessage);
        setStatus('error');
        onError(errorMessage);
      }
    };
    
    initVAPI();
  }, [onError]);

  // Auto-start call when ready
  useEffect(() => {
    if (vapi && status === 'ready') {
      startCall();
    }
  }, [vapi, status]);

  const startCall = async () => {
    if (!vapi) return;
    
    try {
      console.log('🚨 Starting basic emergency call...');
      setStatus('connecting');
      
      // Simple call start
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      
      console.log('📞 Call started successfully');
      
    } catch (err) {
      console.error('❌ Start call error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Call failed';
      setError(errorMessage);
      setStatus('error');
      onError(errorMessage);
    }
  };

  const endCall = () => {
    try {
      if (vapi) {
        console.log('🔚 Ending call...');
        vapi.stop();
      }
    } catch (error) {
      console.error('End call error:', error);
      setStatus('completed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          
          <div className="text-6xl mb-4">
            {status === 'error' ? '⚠️' : 
             status === 'completed' ? '✅' : 
             status === 'connected' ? '🎤' : 
             '📞'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'initializing' && 'Initializing...'}
            {status === 'ready' && 'Starting Call...'}
            {status === 'connecting' && 'Connecting...'}
            {status === 'connected' && 'Emergency Call Active'}
            {status === 'completed' && 'Call Complete'}
            {status === 'error' && 'Error Occurred'}
          </h2>
          
          {error && (
            <div className="p-3 bg-red-50 rounded-lg mb-4">
              <div className="text-red-800 font-semibold">Error:</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          
          {status === 'connected' && (
            <div className="p-3 bg-green-50 rounded-lg mb-4">
              <div className="text-green-800 font-semibold">🎤 Connected!</div>
              <div className="text-green-700 text-sm">Speak about your emergency</div>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'connected' && (
              <button
                onClick={endCall}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                End Call
              </button>
            )}
            
            {status === 'completed' && (
              <button
                onClick={async () => {
                  const emergencyResponse = {
                    status: 'completed',
                    emergencyType: emergencyType,
                    timestamp: new Date().toISOString(),
                    decision: { summary: 'Emergency call completed' },
                    transcript: '', // Will be populated if available
                    severity: 5, // Default severity
                    duration: 0, // Will be calculated
                    storyblokLogId: '',
                    notificationsSent: 0
                  };
                  
                  // Send to Storyblok emergency logging
                  try {
                    console.log('📝 Logging emergency to Storyblok...');
                    
                    const emergencyLogData = {
                      userId: 'test-user', // This should come from auth context
                      emergencyType: emergencyType,
                      severity: emergencyResponse.severity,
                      transcript: emergencyResponse.transcript || 'Call completed successfully',
                      location: {
                        latitude: 0, // Will be populated from geolocation
                        longitude: 0,
                        address: 'Current location'
                      },
                      timestamp: emergencyResponse.timestamp,
                      aiDecision: 'Emergency call completed via VAPI agent',
                      actionsTaken: ['AI emergency assessment completed', 'Emergency contacts to be notified'],
                      duration: emergencyResponse.duration,
                      status: 'resolved' as const,
                      responseTime: emergencyResponse.duration
                    };

                    const logResponse = await fetch('/api/emergency/log', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(emergencyLogData)
                    });

                    const logResult = await logResponse.json();
                    
                    if (logResult.success) {
                      console.log('✅ Emergency logged to Storyblok:', logResult.logId);
                      emergencyResponse.storyblokLogId = logResult.storyblokId;
                      emergencyResponse.notificationsSent = logResult.notificationsSent;
                    } else {
                      console.error('❌ Failed to log to Storyblok:', logResult.error);
                    }
                    
                  } catch (error) {
                    console.error('❌ Error logging emergency:', error);
                  }
                  
                  onCallComplete(emergencyResponse);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Complete & Log Emergency
              </button>
            )}
            
            {status === 'error' && (
              <button
                onClick={() => window.location.href = 'tel:911'}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Call 911 Directly
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
