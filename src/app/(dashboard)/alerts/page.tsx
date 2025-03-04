// src/app/(dashboard)/alerts/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  X,
  Bell,
  Clock,
  Eye,
  Filter,
  Trash,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { generateMockAlerts } from "@/lib/mockData";
import DashboardCard from "@/components/ui/DashboardCard";
import AlertDetailsModal from "@/components/ui/AlertDetailsModal";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

interface Alert {
  id: string;
  message: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string | Date;
  source: string;
  type: string;
  details?: {
    ipAddress?: string;
    protocol?: string;
    port?: number;
  };
  acknowledged?: boolean;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-800",
      };
    case "High":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: "text-amber-600",
        badge: "bg-amber-100 text-amber-800",
      };
    case "Medium":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: "text-yellow-600",
        badge: "bg-yellow-100 text-yellow-800",
      };
    default:
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-800",
      };
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await new Promise<Alert[]>((resolve) => {
          setTimeout(() => {
            resolve(generateMockAlerts(8) as Alert[]);
          }, 500);
        });
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setError("Failed to load alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts =
    filterType === "all"
      ? alerts
      : alerts.filter(
          (alert) => alert.severity.toLowerCase() === filterType.toLowerCase()
        );

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleAcknowledgeAlert = (id: string) => {
    // In a real app, you would send this to an API
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
    setSelectedAlert(null);
  };

  const handleViewAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all alerts?")) {
      setAlerts([]);
    }
  };

  const handleConfigureNotifications = () => {
    // Add notification configuration logic here
    console.log("Configure notifications clicked");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Alerts</h1>
          <p className="text-gray-600">
            Network and security alerts requiring your attention
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleConfigureNotifications}
          >
            <Bell className="mr-2 h-4 w-4" />
            Configure Notifications
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Alerts</span>
            <span className="text-2xl font-bold">{alerts.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Critical</span>
            <span className="text-2xl font-bold text-red-600">
              {alerts.filter((a) => a.severity === "Critical").length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">High</span>
            <span className="text-2xl font-bold text-amber-600">
              {alerts.filter((a) => a.severity === "High").length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              className="appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <DashboardCard
        title="Active Alerts"
        icon={AlertTriangle}
        isLoading={loading}
      >
        {error ? (
          <div className="py-12 text-center text-red-600">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => {
              const colors = getSeverityColor(alert.severity);

              return (
                <div
                  key={alert.id}
                  className={`py-4 flex items-start justify-between ${colors.bg} rounded-md my-2 p-4 border ${colors.border}`}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full p-1.5 ${colors.badge} mr-3`}>
                      <ShieldAlert className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <h3 className={`text-base font-medium ${colors.text}`}>
                        {alert.message}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 gap-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDateTime(alert.timestamp)}
                        </span>
                        <span>•</span>
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span
                          className={`font-medium px-2 py-0.5 rounded-full ${colors.badge}`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full"
                      title="View details"
                      onClick={() => handleViewAlertDetails(alert)}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-green-600 rounded-full"
                      title="Acknowledge"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full"
                      title="Dismiss"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              All Clear!
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No alerts match your current filter criteria. Your network appears
              to be operating normally.
            </p>
          </div>
        )}
      </DashboardCard>

      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={handleAcknowledgeAlert}
        />
      )}
    </div>
  );
}
