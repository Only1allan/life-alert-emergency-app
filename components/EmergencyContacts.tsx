import React from 'react';
import Card from './ui/Card';

interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  isActive: boolean;
}

interface EmergencyContactsProps {
  contacts?: EmergencyContact[];
  showAddButton?: boolean;
  maxDisplay?: number;
}

export default function EmergencyContacts({ 
  contacts, 
  showAddButton = true,
  maxDisplay = 4 
}: EmergencyContactsProps) {
  const defaultContacts: EmergencyContact[] = [
    {
      id: 1,
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "(555) 987-6543",
      email: "jane.doe@example.com",
      isPrimary: true,
      isActive: true
    },
    {
      id: 2,
      name: "Dr. Sarah Smith",
      relationship: "Doctor",
      phone: "(555) 123-9876",
      email: "dr.smith@hospital.com",
      isPrimary: false,
      isActive: true
    },
    {
      id: 3,
      name: "Mike Johnson",
      relationship: "Son",
      phone: "(555) 456-7890",
      email: "mike.johnson@email.com",
      isPrimary: false,
      isActive: true
    },
    {
      id: 4,
      name: "Emergency Services",
      relationship: "Emergency",
      phone: "911",
      isPrimary: false,
      isActive: true
    }
  ];

  const emergencyContacts = contacts || defaultContacts;
  const displayContacts = emergencyContacts
    .filter(contact => contact.isActive)
    .slice(0, maxDisplay);

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'spouse':
      case 'partner':
        return '💑';
      case 'doctor':
      case 'physician':
        return '👨‍⚕️';
      case 'son':
      case 'daughter':
      case 'child':
        return '👨‍👩‍👧‍👦';
      case 'parent':
      case 'mother':
      case 'father':
        return '👨‍👩‍👧‍👦';
      case 'emergency':
        return '🚨';
      case 'friend':
        return '👥';
      default:
        return '📞';
    }
  };

  return (
    <Card title="Emergency Contacts">
      <div className="space-y-4">
        {displayContacts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📞</div>
            <p className="text-gray-600">No emergency contacts added</p>
            <p className="text-sm text-gray-500">Add contacts to ensure help can reach you quickly</p>
          </div>
        ) : (
          <>
            {displayContacts.map((contact) => (
              <div 
                key={contact.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors
                  ${contact.isPrimary 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getRelationshipIcon(contact.relationship)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      {contact.isPrimary && (
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-sm font-mono text-gray-800">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    📞 Call
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        
        {showAddButton && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {displayContacts.length} active contact{displayContacts.length !== 1 ? 's' : ''}
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  + Add Contact
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">
                  Manage All
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Quick Tip</p>
              <p className="text-xs text-yellow-700">
                Emergency contacts will be notified automatically when you press the panic button. 
                Keep this list updated with people who can respond quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}