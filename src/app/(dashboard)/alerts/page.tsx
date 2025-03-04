"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Check, X, Bell } from "lucide-react";
import { generateMockAlerts } from "@/lib/mockData";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading alerts
    setLoading(true);
    setTimeout(() => {
      setAlerts(generateMockAlerts(8));
      setLoading(false);
    }, 500);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 bg-red-100";
      case "High":
        return "text-amber-600 bg-amber-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Alerts</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium text-gray-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Active Alerts
          </h2>
          <div className="flex space-x-2">
            <button className="text-gray-500 border border-gray-300 px-3 py-1 rounded-md text-sm flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              Configure Notifications
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : alerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="py-4 flex items-start justify-between"
                >
                  <div className="flex items-start">
                    <div
                      className={`rounded-full p-1.5 ${getSeverityColor(
                        alert.severity
                      )} mr-3`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </h3>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className="mr-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span className="mr-2">•</span>
                        <span>{alert.source}</span>
                        <span className="mx-2">•</span>
                        <span
                          className={`font-medium ${
                            alert.severity === "Critical"
                              ? "text-red-600"
                              : alert.severity === "High"
                              ? "text-amber-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-500 rounded-full">
                      <Check className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-500 rounded-full">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No alerts at this time
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
