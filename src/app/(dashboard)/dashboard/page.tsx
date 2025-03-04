// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Server,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronDown,
  MoveRight,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import MetricsCard from "@/components/visualizations/MetricsCard";
import TimeSeriesChart from "@/components/visualizations/TimeSeriesChart";
import ResultsTable from "@/components/visualizations/ResultsTable";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import useNetworkData from "@/hooks/useNetworkData";
import { generateMockAlerts } from "@/lib/mockData";
import { formatBytes } from "@/lib/utils";

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Network Dashboard
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard
          title="Total Traffic"
          value="3.42 TB"
          change={12}
          icon={Activity}
        />
        <MetricsCard
          title="Active Devices"
          value="1,247"
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
        <DashboardCard
          title="Network Traffic Trends"
          isLoading={loading}
          action={
            <Link
              href="/query"
              className="text-xs text-green-700 font-medium flex items-center hover:text-green-800"
            >
              View Details
              <MoveRight className="ml-1 h-3 w-3" />
            </Link>
          }
        >
          {data?.timeSeriesData ? (
            <TimeSeriesChart data={data.timeSeriesData} height={250} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </DashboardCard>

        {/* Top Devices */}
        <DashboardCard
          title="Top Devices by Traffic"
          isLoading={loading}
          action={
            <Link
              href="/devices"
              className="text-xs text-green-700 font-medium flex items-center hover:text-green-800"
            >
              All Devices
              <MoveRight className="ml-1 h-3 w-3" />
            </Link>
          }
        >
          {data?.groupedData ? (
            <ResultsTable
              data={data.groupedData.map((item) => ({
                ...item,
                bytes: formatBytes(item.bytes),
              }))}
              columns={[
                { header: "IP Address", accessor: "source_ip" },
                { header: "Bytes", accessor: "bytes" },
                { header: "Packets", accessor: "packets" },
                { header: "Count", accessor: "count" },
              ]}
              maxHeight="250px"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No device data available</p>
            </div>
          )}
        </DashboardCard>

        {/* Recent Alerts */}
        <DashboardCard
          title="Recent Alerts"
          icon={AlertTriangle}
          action={
            <Link
              href="/alerts"
              className="text-xs text-green-700 font-medium flex items-center hover:text-green-800"
            >
              View All
              <MoveRight className="ml-1 h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-md ${
                  alert.severity === "Critical"
                    ? "bg-red-50 border-l-4 border-red-500"
                    : alert.severity === "High"
                    ? "bg-amber-50 border-l-4 border-amber-500"
                    : "bg-yellow-50 border-l-4 border-yellow-500"
                }`}
              >
                <div
                  className={`rounded-full p-1.5 mr-3 ${
                    alert.severity === "Critical"
                      ? "bg-red-100 text-red-600"
                      : alert.severity === "High"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(alert.timestamp).toLocaleTimeString()} ·{" "}
                    {alert.source}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No alerts at this time
              </div>
            )}
          </div>
        </DashboardCard>

        {/* System Health */}
        <DashboardCard
          title="System Health"
          action={
            <span className="text-xs bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full">
              All Systems Operational
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Collectors
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">3/3 Online</span>
                <span className="flex items-center text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  100%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Object Storage
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Healthy</span>
                <span className="flex items-center text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  99.9%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-600 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Query Engine
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Operational</span>
                <span className="flex items-center text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  100%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Alert System
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Minor Issues</span>
                <span className="flex items-center text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  98.2%
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
