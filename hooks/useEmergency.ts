'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { vapiApi, emergencyApi, notificationApi } from '../lib/api';
import useGeolocation from './useGeolocation';

// Emergency types
interface EmergencyState {
  isActive: boolean;
  alertId: string | null;
  type: EmergencyType | null;
  status: EmergencyStatus;
  startTime: string | null;
  location: GeolocationPosition | null;
  responders: Responder[];
  estimatedResponseTime: number | null;
}

type EmergencyType = 
  | 'panic_button'
  | 'fall_detection'
  | 'medical_emergency'
  | 'fire'
  | 'security'
  | 'test_alert';

type EmergencyStatus = 
  | 'idle'
  | 'initiated'
  | 'calling'
  | 'connected'
  | 'dispatched'
  | 'en_route'
  | 'on_scene'
  | 'resolved'
  | 'cancelled'
  | 'testing';

interface Responder {
  id: string;
  type: 'emergency_services' | 'emergency_contact' | 'medical_professional';
  name: string;
  phone?: string;
  status: 'notified' | 'acknowledged' | 'en_route' | 'arrived' | 'completed';
  estimatedArrival?: string;
}

interface EmergencyOptions {
  autoCall?: boolean;
  shareLocation?: boolean;
  notifyContacts?: boolean;
  callTimeout?: number;
}

interface UseEmergencyReturn extends EmergencyState {
  initiateEmergency: (type: EmergencyType, options?: EmergencyOptions) => Promise<void>;
  cancelEmergency: () => Promise<void>;
  updateEmergencyStatus: () => Promise<void>;
  testEmergencySystem: () => Promise<boolean>;
  getEmergencyHistory: () => Promise<any[]>;
}

export function useEmergency(): UseEmergencyReturn {
  const [state, setState] = useState<EmergencyState>({
    isActive: false,
    alertId: null,
    type: null,
    status: 'idle',
    startTime: null,
    location: null,
    responders: [],
    estimatedResponseTime: null
  });

  const { location, getCurrentLocation } = useGeolocation();
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize emergency state
  const initiateEmergency = useCallback(async (
    type: EmergencyType, 
    options: EmergencyOptions = {}
  ) => {
    const {
      autoCall = true,
      shareLocation = true,
      notifyContacts = true,
      callTimeout = 30000
    } = options;

    try {
      // Get current location if sharing is enabled
      if (shareLocation) {
        getCurrentLocation();
      }

      const emergencyData = {
        type,
        location: shareLocation ? location : null,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id', // This would come from auth context
        options
      };

      setState(prev => ({
        ...prev,
        isActive: true,
        type,
        status: 'initiated',
        startTime: emergencyData.timestamp,
        location: shareLocation ? location : null
      }));

      // Send emergency alert to services
      const alertResponse = await emergencyApi.sendEmergencyAlert(emergencyData);
      
      if (alertResponse.success) {
        setState(prev => ({
          ...prev,
          alertId: alertResponse.alertId || null,
          status: 'dispatched' as EmergencyStatus,
          responders: (alertResponse.dispatchedUnits || []).map((unit: any) => ({
            id: unit.id,
            type: unit.type as 'emergency_services' | 'emergency_contact' | 'medical_professional',
            name: unit.name || unit.type,
            status: 'notified' as 'notified' | 'acknowledged' | 'en_route' | 'arrived' | 'completed',
            estimatedArrival: unit.eta
          })),
          estimatedResponseTime: alertResponse.estimatedResponseTime || null
        }));

        // Start status monitoring
        if (alertResponse.alertId) {
          startStatusMonitoring(alertResponse.alertId);
        }

        // Initiate VAPI call if enabled
        if (autoCall) {
          await initiateEmergencyCall(emergencyData);
        }

        // Notify emergency contacts
        if (notifyContacts) {
          await notifyEmergencyContacts(emergencyData);
        }
      } else {
        throw new Error('Failed to send emergency alert');
      }

    } catch (error) {
      console.error('Error initiating emergency:', error);
      setState(prev => ({
        ...prev,
        status: 'idle',
        isActive: false
      }));
      throw error;
    }
  }, [location, getCurrentLocation]);

  // Cancel emergency
  const cancelEmergency = useCallback(async () => {
    try {
      if (state.alertId) {
        // Here you would call API to cancel the emergency
        console.log('Cancelling emergency alert:', state.alertId);
      }

      setState({
        isActive: false,
        alertId: null,
        type: null,
        status: 'cancelled',
        startTime: null,
        location: null,
        responders: [],
        estimatedResponseTime: null
      });

      // Clear status monitoring
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
        statusCheckInterval.current = null;
      }

      // Reset status after a delay
      setTimeout(() => {
        setState(prev => ({ ...prev, status: 'idle' }));
      }, 3000);

    } catch (error) {
      console.error('Error cancelling emergency:', error);
    }
  }, [state.alertId]);

  // Update emergency status
  const updateEmergencyStatus = useCallback(async () => {
    if (!state.alertId) return;

    try {
      const statusUpdate = await emergencyApi.getEmergencyStatus(state.alertId);
      
      if (statusUpdate) {
        setState(prev => ({
          ...prev,
          status: statusUpdate.status as EmergencyStatus,
          responders: statusUpdate.responders ? statusUpdate.responders.map((responder: any) => ({
            id: responder.id,
            type: responder.type as 'emergency_services' | 'emergency_contact' | 'medical_professional',
            name: responder.name || responder.type,
            status: responder.status as 'notified' | 'acknowledged' | 'en_route' | 'arrived' | 'completed',
            estimatedArrival: responder.eta
          })) : prev.responders
        }));

        // If emergency is resolved, clean up
        if (statusUpdate.status === 'resolved') {
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              isActive: false,
              status: 'idle'
            }));
          }, 5000);

          // Clear status monitoring
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
            statusCheckInterval.current = null;
          }
        }
      }
    } catch (error) {
      console.error('Error updating emergency status:', error);
    }
  }, [state.alertId]);

  // Test emergency system
  const testEmergencySystem = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, status: 'testing' }));
      
      // Test location services
      getCurrentLocation();
      
      // Test API connectivity
      const testAlert = await emergencyApi.sendEmergencyAlert({
        type: 'test_alert',
        location: location,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id',
        isTest: true
      });

      setState(prev => ({ ...prev, status: 'idle' }));
      
      return testAlert.success;
    } catch (error) {
      console.error('Error testing emergency system:', error);
      setState(prev => ({ ...prev, status: 'idle' }));
      return false;
    }
  }, [location, getCurrentLocation]);

  // Get emergency history
  const getEmergencyHistory = useCallback(async () => {
    try {
      // This would fetch from your backend API
      const history = [
        {
          id: '1',
          type: 'panic_button',
          date: '2024-01-15',
          time: '14:30',
          status: 'resolved',
          responseTime: 180,
          location: 'Home'
        },
        {
          id: '2',
          type: 'fall_detection',
          date: '2024-01-10',
          time: '09:15',
          status: 'resolved',
          responseTime: 120,
          location: 'Kitchen'
        }
      ];
      
      return history;
    } catch (error) {
      console.error('Error fetching emergency history:', error);
      return [];
    }
  }, []);

  // Helper function to initiate VAPI call
  const initiateEmergencyCall = async (emergencyData: any) => {
    try {
      setState(prev => ({ ...prev, status: 'calling' }));

      const userData = {
        name: 'John Doe', // This would come from user context
        phone: '+1234567890',
        medicalInfo: 'Diabetes, High Blood Pressure',
        emergencyContacts: ['Jane Doe - (555) 987-6543']
      };

      const callResponse = await vapiApi.initiateEmergencyCall(userData, emergencyData);
      
      if (callResponse.success) {
        setState(prev => ({ ...prev, status: 'connected' }));
      }
    } catch (error) {
      console.error('Error initiating emergency call:', error);
    }
  };

  // Helper function to notify emergency contacts
  const notifyEmergencyContacts = async (emergencyData: any) => {
    try {
      const contacts = [
        {
          id: '1',
          name: 'Jane Doe',
          phone: '+1234567890',
          relationship: 'Spouse'
        }
      ];

      const message = `EMERGENCY ALERT: ${emergencyData.type} reported at ${emergencyData.timestamp}. ${emergencyData.location ? `Location: ${emergencyData.location.coords.latitude}, ${emergencyData.location.coords.longitude}` : 'Location not available'}. Emergency services have been contacted.`;

      await notificationApi.sendEmergencySMS(contacts, message);
    } catch (error) {
      console.error('Error notifying emergency contacts:', error);
    }
  };

  // Start monitoring emergency status
  const startStatusMonitoring = (alertId: string) => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }

    statusCheckInterval.current = setInterval(() => {
      updateEmergencyStatus();
    }, 10000); // Check every 10 seconds
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  return {
    ...state,
    initiateEmergency,
    cancelEmergency,
    updateEmergencyStatus,
    testEmergencySystem,
    getEmergencyHistory
  };
}

