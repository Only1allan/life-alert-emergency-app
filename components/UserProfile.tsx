import React from 'react';
import Card from './ui/Card';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  medicalConditions: string;
  profileImage?: string;
}

interface UserProfileProps {
  userData?: UserData;
  showEditButton?: boolean;
  compact?: boolean;
}

export default function UserProfile({ 
  userData,
  showEditButton = true,
  compact = false 
}: UserProfileProps) {
  const defaultUserData: UserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    bloodType: "A+",
    emergencyContact: "Jane Doe - (555) 987-6543",
    medicalConditions: "Diabetes, High Blood Pressure",
  };

  const user = userData || defaultUserData;

  if (compact) {
    return (
      <Card className="max-w-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Profile Information">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="text-gray-900">{user.phone}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <p className="text-gray-900">{user.bloodType}</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-gray-900">{user.address}</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
            <p className="text-gray-900">{user.emergencyContact}</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <p className="text-gray-900">{user.medicalConditions}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {showEditButton && (
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
              View Full Profile
            </button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}