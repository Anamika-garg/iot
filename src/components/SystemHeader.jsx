import React from 'react';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export default function SystemHeader({ alerts }) {
  const criticalAlerts = alerts.filter(alert => alert.type === 'danger').length;
  const warningAlerts = alerts.filter(alert => alert.type === 'warning').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">System Status</p>
            <p className="text-2xl font-bold text-green-600">Operational</p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">All systems normal</p>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-yellow-600">
              {criticalAlerts + warningAlerts}
            </p>
          </div>
          <div className="p-3 bg-yellow-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {criticalAlerts} critical, {warningAlerts} warnings
        </p>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Uptime</p>
            <p className="text-2xl font-bold text-blue-600">99.8%</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Last restart: 7 days ago</p>
      </div>
    </div>
  );
}