// Hook for emergency contacts management
export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data - this would come from your backend
      const emergencyContacts = [
        {
          id: '1',
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '(555) 987-6543',
          email: 'jane.doe@example.com',
          isPrimary: true,
          isActive: true
        },
        {
          id: '2',
          name: 'Dr. Sarah Smith',
          relationship: 'Doctor',
          phone: '(555) 123-9876',
          email: 'dr.smith@hospital.com',
          isPrimary: false,
          isActive: true
        }
      ];

      setContacts(emergencyContacts);
    } catch (err) {
      setError('Failed to load emergency contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(async (contactData: any) => {
    try {
      const newContact = {
        id: Date.now().toString(),
        ...contactData,
        isActive: true
      };

      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }, []);

  const updateContact = useCallback(async (contactId: string, updates: any) => {
    try {
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, ...updates }
            : contact
        )
      );
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }, []);

  const removeContact = useCallback(async (contactId: string) => {
    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    removeContact,
    refresh: loadContacts
  };
}

// Hook for emergency system status
export function useEmergencySystemStatus() {
  const [systemStatus, setSystemStatus] = useState({
    status: 'active' as 'active' | 'inactive' | 'maintenance' | 'testing',
    lastCheck: new Date().toISOString(),
    connectivity: true,
    gpsEnabled: true,
    batteryLevel: 100,
    deviceOnline: true
  });

  const checkSystemStatus = useCallback(async () => {
    try {
      // Check GPS permissions
      const gpsStatus = navigator.geolocation ? true : false;
      
      // Check device connectivity
      const isOnline = navigator.onLine;
      
      // Mock battery API (not widely supported)
      const batteryLevel = 85; // This would come from device API
      
      setSystemStatus(prev => ({
        ...prev,
        connectivity: isOnline,
        gpsEnabled: gpsStatus,
        batteryLevel,
        deviceOnline: isOnline,
        lastCheck: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus(prev => ({
        ...prev,
        status: 'inactive',
        lastCheck: new Date().toISOString()
      }));
    }
  }, []);

  useEffect(() => {
    checkSystemStatus();
    
    // Check status every minute
    const interval = setInterval(checkSystemStatus, 60000);
    
    return () => clearInterval(interval);
  }, [checkSystemStatus]);

  return {
    systemStatus,
    checkSystemStatus
  };
}

export default useEmergency;