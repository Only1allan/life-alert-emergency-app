'use client';

export default function ProfilePage() {
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    emergencyContact: "Jane Doe - (555) 987-6543",
    medicalConditions: "Diabetes, High Blood Pressure",
    medications: "Metformin, Lisinopril",
    bloodType: "A+",
    allergies: "Penicillin, Shellfish"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Information
            </h1>
            <a
              href="/profile/edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{userData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{userData.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{userData.address}</p>
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Emergency Contact
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Contact</label>
                <p className="text-gray-900">{userData.emergencyContact}</p>
              </div>
            </div>
            
            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                  <p className="text-gray-900">{userData.bloodType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergies</label>
                  <p className="text-gray-900">{userData.allergies}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <p className="text-gray-900">{userData.medicalConditions}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                  <p className="text-gray-900">{userData.medications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}