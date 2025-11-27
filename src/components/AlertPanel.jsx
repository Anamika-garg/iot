import React from 'react';
import { AlertTriangle, Info, CheckCircle, X, Clock } from 'lucide-react';

export function AlertPanel({ alerts }) {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-500/20 border-red-500/50',
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-500/20 border-yellow-500/50',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500/20 border-green-500/50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-500/20 border-blue-500/50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (alerts.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">All Clear</h3>
        <p className="text-muted-foreground">No active alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 max-h-96 overflow-y-auto">
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${config.bgColor} ${config.textColor} animate-in slide-in-from-right-5 duration-500`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-80">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}