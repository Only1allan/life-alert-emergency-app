'use client';

export default function EmergencyLogPage() {
  const emergencyLog = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      type: "Medical Emergency",
      location: "123 Main St, Anytown, ST",
      status: "Resolved",
      responders: ["Emergency Services", "Jane Doe (Contact)"],
      notes: "False alarm - medication reminder confusion"
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      type: "Fall Detection",
      location: "Home - Kitchen",
      status: "Resolved",
      responders: ["Emergency Services"],
      notes: "Minor fall, no injuries sustained"
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "22:45",
      type: "Panic Button",
      location: "123 Main St, Anytown, ST",
      status: "Resolved",
      responders: ["Emergency Services", "Jane Doe (Contact)", "Dr. Smith"],
      notes: "Chest pain - transported to hospital, stable condition"
    }
  ];

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Medical Emergency":
        return "bg-red-100 text-red-800";
      case "Fall Detection":
        return "bg-orange-100 text-orange-800";
      case "Panic Button":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Log
              </h1>
              <p className="text-gray-600 mt-2">
                View your emergency response history
              </p>
            </div>
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </a>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-gray-600">Total Incidents</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-gray-600">Resolved</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2.5 min</div>
                <div className="text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </div>
          
          {/* Emergency Log Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Emergencies
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emergencyLog.map((emergency) => (
                    <tr key={emergency.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {emergency.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emergency.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(emergency.type)}`}>
                          {emergency.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {emergency.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(emergency.status)}`}>
                          {emergency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Download Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Emergency Details Modal would go here */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Need help with your emergency log?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}