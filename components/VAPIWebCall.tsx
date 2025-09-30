'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VAPIWebCallProps {
  onCallComplete: (result: any) => void;
  onError: (error: string) => void;
  onEmergencyDetected?: (severity: number, transcript: string) => void;
  emergencyType?: string;
}

export default function VAPIWebCall({ 
  onCallComplete, 
  onError, 
  onEmergencyDetected,
  emergencyType = 'panic_button' 
}: VAPIWebCallProps) {
  const [status, setStatus] = useState<string>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [vapi, setVapi] = useState<any>(null);
  const initializedRef = useRef(false);
  const callStartedRef = useRef(false);

  // Initialize VAPI with minimal setup
  useEffect(() => {
    const initVAPI = async () => {
      // Prevent duplicate initialization
      if (initializedRef.current) {
        return;
      }
      
      try {
        initializedRef.current = true;
        
        // Clean up any existing instance first
        if (vapi) {
          try {
            vapi.stop();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
        
        const publicKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        if (!publicKey || !assistantId) {
          throw new Error('VAPI keys not configured');
        }
        
        // Import VAPI
        const VapiModule = await import('@vapi-ai/web');
        const Vapi = VapiModule.default;
        
        // Create instance with proper configuration
        const vapiInstance = new Vapi(publicKey);
        
        // Event listeners for call management
        vapiInstance.on('call-start', () => {
          setStatus('connected');
          setError(null);
          
          // Send emergency notification when call starts
          triggerEmergencyNotifications();
        });
        
        vapiInstance.on('call-end', () => {
          setStatus('completed');
        });
        
        vapiInstance.on('error', (err: any) => {
          // Only show critical errors
          if (err.type === 'call-failed' || err.type === 'connection-failed') {
            setError(err.message || 'VAPI error');
            setStatus('error');
            onError(err.message || 'VAPI error');
          }
        });

        vapiInstance.on('message', async (message: any) => {
          // Handle status updates
          if (message.type === 'status-update') {
            if (message.status === 'in-progress') {
              setStatus('connected');
              setError(null);
            }
          }
          
          // Check for emergency keywords in transcript (no email sending)
          if (message.type === 'transcript' && message.transcript) {
            const transcript = message.transcript.toLowerCase();
            const emergencyKeywords = [
              'help', 'emergency', 'urgent', 'danger', 'accident', 'fall', 'hurt', 
              'pain', 'bleeding', 'unconscious', 'can\'t breathe', 'chest pain',
              'heart attack', 'stroke', 'ambulance', 'hospital', '911'
            ];
            
            const emergencyCount = emergencyKeywords.filter(keyword => 
              transcript.includes(keyword)
            ).length;
            
            if (emergencyCount >= 2) {
              const severity = Math.min(8 + emergencyCount, 10);
              
              if (onEmergencyDetected) {
                onEmergencyDetected(severity, message.transcript);
              }
              
              // No email sending here - only one email when call starts
            }
          }
        });
        
        setVapi(vapiInstance);
        setStatus('ready');
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Init failed';
        setError(errorMessage);
        setStatus('error');
        onError(errorMessage);
      }
    };
    
    initVAPI();
    
    // Cleanup function
    return () => {
      if (vapi) {
        try {
          vapi.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      initializedRef.current = false;
      callStartedRef.current = false;
    };
  }, []); // Empty dependency array to run only once

  // Auto-start call when ready
  useEffect(() => {
    if (vapi && status === 'ready') {
      startCall();
    }
  }, [vapi, status]);

  const startCall = async () => {
    if (!vapi) return;
    
    try {
      setStatus('connecting');
      setError(null);
      
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      
    } catch (err) {
      // Let VAPI events handle error status
    }
  };

  const endCall = () => {
    try {
      if (vapi) {
        vapi.stop();
      }
    } catch (error) {
      setStatus('completed');
    }
  };

  // Trigger emergency notifications when call starts
  const triggerEmergencyNotifications = async () => {
    try {
      // Get emergency contacts
      const contactsResponse = await fetch('/api/emergency-contacts');
      const contacts = await contactsResponse.json();
      
      if (!contacts || contacts.length === 0) {
        return;
      }

      // Prepare notification data
      const notificationData = {
        emergencyType: 'panic_button',
        severity: 8,
        location: 'Current location (from VAPI call)',
        timestamp: new Date().toISOString(),
        aiSummary: 'Emergency panic button activated - VAPI call started',
        storyblokLogId: null,
        contacts: contacts.slice(0, 3)
      };

      // Send notifications
      await fetch('/api/emergency/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      
    } catch (error) {
      // Silent error handling
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
             status === 'connecting' ? '📞' :
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
          
          {error && status !== 'connected' && (
            <div className="p-3 bg-red-50 rounded-lg mb-4">
              <div className="text-red-800 font-semibold">Error:</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          
          {error && status === 'connected' && (
            <div className="p-3 bg-green-50 rounded-lg mb-4">
              <div className="text-green-800 font-semibold">✅ Call Connected!</div>
              <div className="text-green-700 text-sm">Emergency agent is ready to help</div>
            </div>
          )}
          
          {status === 'connected' && (
            <div className="p-3 bg-green-50 rounded-lg mb-4">
              <div className="text-green-800 font-semibold">🎤 Connected!</div>
              <div className="text-green-700 text-sm">Speak about your emergency</div>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'ready' && (
              <div className="w-full bg-blue-100 text-blue-800 py-3 rounded-lg font-semibold text-center">
                Starting Emergency Call...
              </div>
            )}
            
            {status === 'connecting' && (
              <div className="w-full bg-yellow-100 text-yellow-800 py-3 rounded-lg font-semibold text-center">
                Connecting to Emergency Agent...
              </div>
            )}
            
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
                  
                  // Log to Storyblok (notifications already sent during call)
                  try {
                    const emergencyLogData = {
                      userId: 'test-user',
                      emergencyType: emergencyType,
                      severity: emergencyResponse.severity,
                      transcript: emergencyResponse.transcript || 'Call completed successfully',
                      location: {
                        latitude: 0,
                        longitude: 0,
                        address: 'Current location'
                      },
                      timestamp: emergencyResponse.timestamp,
                      aiDecision: 'Emergency call completed via VAPI agent',
                      actionsTaken: ['AI emergency assessment completed', 'Emergency contacts notified'],
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
                      emergencyResponse.storyblokLogId = logResult.storyblokId;
                      emergencyResponse.notificationsSent = 1;
                    }
                    
                  } catch (error) {
                    // Silent error handling
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