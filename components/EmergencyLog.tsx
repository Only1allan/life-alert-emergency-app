import React from 'react';
import Card from './ui/Card';

interface EmergencyEvent {
  id: number;
  date: string;
  time: string;
  type: string;
  location: string;
  status: 'Resolved' | 'In Progress' | 'Pending';
  responseTime?: string;
}

interface EmergencyLogProps {
  events?: EmergencyEvent[];
  maxEvents?: number;
  showActions?: boolean;
}

export default function EmergencyLog({ 
  events, 
  maxEvents = 5, 
  showActions = true 
}: EmergencyLogProps) {
  const defaultEvents: EmergencyEvent[] = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      type: "Medical Emergency",
      location: "Home",
      status: "Resolved",
      responseTime: "3 min"
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      type: "Fall Detection",
      location: "Kitchen",
      status: "Resolved",
      responseTime: "2 min"
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "22:45",
      type: "Panic Button",
      location: "Home",
      status: "Resolved",
      responseTime: "4 min"
    }
  ];

  const emergencyEvents = events || defaultEvents;
  const displayEvents = emergencyEvents.slice(0, maxEvents);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Medical Emergency":
        return "🏥";
      case "Fall Detection":
        return "⚠️";
      case "Panic Button":
        return "🚨";
      default:
        return "📋";
    }
  };

  return (
    <Card title="Recent Emergency Events">
      <div className="space-y-4">
        {displayEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-600">No emergency events recorded</p>
            <p className="text-sm text-gray-500">Your safety history will appear here</p>
          </div>
        ) : (
          <>
            {displayEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getTypeIcon(event.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{event.type}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event.date} at {event.time} • {event.location}
                    </p>
                    {event.responseTime && (
                      <p className="text-xs text-blue-600">
                        Response time: {event.responseTime}
                      </p>
                    )}
                  </div>
                </div>
                
                {showActions && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Report
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {emergencyEvents.length > maxEvents && (
              <div className="text-center pt-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Events ({emergencyEvents.length})
                </button>
              </div>
            )}
          </>
        )}
        
        {showActions && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Emergency response average: 3.2 minutes
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download Full Report
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}