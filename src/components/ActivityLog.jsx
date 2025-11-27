import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ActivityLog({ demoMode, patientData }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (demoMode) {
      // Demo data
      const demoActivities = [
        {
          id: 1,
          type: 'info',
          message: 'System started in demo mode',
          timestamp: new Date(Date.now() - 300000),
          icon: Info
        },
        {
          id: 2,
          type: 'success',
          message: 'All sensors initialized successfully',
          timestamp: new Date(Date.now() - 240000),
          icon: CheckCircle
        },
        {
          id: 3,
          type: 'warning',
          message: 'Motion detected in room 101',
          timestamp: new Date(Date.now() - 120000),
          icon: AlertTriangle
        }
      ];
      setActivities(demoActivities);
    } else if (patientData) {
      // Add real activity when patient data updates
      const newActivity = {
        id: Date.now(),
        type: 'info',
        message: `Sensor data updated - Temp: ${patientData.temp}°C, Hum: ${patientData.hum}%`,
        timestamp: new Date(),
        icon: Clock
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }
  }, [patientData, demoMode]);

  const getActivityColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-500/20';
      case 'warning': return 'text-yellow-600 bg-yellow-500/20';
      case 'danger': return 'text-red-600 bg-red-500/20';
      default: return 'text-blue-600 bg-blue-500/20';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleTimeString();
  };

  return (
    <div className="glass-effect rounded-xl p-6 max-h-96 overflow-y-auto">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No activity to display</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}