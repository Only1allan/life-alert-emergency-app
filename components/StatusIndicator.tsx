import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'emergency' | 'maintenance' | 'testing';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusIndicator({ 
  status, 
  showLabel = true, 
  size = 'md',
  className = '' 
}: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-500',
          borderColor: 'border-green-200',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'System Active',
          icon: '✅',
          description: 'All systems operational'
        };
      case 'inactive':
        return {
          color: 'bg-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: 'System Inactive',
          icon: '⚫',
          description: 'System is offline'
        };
      case 'emergency':
        return {
          color: 'bg-red-500 animate-pulse',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: 'Emergency Active',
          icon: '🚨',
          description: 'Emergency response in progress'
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-500',
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'Maintenance Mode',
          icon: '🔧',
          description: 'System under maintenance'
        };
      case 'testing':
        return {
          color: 'bg-blue-500 animate-pulse',
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'System Testing',
          icon: '🔍',
          description: 'Running system diagnostics'
        };
      default:
        return {
          color: 'bg-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: 'Unknown Status',
          icon: '❓',
          description: 'Status unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: {
      dot: 'w-2 h-2',
      container: 'text-xs',
      icon: 'text-sm'
    },
    md: {
      dot: 'w-3 h-3',
      container: 'text-sm',
      icon: 'text-base'
    },
    lg: {
      dot: 'w-4 h-4',
      container: 'text-base',
      icon: 'text-lg'
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Status Dot */}
      <div className={`${config.color} ${sizeClasses[size].dot} rounded-full`}></div>
      
      {/* Status Label */}
      {showLabel && (
        <div className={`${sizeClasses[size].container}`}>
          <span className={`font-medium ${config.textColor}`}>
            {config.icon} {config.label}
          </span>
        </div>
      )}
    </div>
  );
}

// Status Card Component for more detailed status display
interface StatusCardProps {
  status: 'active' | 'inactive' | 'emergency' | 'maintenance' | 'testing';
  lastUpdated?: string;
  additionalInfo?: string;
  showActions?: boolean;
}

export function StatusCard({ 
  status, 
  lastUpdated, 
  additionalInfo, 
  showActions = true 
}: StatusCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          label: 'System Active',
          icon: '✅',
          description: 'All emergency response systems are operational and ready'
        };
      case 'inactive':
        return {
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          label: 'System Inactive',
          icon: '⚫',
          description: 'Emergency system is currently offline'
        };
      case 'emergency':
        return {
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          label: 'Emergency Active',
          icon: '🚨',
          description: 'Emergency response is currently in progress'
        };
      case 'maintenance':
        return {
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          label: 'Maintenance Mode',
          icon: '🔧',
          description: 'System is under scheduled maintenance'
        };
      case 'testing':
        return {
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          label: 'System Testing',
          icon: '🔍',
          description: 'Running routine system diagnostics'
        };
      default:
        return {
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          label: 'Unknown Status',
          icon: '❓',
          description: 'System status cannot be determined'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`border ${config.borderColor} ${config.bgColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <StatusIndicator status={status} size="lg" showLabel={false} />
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>
              {config.icon} {config.label}
            </h3>
            <p className={`text-sm ${config.textColor} opacity-80`}>
              {config.description}
            </p>
          </div>
        </div>
      </div>
      
      {(lastUpdated || additionalInfo) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {lastUpdated && (
            <p className="text-xs text-gray-600">
              Last updated: {lastUpdated}
            </p>
          )}
          {additionalInfo && (
            <p className="text-xs text-gray-600 mt-1">
              {additionalInfo}
            </p>
          )}
        </div>
      )}
      
      {showActions && status !== 'emergency' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Test System
            </button>
            <button className="text-gray-600 hover:text-gray-800 text-sm">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}