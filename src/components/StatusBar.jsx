import React from 'react';
import { Wifi, WifiOff, Activity, Shield, Battery, Signal } from 'lucide-react';

export default function StatusBar({ patientData, demoMode }) {
  const statusItems = [
    {
      label: 'Network',
      value: demoMode ? 'Demo' : (patientData ? 'Connected' : 'Offline'),
      icon: demoMode ? Activity : (patientData ? Wifi : WifiOff),
      color: demoMode ? 'text-blue-600' : (patientData ? 'text-green-600' : 'text-red-600')
    },
    {
      label: 'System',
      value: 'Operational',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      label: 'Battery',
      value: demoMode ? '100%' : (patientData?.battery || 'N/A'),
      icon: Battery,
      color: 'text-green-600'
    },
    {
      label: 'Signal',
      value: demoMode ? 'Excellent' : (patientData ? 'Strong' : 'Weak'),
      icon: Signal,
      color: demoMode ? 'text-green-600' : (patientData ? 'text-green-600' : 'text-yellow-600')
    }
  ];

  return (
    <div className="glass-effect rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 bg-muted/30 rounded-lg">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className={`font-semibold ${item.color}`}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}