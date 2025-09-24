'use client';

import React, { useState, useEffect } from 'react';

interface EmergencyLog {
  emergency_id: string;
  emergency_type: string;
  severity_level: number;
  status: string;
  timestamp: string;
  ai_decision: string;
  agent_summary: string;
  location_address: string;
  response_time_seconds: number;
  call_duration: number;
  actions_taken: string;
  outcome_status: string;
}

interface EmergencyLogViewerProps {
  userId?: string;
  maxLogs?: number;
  showRefreshButton?: boolean;
}

export default function EmergencyLogViewer({
  userId = 'test-user',
  maxLogs = 10,
  showRefreshButton = true
}: EmergencyLogViewerProps) {
  const [logs, setLogs] = useState<EmergencyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch emergency logs from Storyblok
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Fetching emergency logs from Storyblok...');
      
      const response = await fetch(`/api/emergency/log?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs.slice(0, maxLogs));
        setLastUpdated(new Date());
        console.log(`✅ Loaded ${data.logs.length} emergency logs from ${data.source}`);
      } else {
        setError(data.error || 'Failed to fetch emergency logs');
      }
      
    } catch (err) {
      console.error('❌ Error fetching emergency logs:', err);
      setError('Failed to load emergency logs');
    } finally {
      setLoading(false);
    }
  };

  // Load logs on component mount
  useEffect(() => {
    fetchLogs();
  }, [userId]);

  // Get severity color and icon
  const getSeverityDisplay = (severity: number) => {
    if (severity >= 8) {
      return {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: '🚨',
        label: 'CRITICAL'
      };
    } else if (severity >= 5) {
      return {
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: '⚠️',
        label: 'MODERATE'
      };
    } else {
      return {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: 'ℹ️',
        label: 'LOW'
      };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'text-green-700 bg-green-100';
      case 'in_progress':
        return 'text-yellow-700 bg-yellow-100';
      case 'initiated':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-700">Loading emergency logs from Storyblok...</span>
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
            <h3 className="text-red-800 font-semibold">Error Loading Emergency Logs</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📋 Emergency History</h2>
            <p className="text-sm text-gray-600 mt-1">
              Logged in Storyblok • {logs.length} records
              {lastUpdated && (
                <span className="ml-2">• Updated {lastUpdated.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          {showRefreshButton && (
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          )}
        </div>
      </div>

      {/* Emergency Logs */}
      <div className="max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <span className="text-4xl mb-2 block">📋</span>
            No emergency logs found. Emergency data will appear here when incidents are logged to Storyblok.
          </div>
        ) : (
          logs.map((log, index) => {
            const severityDisplay = getSeverityDisplay(log.severity_level);
            
            return (
              <div
                key={log.emergency_id || index}
                className="p-6 border-b border-gray-100 hover:bg-gray-50"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{severityDisplay.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {(log.emergency_type || 'Unknown').replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'No timestamp'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${severityDisplay.color}`}>
                      {severityDisplay.label} ({log.severity_level || 0}/10)
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status || 'unknown')}`}>
                      {(log.status || 'Unknown').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <strong className="text-gray-900">Location:</strong> {log.location_address}
                    </p>
                    <p className="text-gray-600">
                      <strong className="text-gray-900">AI Decision:</strong> {log.ai_decision}
                    </p>
                    {log.actions_taken && (
                      <p className="text-gray-600">
                        <strong className="text-gray-900">Actions:</strong> {log.actions_taken}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-gray-600">
                      <strong className="text-gray-900">Response Time:</strong> {formatDuration(log.response_time_seconds || 0)}
                    </p>
                    <p className="text-gray-600">
                      <strong className="text-gray-900">Call Duration:</strong> {formatDuration(log.call_duration || 0)}
                    </p>
                    <p className="text-gray-600">
                      <strong className="text-gray-900">Outcome:</strong> {log.outcome_status}
                    </p>
                  </div>
                </div>

                {/* AI Summary */}
                {log.agent_summary && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>AI Summary:</strong> {log.agent_summary}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {logs.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {logs.length} most recent emergencies</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected to Storyblok
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for emergency log management
export function useEmergencyLogs(userId: string = 'test-user') {
  const [logs, setLogs] = useState<EmergencyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/emergency/log?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch emergency logs');
    } finally {
      setLoading(false);
    }
  };

  const createEmergencyLog = async (logData: any) => {
    try {
      const response = await fetch('/api/emergency/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh logs after creating new one
        await fetchLogs();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating emergency log:', error);
      throw error;
    }
  };

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createEmergencyLog
  };
}
