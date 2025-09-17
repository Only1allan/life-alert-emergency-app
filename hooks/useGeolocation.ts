'use client';

import { useState, useEffect, useRef } from 'react';
import { mapsApi } from '../lib/api';

// Geolocation types
interface GeolocationState {
  location: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  accuracy: number | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  trackLocation?: boolean; // Whether to continuously track location
}

interface UseGeolocationReturn extends GeolocationState {
  getCurrentLocation: () => void;
  clearLocation: () => void;
  getAddressFromCoords: (lat: number, lng: number) => Promise<string | null>;
}

export function useGeolocation(options: GeolocationOptions = {}): UseGeolocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    trackLocation = false
  } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
    accuracy: null
  });

  const watchIdRef = useRef<number | null>(null);

  const geolocationOptions: PositionOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge
  };

  const handleSuccess = (position: GeolocationPosition) => {
    setState({
      location: position,
      error: null,
      loading: false,
      accuracy: position.coords.accuracy
    });
  };

  const handleError = (error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      error,
      loading: false
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      const error = {
        code: 0,
        message: 'Geolocation is not supported by this browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError;
      
      handleError(error);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geolocationOptions);
  };

  const clearLocation = () => {
    setState({
      location: null,
      error: null,
      loading: false,
      accuracy: null
    });

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string | null> => {
    try {
      return await mapsApi.reverseGeocode(lat, lng);
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  };

  // Effect for tracking location continuously
  useEffect(() => {
    if (trackLocation && navigator.geolocation) {
      setState(prev => ({ ...prev, loading: true }));
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geolocationOptions
      );

      return () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      };
    }
  }, [trackLocation, enableHighAccuracy, timeout, maximumAge]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearLocation,
    getAddressFromCoords
  };
}

// Additional utility hooks for specific geolocation needs

// Hook for getting user's current address
export function useCurrentAddress() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, getCurrentLocation } = useGeolocation();

  const getAddress = async () => {
    if (!location) {
      getCurrentLocation();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const addressString = await mapsApi.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );
      setAddress(addressString);
    } catch (err) {
      setError('Failed to get address');
      console.error('Error getting address:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && !address) {
      getAddress();
    }
  }, [location]);

  return {
    address,
    loading,
    error,
    refresh: getAddress
  };
}

// Hook for finding nearby emergency services
export function useNearbyHospitals() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location } = useGeolocation();

  const findHospitals = async (radius = 10000) => {
    if (!location) {
      setError('Location not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nearbyHospitals = await mapsApi.findNearbyHospitals(
        location.coords.latitude,
        location.coords.longitude,
        radius
      );
      setHospitals(nearbyHospitals);
    } catch (err) {
      setError('Failed to find nearby hospitals');
      console.error('Error finding hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      findHospitals();
    }
  }, [location]);

  return {
    hospitals,
    loading,
    error,
    refresh: findHospitals
  };
}

// Hook for calculating distance to emergency services
export function useEmergencyDistance() {
  const { location } = useGeolocation();

  const calculateDistance = (targetLat: number, targetLng: number): number | null => {
    if (!location) return null;

    const userLat = location.coords.latitude;
    const userLng = location.coords.longitude;

    // Haversine formula for calculating distance
    const R = 3959; // Earth's radius in miles
    const dLat = (targetLat - userLat) * Math.PI / 180;
    const dLng = (targetLng - userLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  };

  const getDistanceString = (targetLat: number, targetLng: number): string => {
    const distance = calculateDistance(targetLat, targetLng);
    if (!distance) return 'Distance unknown';
    
    if (distance < 1) {
      return `${(distance * 5280).toFixed(0)} feet`;
    }
    return `${distance.toFixed(1)} miles`;
  };

  return {
    calculateDistance,
    getDistanceString,
    userLocation: location
  };
}

// Hook for location permissions
export function useLocationPermission() {
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [loading, setLoading] = useState(false);

  const checkPermission = async () => {
    if (!navigator.permissions) {
      setPermission('granted'); // Assume granted if permissions API not available
      return;
    }

    setLoading(true);
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(result.state);
      
      result.addEventListener('change', () => {
        setPermission(result.state);
      });
    } catch (error) {
      console.error('Error checking location permission:', error);
      setPermission('granted'); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    return new Promise<PermissionState>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermission('granted');
          resolve('granted');
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermission('denied');
            resolve('denied');
          } else {
            setPermission('granted'); // Other errors don't mean denied
            resolve('granted');
          }
        }
      );
    });
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    permission,
    loading,
    requestPermission,
    checkPermission
  };
}

export default useGeolocation;