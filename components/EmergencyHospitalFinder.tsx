'use client';

import React, { useState, useEffect } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { mapsApi } from '../lib/api';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance?: string;
  travelTime?: string;
  phone?: string;
  rating?: number;
  isOpen?: boolean;
  emergencyServices?: boolean;
}

interface EmergencyHospitalFinderProps {
  onHospitalSelected?: (hospital: Hospital) => void;
  emergencyType?: string;
  userMedicalConditions?: string[];
}

export default function EmergencyHospitalFinder({
  onHospitalSelected,
  emergencyType = 'general',
  userMedicalConditions = []
}: EmergencyHospitalFinderProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  
  const { location, getCurrentLocation } = useGeolocation();

  // Find nearby hospitals when location is available
  useEffect(() => {
    if (location) {
      findNearbyHospitals();
    }
  }, [location]);

  const findNearbyHospitals = async () => {
    if (!location) {
      getCurrentLocation();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🏥 Searching for nearby hospitals...');
      
      const nearbyHospitals = await mapsApi.findNearbyHospitals(
        location.coords.latitude,
        location.coords.longitude,
        15000 // 15km radius for emergency situations
      );

      // Get directions to each hospital for travel time
      const hospitalsWithDirections = await Promise.all(
        nearbyHospitals.slice(0, 5).map(async (hospital: any) => {
          try {
            const directions = await mapsApi.getDirections(
              `${location.coords.latitude},${location.coords.longitude}`,
              hospital.address
            );
            
            return {
              ...hospital,
              distance: directions?.distance || 'Unknown',
              travelTime: directions?.duration || 'Unknown',
              emergencyServices: true // Assume all hospitals have emergency services
            };
          } catch (error) {
            return {
              ...hospital,
              distance: 'Unknown',
              travelTime: 'Unknown',
              emergencyServices: true
            };
          }
        })
      );

      // Sort by travel time (emergency priority)
      const sortedHospitals = hospitalsWithDirections.sort((a, b) => {
        const aTime = parseFloat(a.travelTime?.replace(/[^\d.]/g, '') || '999');
        const bTime = parseFloat(b.travelTime?.replace(/[^\d.]/g, '') || '999');
        return aTime - bTime;
      });

      setHospitals(sortedHospitals);
      console.log(`🏥 Found ${sortedHospitals.length} nearby hospitals`);
      
    } catch (err) {
      console.error('Error finding hospitals:', err);
      setError('Failed to find nearby hospitals');
    } finally {
      setLoading(false);
    }
  };

  const selectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    if (onHospitalSelected) {
      onHospitalSelected(hospital);
    }
    console.log('🏥 Hospital selected:', hospital.name);
  };

  const callHospital = (hospital: Hospital) => {
    if (hospital.phone) {
      window.location.href = `tel:${hospital.phone}`;
    } else {
      // Try to find emergency number or use directory assistance
      window.location.href = 'tel:411'; // Directory assistance
    }
  };

  const getDirectionsToHospital = (hospital: Hospital) => {
    const mapsUrl = `https://www.google.com/maps/dir/${location?.coords.latitude},${location?.coords.longitude}/${encodeURIComponent(hospital.address)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-700">Finding nearest hospitals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <span className="text-red-600 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-semibold">Hospital Search Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={findNearbyHospitals}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">🏥 Nearby Emergency Hospitals</h2>
          <button
            onClick={findNearbyHospitals}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
        {location && (
          <p className="text-sm text-gray-600 mt-1">
            📍 Based on your current location ({location.coords.accuracy}m accuracy)
          </p>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {hospitals.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <span className="text-4xl mb-2 block">🏥</span>
            No hospitals found nearby. Try expanding search radius or check your location.
          </div>
        ) : (
          hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedHospital?.id === hospital.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => selectHospital(hospital)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    {index === 0 && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        CLOSEST
                      </span>
                    )}
                    {hospital.isOpen && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        OPEN
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{hospital.address}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-700">
                      🚗 {hospital.travelTime} ({hospital.distance})
                    </span>
                    {hospital.rating && (
                      <span className="text-yellow-600">
                        ⭐ {hospital.rating}/5
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      callHospital(hospital);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      getDirectionsToHospital(hospital);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    🗺️ Directions
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedHospital && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <div className="flex items-center">
            <span className="text-green-600 text-xl mr-3">✅</span>
            <div>
              <h4 className="font-semibold text-green-800">Hospital Selected</h4>
              <p className="text-green-700 text-sm">
                {selectedHospital.name} - {selectedHospital.travelTime} away
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for emergency hospital selection
export function useEmergencyHospitalFinder() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const findAndSelectBestHospital = async (
    location: GeolocationPosition,
    emergencyType: string = 'general',
    medicalConditions: string[] = []
  ) => {
    setIsSearching(true);
    
    try {
      const hospitals = await mapsApi.findNearbyHospitals(
        location.coords.latitude,
        location.coords.longitude,
        10000
      );
      
      // Select the closest available hospital
      if (hospitals.length > 0) {
        const bestHospital = hospitals[0]; // Closest by default
        setSelectedHospital(bestHospital);
        return bestHospital;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding emergency hospital:', error);
      return null;
    } finally {
      setIsSearching(false);
    }
  };
  
  return {
    selectedHospital,
    isSearching,
    findAndSelectBestHospital,
    clearSelection: () => setSelectedHospital(null)
  };
}

