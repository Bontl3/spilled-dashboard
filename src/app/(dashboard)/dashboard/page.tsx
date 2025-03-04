"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Server,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import MetricsCard from "@/components/visualizations/MetricsCard";
import TimeSeriesChart from "@/components/visualizations/TimeSeriesChart";
import ResultsTable from "@/components/visualizations/ResultsTable";
import useNetworkData from "@/hooks/useNetworkData";
import { generateMockAlerts } from "@/lib/mockData";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("Last 24 hours");
  const { data, loading, error, fetchData } = useNetworkData();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Initial data fetch
    fetchData({
      dataSource: "network-flows",
      visualizeFields: ["COUNT", "AVG(latency)"],
      whereConditions: [],
      limit: 1000,
      timeRange: timeRange,
    });

    // Get mock alerts
    setAlerts(generateMockAlerts(3));
  }, []);

  const handleRefresh = () => {
    fetchData({
      dataSource: "network-flows",
      visualizeFields: ["COUNT", "AVG(latency)"],
      whereConditions: [],
      limit: 1000,
      timeRange: timeRange,
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Network Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 15 minutes</option>
              <option>Last hour</option>
              <option>Last 6 hours</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <button
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard
          title="Total Traffic"
          value="2.8 TB"
          change={12}
          icon={Activity}
        />
        <MetricsCard
          title="Active Devices"
          value="732"
          change={5}
          icon={Server}
        />
        <MetricsCard
          title="Current Alerts"
          value={alerts.length.toString()}
          change={-2}
          icon={AlertTriangle}
        />
        <MetricsCard
          title="Avg. Latency"
          value={
            data?.summary?.avgLatency
              ? `${data.summary.avgLatency} ms`
              : "24.6 ms"
          }
          change={-8}
          icon={Clock}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">
              Network Traffic Trends
            </h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : data?.timeSeriesData ? (
              <TimeSeriesChart data={data.timeSeriesData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Top Devices */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">
              Top Devices by Traffic
            </h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : data?.groupedData ? (
              <ResultsTable
                data={data.groupedData}
                columns={[
                  { header: "IP Address", accessor: "source_ip" },
                  { header: "Bytes", accessor: "bytes" },
                  { header: "Packets", accessor: "packets" },
                  { header: "Count", accessor: "count" },
                ]}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No device data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Recent Alerts</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 border-l-2 ${
                    alert.severity === "Critical"
                      ? "border-red-500 bg-red-50"
                      : alert.severity === "High"
                      ? "border-amber-500 bg-amber-50"
                      : "border-yellow-500 bg-yellow-50"
                  } rounded-r`}
                >
                  <div className="ml-2">
                    <div className="text-sm text-gray-800 font-medium">
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()} -{" "}
                      {alert.source}
                    </div>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No alerts at this time
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">System Health</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Collectors
                  </span>
                </div>
                <span className="text-sm text-gray-600">3/3 Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Object Storage
                  </span>
                </div>
                <span className="text-sm text-gray-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Query Engine
                  </span>
                </div>
                <span className="text-sm text-gray-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Alert System
                  </span>
                </div>
                <span className="text-sm text-gray-600">Minor Issues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
