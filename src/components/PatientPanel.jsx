import React from 'react';
import { Users, User } from 'lucide-react';

const patients = [
  { id: 'p001', name: 'John Smith', room: '101', age: 72, condition: 'Post-operative' },
  { id: 'p002', name: 'Mary Johnson', room: '102', age: 68, condition: 'Cardiac Monitoring' },
  { id: 'p003', name: 'Robert Brown', room: '103', age: 75, condition: 'Respiratory Care' },
  { id: 'p004', name: 'Sarah Davis', room: '104', age: 65, condition: 'Rehabilitation' }
];

export default function PatientPanel({ selectedPatient, onPatientChange }) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Patient Selection
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPatient === patient.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onPatientChange(patient.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{patient.name}</h3>
                <p className="text-xs text-muted-foreground">Room {patient.room}</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <p><span className="text-muted-foreground">Age:</span> {patient.age}</p>
              <p><span className="text-muted-foreground">Condition:</span> {patient.condition}</p>
            </div>
            {selectedPatient === patient.id && (
              <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Active Monitoring
              </div>
            )}
          </div>
        ))}
      </div>

      {!selectedPatient && (
        <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-700 text-sm text-center">
            Select a patient to begin monitoring
          </p>
        </div>
      )}
    </div>
  );
}