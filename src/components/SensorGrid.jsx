
import React from 'react';
import { Thermometer, Droplets, Eye, Flame, UserCheck, Lightbulb } from 'lucide-react';

export default function SensorGrid({ demoMode, patientData, loading }) {
  const sensors = [
    {
      id: 'temp',
      name: 'Temperature',
      value: patientData?.temp || 0,
      unit: '°C',
      icon: Thermometer,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      normalRange: [20, 25]
    },
    {
      id: 'hum',
      name: 'Humidity',
      value: patientData?.hum || 0,
      unit: '%',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      normalRange: [40, 60]
    },
    {
      id: 'flame',
      name: 'Flame Detection',
      value: patientData?.flame ? 'DETECTED' : 'Safe',
      unit: '',
      icon: Flame,
      color: patientData?.flame ? 'text-red-600' : 'text-green-600',
      bgColor: patientData?.flame ? 'bg-red-500/20' : 'bg-green-500/20',
      isBoolean: true
    },
    {
      id: 'motion',
      name: 'Motion',
      value: patientData?.motion ? 'Active' : 'Inactive',
      unit: '',
      icon: UserCheck,
      color: patientData?.motion ? 'text-yellow-600' : 'text-gray-600',
      bgColor: patientData?.motion ? 'bg-yellow-500/20' : 'bg-gray-500/20',
      isBoolean: true
    },
    {
      id: 'light',
      name: 'Light',
      value: patientData?.lightState ? 'ON' : 'OFF',
      unit: '',
      icon: Lightbulb,
      color: patientData?.lightState ? 'text-yellow-500' : 'text-gray-500',
      bgColor: patientData?.lightState ? 'bg-yellow-500/20' : 'bg-gray-500/20',
      isBoolean: true
    },
    {
      id: 'buzzer',
      name: 'Buzzer',
      value: patientData?.buzzerEnabled ? 'ACTIVE' : 'INACTIVE',
      unit: '',
      icon: Eye,
      color: patientData?.buzzerEnabled ? 'text-red-600' : 'text-green-600',
      bgColor: patientData?.buzzerEnabled ? 'bg-red-500/20' : 'bg-green-500/20',
      isBoolean: true
    }
  ];

  if (loading && !demoMode) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-muted/30 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="w-10 h-10 bg-muted rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {sensors.map((sensor) => {
        const Icon = sensor.icon;
        const isOutOfRange = !sensor.isBoolean && 
          (sensor.value < sensor.normalRange[0] || sensor.value > sensor.normalRange[1]);
        
        return (
          <div
            key={sensor.id}
            className={`rounded-xl p-4 border transition-all ${
              isOutOfRange ? 'border-red-500/50 bg-red-500/10' : 'border-border/50'
            } ${sensor.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {sensor.name}
                </p>
                <p className={`text-2xl font-bold ${sensor.color}`}>
                  {sensor.value}
                  <span className="text-sm font-normal ml-1">{sensor.unit}</span>
                </p>
                {!sensor.isBoolean && sensor.normalRange && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Normal: {sensor.normalRange[0]}-{sensor.normalRange[1]}{sensor.unit}
                  </p>
                )}
              </div>
              <div className={`p-2 rounded-full ${sensor.bgColor}`}>
                <Icon className={`w-6 h-6 ${sensor.color}`} />
              </div>
            </div>
            
            {isOutOfRange && (
              <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Outside normal range
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}