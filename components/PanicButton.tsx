'use client';

import React, { useState } from 'react';
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
  const [showVAPICall, setShowVAPICall] = useState(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  
  // Get user location for emergency
  const { getCurrentLocation, location } = useGeolocation();

  const sizeClasses = {
    md: 'w-32 h-32 text-lg',
    lg: 'w-48 h-48 text-xl',
    xl: 'w-64 h-64 text-2xl',
  };

  const handlePress = () => {
    if (disabled || showVAPICall || emergencyTriggered) return;
    
    setIsPressed(true);
    setEmergencyTriggered(true);
    
    // Get current location immediately
    getCurrentLocation();
    
    // Start VAPI call immediately
    setShowVAPICall(true);
    
    // Don't send email here - let VAPI handle it
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Emergency already triggered, cannot cancel
    if (emergencyTriggered) {
      return;
    }
    
    // Reset state if emergency hasn't been triggered yet
    setIsPressed(false);
  };


  // Trigger emergency notifications immediately
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
        location: location ? 
          `${location.coords.latitude}, ${location.coords.longitude}` : 
          'Location unavailable',
        timestamp: new Date().toISOString(),
        aiSummary: 'Emergency panic button activated - immediate response required',
        storyblokLogId: null,
        contacts: contacts.slice(0, 3)
      };

      // Send notifications
      await fetch('/api/emergency/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      
      // Also create emergency log
      await createEmergencyLog();
      
      // Call parent callback if provided
      if (onEmergency) {
        onEmergency();
      }
      
    } catch (error) {
      // Silent error handling
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

      // Store in localStorage as fallback until Storyblok API is implemented
      const existingLogs = JSON.parse(localStorage.getItem('emergency_logs') || '[]');
      existingLogs.push(emergencyData);
      localStorage.setItem('emergency_logs', JSON.stringify(existingLogs));
      
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle real-time emergency detection during VAPI call
  const handleEmergencyDetected = (severity: number, transcript: string) => {
    // Update UI to show emergency status
    if (severity >= 8) {
      // Critical emergency detected
    } else if (severity >= 5) {
      // Moderate emergency detected
    }
  };

  // Handle VAPI call completion
  const handleVAPICallComplete = async (result: any) => {
    setShowVAPICall(false);
    setEmergencyTriggered(false);
    
    // Show completion message
    alert(`Emergency Response Complete!\n\nAI Decision: ${result.decision?.summary || 'Emergency processed'}\nAction Taken: ${result.actionTaken || 'Response initiated'}\nSeverity Level: ${result.emergencyLevel || 'Unknown'}/10\n\nHelp is on the way!`);
  };

  // Handle VAPI call error
  const handleVAPICallError = (error: string) => {
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
          onClick={handlePress}
          disabled={disabled || showVAPICall || emergencyTriggered}
          className={`
            ${sizeClasses[size]}
            ${emergencyTriggered 
              ? 'bg-red-700 animate-pulse' 
              : showVAPICall
              ? 'bg-green-600 animate-pulse'
              : 'bg-red-600 hover:bg-red-700'
            }
            ${disabled || showVAPICall || emergencyTriggered ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
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
          <div className="text-3xl">
            {showVAPICall ? 'CALLING' : 'EMERGENCY'}
          </div>
          <div className="text-sm font-normal">
            {showVAPICall ? 'AI Agent Active' : 'Press to Call'}
          </div>
        </button>
        
        {emergencyTriggered && !showVAPICall && (
          <div className="text-center">
            <p className="text-green-600 font-semibold animate-pulse">
              🚨 Starting Emergency Call... 🚨
            </p>
            <p className="text-gray-600 text-sm">
              Connecting to AI Emergency Agent
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
        
        {!emergencyTriggered && !showVAPICall && (
          <div className="text-center max-w-xs">
            <p className="text-gray-600 text-sm">
              Press the emergency button to immediately start an emergency call with our AI Emergency Agent
            </p>
          </div>
        )}
      </div>

      {/* VAPI Web Call Interface */}
      {showVAPICall && (
        <VAPIWebCall
          key="emergency-call"
          onCallComplete={handleVAPICallComplete}
          onError={handleVAPICallError}
          onEmergencyDetected={handleEmergencyDetected}
          emergencyType="panic_button"
        />
      )}
    </>
  );
}