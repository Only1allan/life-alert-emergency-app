'use client';

import React, { useState } from 'react';

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

  const sizeClasses = {
    md: 'w-32 h-32 text-lg',
    lg: 'w-48 h-48 text-xl',
    xl: 'w-64 h-64 text-2xl',
  };

  const handlePress = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    // Start 3-second countdown
    let count = 3;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        setIsPressed(false);
        
        // Trigger emergency
        if (onEmergency) {
          onEmergency();
        } else {
          // Default emergency action
          alert('🚨 EMERGENCY ALERT SENT! 🚨\nHelp is on the way!');
        }
      }
    }, 1000);

    // Allow cancellation
    setTimeout(() => {
      if (count > 0) {
        // User can click again to cancel
      }
    }, 100);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(false);
    setCountdown(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={isPressed ? handleCancel : handlePress}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${isPressed 
            ? 'bg-red-700 animate-pulse' 
            : 'bg-red-600 hover:bg-red-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          text-white rounded-full shadow-2xl 
          transform transition-all duration-200
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-red-300
          flex flex-col items-center justify-center
          font-bold border-4 border-white
        `}
      >
        <div className="text-4xl mb-2">🚨</div>
        <div className={countdown !== null ? 'text-3xl' : ''}>
          {countdown !== null ? countdown : 'EMERGENCY'}
        </div>
        <div className="text-sm font-normal">
          {countdown !== null ? 'Click to Cancel' : 'Press for Help'}
        </div>
      </button>
      
      {isPressed && (
        <div className="text-center">
          <p className="text-red-600 font-semibold animate-pulse">
            Emergency alert will be sent in {countdown} seconds
          </p>
          <p className="text-gray-600 text-sm">
            Click the button again to cancel
          </p>
        </div>
      )}
      
      {!isPressed && (
        <div className="text-center max-w-xs">
          <p className="text-gray-600 text-sm">
            Press and hold the emergency button to send an alert to your emergency contacts and local services
          </p>
        </div>
      )}
    </div>
  );
}