import React from 'react';
import Card from './ui/Card';

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  distance: string;
  emergencyServices: string[];
  rating: number;
  hasEmergencyRoom: boolean;
}

interface HospitalInfoProps {
  hospitals?: Hospital[];
  userLocation?: string;
  showDirections?: boolean;
}

export default function HospitalInfo({ 
  hospitals, 
  userLocation = "123 Main St, Anytown, ST",
  showDirections = true 
}: HospitalInfoProps) {
  const defaultHospitals: Hospital[] = [
    {
      id: 1,
      name: "City General Hospital",
      address: "456 Hospital Ave, Anytown, ST 12345",
      phone: "(555) 123-4567",
      distance: "2.3 miles",
      emergencyServices: ["Emergency Room", "Trauma Center", "Cardiac Care"],
      rating: 4.5,
      hasEmergencyRoom: true
    },
    {
      id: 2,
      name: "Regional Medical Center",
      address: "789 Medical Blvd, Anytown, ST 12345",
      phone: "(555) 987-6543",
      distance: "3.7 miles",
      emergencyServices: ["Emergency Room", "Stroke Center", "Pediatric Care"],
      rating: 4.2,
      hasEmergencyRoom: true
    },
    {
      id: 3,
      name: "Anytown Urgent Care",
      address: "321 Care St, Anytown, ST 12345",
      phone: "(555) 456-7890",
      distance: "1.8 miles",
      emergencyServices: ["Urgent Care", "X-Ray", "Minor Surgery"],
      rating: 4.0,
      hasEmergencyRoom: false
    }
  ];

  const nearbyHospitals = hospitals || defaultHospitals;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <Card title="Nearby Medical Facilities">
      <div className="space-y-4">
        {/* Current Location */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">📍</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Your Location</p>
              <p className="text-xs text-blue-700">{userLocation}</p>
            </div>
          </div>
        </div>

        {/* Hospital List */}
        {nearbyHospitals.map((hospital) => (
          <div 
            key={hospital.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                  {hospital.hasEmergencyRoom && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      ER
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(hospital.rating)}
                  <span className="text-sm text-gray-600 ml-1">({hospital.rating})</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">{hospital.address}</p>
                <p className="text-sm font-medium text-green-600">{hospital.distance} away</p>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <span className="text-2xl">🏥</span>
              </div>
            </div>

            {/* Services */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Services:</p>
              <div className="flex flex-wrap gap-1">
                {hospital.emergencyServices.map((service, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
                📞 Call
              </button>
              {showDirections && (
                <button className="flex-1 bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded hover:bg-gray-300">
                  🗺️ Directions
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Emergency Instructions */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-red-600">🚨</div>
            <div>
              <p className="text-sm font-medium text-red-800">In Case of Emergency</p>
              <p className="text-xs text-red-700">
                For life-threatening emergencies, call 911 immediately. 
                The nearest hospital with emergency services is {nearbyHospitals.find(h => h.hasEmergencyRoom)?.name} 
                ({nearbyHospitals.find(h => h.hasEmergencyRoom)?.distance}).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}