'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FalseAlarmDetectionProps {
  onConfirmEmergency: () => void;
  onConfirmFalseAlarm: () => void;
  onTimeout: () => void;
  timeoutSeconds?: number;
  className?: string;
}

export default function FalseAlarmDetection({ 
  onConfirmEmergency, 
  onConfirmFalseAlarm, 
  onTimeout, 
  timeoutSeconds = 30,
  className = '' 
}: FalseAlarmDetectionProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeoutSeconds);
  const [isActive, setIsActive] = useState(true);
  const [userResponded, setUserResponded] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for false alarm detection
  useEffect(() => {
    audioRef.current = new Audio('/sounds/alert-sound.mp3');
    audioRef.current.load();
    
    // Play alert sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, []);

  // Start countdown timer
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - assume real emergency
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Handle timeout (assume real emergency)
  const handleTimeout = () => {
    console.log('⏰ FALSE ALARM DETECTION TIMEOUT - ASSUMING REAL EMERGENCY');
    
    setIsActive(false);
    setUserResponded(true);
    
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    onTimeout();
  };

  // Handle emergency confirmation
  const handleConfirmEmergency = () => {
    console.log('🚨 USER CONFIRMED REAL EMERGENCY');
    
    setIsActive(false);
    setUserResponded(true);
    
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    onConfirmEmergency();
  };

  // Handle false alarm confirmation
  const handleConfirmFalseAlarm = () => {
    console.log('✅ USER CONFIRMED FALSE ALARM');
    
    setIsActive(false);
    setUserResponded(true);
    
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    onConfirmFalseAlarm();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Emergency Alert Activated
          </h2>
          <p className="text-gray-600">
            Was this button pressed accidentally?
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-red-600 mb-2 animate-pulse">
            {timeRemaining}
          </div>
          <p className="text-gray-700 font-medium">
            Emergency services will be contacted automatically in {timeRemaining} seconds
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((timeoutSeconds - timeRemaining) / timeoutSeconds) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          
          {/* False Alarm Button */}
          <button
            onClick={handleConfirmFalseAlarm}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            ✅ FALSE ALARM - Cancel Emergency
          </button>

          {/* Confirm Emergency Button */}
          <button
            onClick={handleConfirmEmergency}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            🚨 THIS IS A REAL EMERGENCY - Get Help Now
          </button>

        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• <strong>False Alarm:</strong> All emergency responses will be cancelled</p>
            <p>• <strong>Real Emergency:</strong> AI Emergency Agent will assess your situation</p>
            <p>• <strong>No Response:</strong> Emergency services will be contacted automatically</p>
          </div>
        </div>

        {/* Emergency Override */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            If you cannot respond, emergency services will be contacted in {timeRemaining} seconds
          </p>
        </div>

      </div>
    </div>
  );
}

// Hook for false alarm detection logic
export function useFalseAlarmDetection(timeoutSeconds = 30) {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<'pending' | 'emergency' | 'false_alarm' | 'timeout' | null>(null);

  const startDetection = () => {
    console.log('🔍 STARTING FALSE ALARM DETECTION');
    setIsActive(true);
    setResult('pending');
  };

  const confirmEmergency = () => {
    console.log('🚨 FALSE ALARM DETECTION: CONFIRMED EMERGENCY');
    setIsActive(false);
    setResult('emergency');
  };

  const confirmFalseAlarm = () => {
    console.log('✅ FALSE ALARM DETECTION: CONFIRMED FALSE ALARM');
    setIsActive(false);
    setResult('false_alarm');
  };

  const handleTimeout = () => {
    console.log('⏰ FALSE ALARM DETECTION: TIMEOUT - ASSUMING EMERGENCY');
    setIsActive(false);
    setResult('timeout');
  };

  const reset = () => {
    setIsActive(false);
    setResult(null);
  };

  return {
    isActive,
    result,
    startDetection,
    confirmEmergency,
    confirmFalseAlarm,
    handleTimeout,
    reset
  };
}

// Component for integrating false alarm detection into emergency flow
interface EmergencyWithFalseAlarmDetectionProps {
  onEmergencyConfirmed: () => void;
  onFalseAlarmConfirmed: () => void;
  children: React.ReactNode;
  detectionTimeoutSeconds?: number;
}

export function EmergencyWithFalseAlarmDetection({ 
  onEmergencyConfirmed, 
  onFalseAlarmConfirmed, 
  children,
  detectionTimeoutSeconds = 30 
}: EmergencyWithFalseAlarmDetectionProps) {
  const {
    isActive,
    result,
    startDetection,
    confirmEmergency,
    confirmFalseAlarm,
    handleTimeout,
    reset
  } = useFalseAlarmDetection(detectionTimeoutSeconds);

  // Handle results
  useEffect(() => {
    if (result === 'emergency' || result === 'timeout') {
      onEmergencyConfirmed();
    } else if (result === 'false_alarm') {
      onFalseAlarmConfirmed();
    }
  }, [result, onEmergencyConfirmed, onFalseAlarmConfirmed]);

  // Provide startDetection function to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onEmergency: startDetection,
        disabled: isActive 
      } as any);
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      
      {isActive && (
        <FalseAlarmDetection
          onConfirmEmergency={confirmEmergency}
          onConfirmFalseAlarm={confirmFalseAlarm}
          onTimeout={handleTimeout}
          timeoutSeconds={detectionTimeoutSeconds}
        />
      )}
    </>
  );
}
