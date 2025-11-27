import { useState, useEffect } from 'react';

export function usePatientData(selectedPatient, demoMode) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate demo data
  const generateDemoData = () => ({
    temp: Math.round((Math.random() * 10 + 20) * 10) / 10, // 20-30°C
    hum: Math.round(Math.random() * 30 + 40), // 40-70%
    flame: Math.random() > 0.9, // 10% chance
    motion: Math.random() > 0.7, // 30% chance
    lightState: Math.random() > 0.5, // 50% chance
    buzzerEnabled: false,
    room: selectedPatient ? `Room ${selectedPatient.slice(-1)}${selectedPatient.slice(-1)}` : 'N/A',
    patientId: selectedPatient || 'N/A',
    timestamp: new Date().toLocaleTimeString(),
    battery: `${Math.round(Math.random() * 30 + 70)}%` // 70-100%
  });

  const fetchData = (newData) => {
    if (newData) {
      setData({
        ...newData,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const toggleBuzzer = () => {
    if (demoMode) {
      setData(prev => ({
        ...prev,
        buzzerEnabled: !prev?.buzzerEnabled
      }));
    }
    // In real mode, this would make an API call to the ESP32
  };

  const toggleLight = () => {
    if (demoMode) {
      setData(prev => ({
        ...prev,
        lightState: !prev?.lightState
      }));
    }
    // In real mode, this would make an API call to the ESP32
  };

  // Demo mode interval
  useEffect(() => {
    if (!demoMode || !selectedPatient) return;

    setLoading(true);
    
    // Initial data
    setData(generateDemoData());
    setLoading(false);

    // Update demo data every 3 seconds
    const interval = setInterval(() => {
      setData(generateDemoData());
    }, 3000);

    return () => clearInterval(interval);
  }, [demoMode, selectedPatient]);

  // Real mode - reset when switching patients
  useEffect(() => {
    if (!demoMode) {
      setData(null);
      setError(null);
    }
  }, [selectedPatient, demoMode]);

  return {
    data,
    loading,
    error,
    toggleBuzzer,
    toggleLight,
    fetchData
  };
}