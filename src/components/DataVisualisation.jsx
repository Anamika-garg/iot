import React from 'react';

export default function DataVisualization({ patientData, demoMode }) {
  // This would typically use a charting library like Chart.js or Recharts
  // For now, we'll create a simple visualization with progress bars
  
  const metrics = [
    {
      name: 'Temperature',
      value: patientData?.temp || 0,
      max: 40,
      unit: '°C',
      color: 'bg-red-500'
    },
    {
      name: 'Humidity',
      value: patientData?.hum || 0,
      max: 100,
      unit: '%',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">Sensor Trends</h3>
      
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {metric.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {metric.value}{metric.unit}
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.color} transition-all duration-500`}
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0{metric.unit}</span>
              <span>{metric.max}{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {demoMode && (
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-700 text-sm text-center">
            Live charts will display real sensor data when connected
          </p>
        </div>
      )}
    </div>
  );
}