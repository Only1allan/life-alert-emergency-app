// API utilities for external services (VAPI, Google Maps, etc.)

// VAPI (Voice AI) API utilities
export const vapiApi = {
  // Base configuration
  config: {
    baseUrl: 'https://api.vapi.ai',
    apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || 'your-vapi-api-key',
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'your-assistant-id',
    phoneNumber: process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER || '+1234567890'
  },

  // Initiate emergency call
  initiateEmergencyCall: async (userData: any, emergencyData: any) => {
    try {
      const response = await fetch(`${vapiApi.config.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vapiApi.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: vapiApi.config.assistantId,
          phoneNumberId: vapiApi.config.phoneNumber,
          customer: {
            number: userData.phone,
            name: userData.name
          },
          variables: {
            userName: userData.name,
            userLocation: emergencyData.location,
            emergencyType: emergencyData.type,
            medicalInfo: userData.medicalInfo,
            emergencyContacts: userData.emergencyContacts
          }
        })
      });

      if (!response.ok) {
        throw new Error(`VAPI call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initiating VAPI call:', error);
      return {
        success: false,
        error: 'Failed to initiate emergency call'
      };
    }
  },

  // Get call status
  getCallStatus: async (callId: string) => {
    try {
      const response = await fetch(`${vapiApi.config.baseUrl}/call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${vapiApi.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting call status:', error);
      return null;
    }
  },

  // End call
  endCall: async (callId: string) => {
    try {
      const response = await fetch(`${vapiApi.config.baseUrl}/call/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vapiApi.config.apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error ending call:', error);
      return false;
    }
  }
};

// Google Maps API utilities
export const mapsApi = {
  // Configuration
  config: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key',
    baseUrl: 'https://maps.googleapis.com/maps/api'
  },

  // Geocoding - convert address to coordinates
  geocodeAddress: async (address: string) => {
    try {
      const response = await fetch(
        `${mapsApi.config.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${mapsApi.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formatted_address: data.results[0].formatted_address
        };
      }

      throw new Error('No results found');
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  },

  // Reverse geocoding - convert coordinates to address
  reverseGeocode: async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `${mapsApi.config.baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${mapsApi.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }

      throw new Error('No address found');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown location';
    }
  },

  // Find nearby hospitals
  findNearbyHospitals: async (latitude: number, longitude: number, radius = 10000) => {
    try {
      const response = await fetch(
        `${mapsApi.config.baseUrl}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${mapsApi.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Places search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          },
          rating: place.rating,
          isOpen: place.opening_hours?.open_now,
          types: place.types
        }));
      }

      return [];
    } catch (error) {
      console.error('Error finding nearby hospitals:', error);
      return [];
    }
  },

  // Get directions
  getDirections: async (origin: string, destination: string) => {
    try {
      const response = await fetch(
        `${mapsApi.config.baseUrl}/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${mapsApi.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Directions failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          steps: route.legs[0].steps.map((step: any) => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
            distance: step.distance.text,
            duration: step.duration.text
          }))
        };
      }

      throw new Error('No route found');
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }
};

// Emergency Services API (mock/placeholder)
export const emergencyApi = {
  // Send emergency alert to local services
  sendEmergencyAlert: async (emergencyData: any) => {
    try {
      // This would normally connect to local emergency services API
      // For now, we'll simulate the call
      console.log('Emergency alert sent:', emergencyData);
      
      // Simulate API response
      return {
        success: true,
        alertId: `ALERT-${Date.now()}`,
        estimatedResponseTime: 300, // 5 minutes in seconds
        dispatchedUnits: [
          {
            id: 'AMB-001',
            type: 'ambulance',
            eta: '5-7 minutes'
          },
          {
            id: 'POL-001',
            type: 'police',
            eta: '3-5 minutes'
          }
        ]
      };
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return {
        success: false,
        error: 'Failed to send emergency alert'
      };
    }
  },

  // Get emergency status
  getEmergencyStatus: async (alertId: string) => {
    try {
      // Mock response
      return {
        alertId,
        status: 'dispatched',
        responders: [
          {
            id: 'AMB-001',
            type: 'ambulance',
            status: 'en_route',
            eta: '3 minutes'
          }
        ],
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting emergency status:', error);
      return null;
    }
  }
};

// SMS/Notification API utilities
export const notificationApi = {
  // Send SMS to emergency contacts
  sendEmergencySMS: async (contacts: any[], message: string) => {
    try {
      // This would integrate with Twilio, AWS SNS, or similar service
      const results = await Promise.all(
        contacts.map(async (contact) => {
          // Mock SMS sending
          console.log(`Sending SMS to ${contact.phone}: ${message}`);
          
          return {
            contactId: contact.id,
            phone: contact.phone,
            status: 'sent',
            messageId: `MSG-${Date.now()}-${Math.random().toString(36).substring(7)}`
          };
        })
      );

      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      return {
        success: false,
        error: 'Failed to send SMS notifications'
      };
    }
  },

  // Send push notification
  sendPushNotification: async (userId: string, notification: any) => {
    try {
      // This would integrate with Firebase Cloud Messaging or similar
      console.log(`Sending push notification to user ${userId}:`, notification);
      
      return {
        success: true,
        notificationId: `PUSH-${Date.now()}`
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return {
        success: false,
        error: 'Failed to send push notification'
      };
    }
  }
};

// Device API utilities (for IoT devices, wearables, etc.)
export const deviceApi = {
  // Get device status
  getDeviceStatus: async (deviceId: string) => {
    try {
      // Mock device status
      return {
        deviceId,
        status: 'online',
        batteryLevel: 85,
        lastSeen: new Date().toISOString(),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10
        },
        capabilities: ['panic_button', 'fall_detection', 'gps']
      };
    } catch (error) {
      console.error('Error getting device status:', error);
      return null;
    }
  },

  // Send test signal to device
  testDevice: async (deviceId: string) => {
    try {
      // Mock test
      console.log(`Testing device ${deviceId}`);
      
      return {
        success: true,
        testId: `TEST-${Date.now()}`,
        results: {
          connectivity: 'pass',
          battery: 'pass',
          sensors: 'pass',
          gps: 'pass'
        }
      };
    } catch (error) {
      console.error('Error testing device:', error);
      return {
        success: false,
        error: 'Device test failed'
      };
    }
  }
};

// Medical Records API (placeholder for HIPAA-compliant medical data)
export const medicalApi = {
  // Get user medical summary
  getMedicalSummary: async (userId: string) => {
    try {
      // This would connect to secure medical records system
      // Mock data for demo
      return {
        userId,
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        conditions: ['Hypertension', 'Diabetes Type 2'],
        medications: ['Lisinopril 10mg', 'Metformin 500mg'],
        emergencyNotes: 'Patient has history of cardiac episodes',
        lastUpdated: '2024-01-15T10:30:00Z'
      };
    } catch (error) {
      console.error('Error getting medical summary:', error);
      return null;
    }
  },

  // Update medical information
  updateMedicalInfo: async (userId: string, medicalData: any) => {
    try {
      // Mock update
      console.log(`Updating medical info for user ${userId}:`, medicalData);
      
      return {
        success: true,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating medical info:', error);
      return {
        success: false,
        error: 'Failed to update medical information'
      };
    }
  }
};

// Analytics API
export const analyticsApi = {
  // Track emergency event
  trackEmergencyEvent: async (eventData: any) => {
    try {
      // This would send to analytics service (Google Analytics, Mixpanel, etc.)
      console.log('Tracking emergency event:', eventData);
      
      return {
        success: true,
        eventId: `EVENT-${Date.now()}`
      };
    } catch (error) {
      console.error('Error tracking event:', error);
      return {
        success: false,
        error: 'Failed to track event'
      };
    }
  },

  // Get emergency response metrics
  getResponseMetrics: async (timeframe: string = '30d') => {
    try {
      // Mock metrics
      return {
        totalAlerts: 15,
        averageResponseTime: 180, // seconds
        resolutionRate: 0.95,
        falseAlarmRate: 0.08,
        timeframe
      };
    } catch (error) {
      console.error('Error getting metrics:', error);
      return null;
    }
  }
};

// Export all APIs
export default {
  vapi: vapiApi,
  maps: mapsApi,
  emergency: emergencyApi,
  notification: notificationApi,
  device: deviceApi,
  medical: medicalApi,
  analytics: analyticsApi
};