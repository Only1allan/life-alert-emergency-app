'use client';

import React, { useState, useRef } from 'react';
import VAPIWebCall from './VAPIWebCall';
import useGeolocation from '../hooks/useGeolocation';

interface PanicButtonProps {
  onEmergency?: () => void;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

export default function PanicButton({ 
  onEmergency, 
  disabled = false,
  size = 'lg' 
}: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showVAPICall, setShowVAPICall] = useState(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get user location for emergency
  const { getCurrentLocation, location } = useGeolocation();

  const sizeClasses = {
    md: 'w-32 h-32 text-lg',
    lg: 'w-48 h-48 text-xl',
    xl: 'w-64 h-64 text-2xl',
  };

  const handlePress = () => {
    if (disabled || showVAPICall) return;
    
    console.log('🚨 PANIC BUTTON PRESSED - STARTING COUNTDOWN');
    
    setIsPressed(true);
    
    // Get current location immediately
    getCurrentLocation();
    
    // Start 3-second countdown
    let count = 3;
    setCountdown(count);
    
    timerRef.current = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timerRef.current!);
        triggerEmergency();
      }
    }, 1000);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (timerRef.current && !emergencyTriggered) {
      console.log('🚨 PANIC BUTTON CANCELLED');
      
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsPressed(false);
      setCountdown(null);
    }
  };

  // Trigger emergency response
  const triggerEmergency = async () => {
    console.log('🚨 EMERGENCY TRIGGERED - EXECUTING WORKFLOW');
    
    setEmergencyTriggered(true);
    setIsPressed(false);
    setCountdown(null);

    try {
      // Step 1: Get User Location (GPS/Browser)
      console.log('📍 Step 1: Getting user location...');
      if (!location) {
        getCurrentLocation();
      }
      
      // Step 2: Load User Profile from Storyblok (already loaded via useUserProfile)
      console.log('👤 Step 2: User profile loaded from Storyblok');
      
      // Step 3: VAPI AI Assessment Call
      console.log('🤖 Step 3: Initiating VAPI AI Assessment...');
      setShowVAPICall(true);

      // Step 4: Start emergency logging workflow
      console.log('📝 Step 4: Creating emergency log entry...');
      await createEmergencyLog();

      // Call parent callback if provided
      if (onEmergency) {
        onEmergency();
      }
    } catch (error) {
      console.error('❌ Emergency workflow error:', error);
      // Fallback to 911
      if (confirm('Emergency system error. Would you like to call 911 directly?')) {
        window.location.href = 'tel:911';
      }
    }
  };

  // Create emergency log entry in Storyblok
  const createEmergencyLog = async () => {
    try {
      const emergencyData = {
        timestamp: new Date().toISOString(),
        type: 'panic_button',
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        } : null,
        status: 'initiated',
        user_id: 'test-user' // This would come from auth context
      };

      // This would create a new emergency log entry in Storyblok
      console.log('📝 Emergency log created:', emergencyData);
      
      // Store in localStorage as fallback until Storyblok API is implemented
      const existingLogs = JSON.parse(localStorage.getItem('emergency_logs') || '[]');
      existingLogs.push(emergencyData);
      localStorage.setItem('emergency_logs', JSON.stringify(existingLogs));
      
    } catch (error) {
      console.error('Error creating emergency log:', error);
    }
  };

  // Handle VAPI call completion
  const handleVAPICallComplete = (result: any) => {
    console.log('✅ VAPI EMERGENCY CALL COMPLETED:', result);
    
    setShowVAPICall(false);
    setEmergencyTriggered(false);
    
    // Show completion message
    alert(`Emergency Response Complete!\n\nAI Decision: ${result.decision?.summary || 'Emergency processed'}\nAction Taken: ${result.actionTaken || 'Response initiated'}\nSeverity Level: ${result.emergencyLevel || 'Unknown'}/10\n\nHelp is on the way!`);
  };

  // Handle VAPI call error
  const handleVAPICallError = (error: string) => {
    console.error('❌ VAPI EMERGENCY CALL ERROR:', error);
    
    setShowVAPICall(false);
    setEmergencyTriggered(false);
    
    // Show error and fallback options
    const shouldCall911 = confirm(`Emergency Call Error: ${error}\n\nWould you like to call 911 directly now?`);
    
    if (shouldCall911) {
      // Open phone app to call 911
      window.location.href = 'tel:911';
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isPressed ? handleCancel : handlePress}
          disabled={disabled || showVAPICall}
          className={`
            ${sizeClasses[size]}
            ${isPressed 
              ? 'bg-red-700 animate-pulse' 
              : showVAPICall
              ? 'bg-green-600 animate-pulse'
              : 'bg-red-600 hover:bg-red-700'
            }
            ${disabled || showVAPICall ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
            text-white rounded-full shadow-2xl 
            transform transition-all duration-200
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-red-300
            flex flex-col items-center justify-center
            font-bold border-4 border-white
          `}
        >
          <div className="text-4xl mb-2">
            {showVAPICall ? '📞' : '🚨'}
          </div>
          <div className={countdown !== null ? 'text-3xl' : ''}>
            {showVAPICall ? 'CALLING' : countdown !== null ? countdown : 'EMERGENCY'}
          </div>
          <div className="text-sm font-normal">
            {showVAPICall ? 'AI Agent Active' : countdown !== null ? 'Click to Cancel' : 'Press for Help'}
          </div>
        </button>
        
        {isPressed && !showVAPICall && (
          <div className="text-center">
            <p className="text-red-600 font-semibold animate-pulse">
              Emergency alert will be sent in {countdown} seconds
            </p>
            <p className="text-gray-600 text-sm">
              Click the button again to cancel
            </p>
          </div>
        )}
        
        {showVAPICall && (
          <div className="text-center">
            <p className="text-green-600 font-semibold animate-pulse">
              🚨 EMERGENCY ACTIVE 🚨
            </p>
            <p className="text-gray-600 text-sm">
              AI Emergency Agent is processing your call
            </p>
          </div>
        )}
        
        {!isPressed && !showVAPICall && (
          <div className="text-center max-w-xs">
            <p className="text-gray-600 text-sm">
              Press the emergency button to connect with our AI Emergency Agent who will assess your situation and coordinate the appropriate response
            </p>
          </div>
        )}
      </div>

      {/* VAPI Web Call Interface */}
      {showVAPICall && (
        <VAPIWebCall
          onCallComplete={handleVAPICallComplete}
          onError={handleVAPICallError}
          emergencyType="panic_button"
        />
      )}
    </>
  );
}