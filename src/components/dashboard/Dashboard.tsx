"use client";
import { useState, useEffect } from "react";
import { QueryBuilder } from "@/components/query";
import {
  generateCompleteNetworkData,
  simulateQueryResults,
} from "@/lib/mockData";
import { Card } from "@/components/ui";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Import types from our types directory
import { NetworkData } from "@/types/network";
import { QueryConfig, QueryResult } from "@/types/queries";
import { LineChartData, BarChartData, PieChartData } from "@/types/charts";

// Dynamically import charts with no SSR
const LineChartComponent = dynamic(
  () => import("@/components/charts/LineChart").then((mod) => mod.LineChart),
  {
    ssr: false,
    loading: () => <ChartLoader />,
  }
);

const BarChartComponent = dynamic(
  () => import("@/components/charts/BarChart").then((mod) => mod.BarChart),
  {
    ssr: false,
    loading: () => <ChartLoader />,
  }
);

const PieChartComponent = dynamic(
  () => import("@/components/charts/PieChart").then((mod) => mod.PieChart),
  {
    ssr: false,
    loading: () => <ChartLoader />,
  }
);

// Loading components
function ChartLoader() {
  return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    </Card>
  );
}

// Type guard functions
const isLineChartData = (
  data: any[]
): data is Array<{
  time: string;
  inbound: number;
  outbound: number;
  total: number;
}> => {
  return data.every(
    (item) =>
      "time" in item &&
      "inbound" in item &&
      "outbound" in item &&
      "total" in item
  );
};

const isBarChartData = (
  data: any[]
): data is Array<{ label: string; value: number }> => {
  return data.every((item) => "label" in item && "value" in item);
};

const isPieChartData = (
  data: any[]
): data is Array<{ type: string; value: number }> => {
  return data.every((item) => "type" in item && "value" in item);
};

// Function to process network metrics from the raw NetworkData
function processNetworkMetrics(networkData: NetworkData | null) {
  if (
    !networkData ||
    !networkData.metrics ||
    networkData.metrics.length === 0
  ) {
    return {
      bandwidth: { inbound: 0, outbound: 0, total: 0, unit: "Mbps" },
      deviceStatus: { active: 0, total: 0 },
      packetLoss: { current: 0, unit: "%" },
    };
  }

  // Get the latest metrics for bandwidth calculation
  const latestMetrics = new Map();
  networkData.metrics.forEach((metric) => {
    const currentMetric = latestMetrics.get(metric.deviceId);
    if (
      !currentMetric ||
      new Date(metric.timestamp) > new Date(currentMetric.timestamp)
    ) {
      latestMetrics.set(metric.deviceId, metric);
    }
  });

  // Calculate total bandwidth across all devices
  let totalInbound = 0;
  let totalOutbound = 0;

  latestMetrics.forEach((metric) => {
    totalInbound += metric.bandwidth?.inbound || 0;
    totalOutbound += metric.bandwidth?.outbound || 0;
  });

  // Calculate packet loss from errors
  let packetLoss = 0;
  if (networkData.errors && networkData.errors.length > 0) {
    // Get most recent errors (last hour)
    const recentErrors = networkData.errors
      .filter((e) => new Date(e.timestamp) > new Date(Date.now() - 3600000))
      .reduce((sum, err) => sum + err.count, 0);

    // Calculate packet loss percentage (simplified formula)
    packetLoss = Math.min(recentErrors / 100, 5); // Cap at 5%
  }

  return {
    bandwidth: {
      inbound: totalInbound,
      outbound: totalOutbound,
      total: totalInbound + totalOutbound,
      unit: "Mbps",
    },
    deviceStatus: {
      active: networkData.devices.filter((d) => d.status === "active").length,
      total: networkData.devices.length,
    },
    packetLoss: {
      current: packetLoss.toFixed(2),
      unit: "%",
    },
  };
}

export function Dashboard() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryConfig, setQueryConfig] = useState<QueryConfig | null>(null);

  // Initialize network data on component mount
  useEffect(() => {
    try {
      const data = generateCompleteNetworkData();
      setNetworkData(data);
    } catch (err) {
      setError("Failed to initialize network data");
      console.error("Network data initialization error:", err);
    }
  }, []);

  const executeQuery = async (config: QueryConfig) => {
    if (!networkData) {
      setError("Network data not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await simulateQueryResults(config, networkData);
      setQueryConfig(config);
      setQueryResults(results);
    } catch (err) {
      console.error("Query execution error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching results"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Transform data for LineChart component
  const transformToLineChartData = (results: QueryResult): LineChartData[] => {
    return results.data.labels.map((time, index) => {
      // Initialize data point
      const dataPoint: LineChartData = {
        time,
        inbound: 0,
        outbound: 0,
        total: 0,
      };

      // Map datasets to properties
      results.data.datasets.forEach((dataset) => {
        const label = dataset.label.toLowerCase();
        if (label.includes("inbound")) {
          dataPoint.inbound = dataset.data[index] || 0;
        } else if (label.includes("outbound")) {
          dataPoint.outbound = dataset.data[index] || 0;
        } else if (label.includes("total")) {
          dataPoint.total = dataset.data[index] || 0;
        }
      });

      // Calculate total if not provided
      if (dataPoint.total === 0) {
        dataPoint.total = dataPoint.inbound + dataPoint.outbound;
      }

      return dataPoint;
    });
  };

  // Transform data for BarChart component
  const transformToBarChartData = (results: QueryResult): BarChartData[] => {
    return results.data.labels.map((label, index) => {
      // For bar charts, we typically use the first dataset
      const dataset = results.data.datasets[0];
      return {
        label,
        value: dataset?.data[index] || 0,
      };
    });
  };

  // Transform data for PieChart component
  const transformToPieChartData = (results: QueryResult): PieChartData[] => {
    return results.data.labels.map((type, index) => {
      // For pie charts, we typically use the first dataset
      const dataset = results.data.datasets[0];
      return {
        type,
        value: dataset?.data[index] || 0,
      };
    });
  };

  const renderChart = (results: QueryResult) => {
    switch (results.visualization) {
      case "line":
        const lineData = transformToLineChartData(results);
        return <LineChartComponent data={lineData} />;
      case "bar":
        const barData = transformToBarChartData(results);
        return <BarChartComponent data={barData} />;
      case "pie":
        const pieData = transformToPieChartData(results);
        return <PieChartComponent data={pieData} />;
      default:
        return null;
    }
  };

  // Get processed metrics
  const metrics = processNetworkMetrics(networkData);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium">Network Status</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold text-green-600">
                  {metrics.deviceStatus.active} / {metrics.deviceStatus.total}
                </div>
                <div className="text-sm text-gray-500">Active Devices</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium">Current Traffic</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold">
                  {metrics.bandwidth.total} {metrics.bandwidth.unit}
                </div>
                <div className="text-sm text-gray-500">
                  In: {metrics.bandwidth.inbound} / Out:{" "}
                  {metrics.bandwidth.outbound}
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium">Error Rate</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold">
                  {metrics.packetLoss.current}
                  {metrics.packetLoss.unit}
                </div>
                <div className="text-sm text-gray-500">Packet Loss</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Query Builder */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-medium mb-4">Network Query</h2>
            <QueryBuilder onExecute={executeQuery} />
          </div>
        </Card>

        {/* Query Results with type checking */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {queryResults && !isLoading && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Query Results</h2>
              <div className="h-96">{renderChart(queryResults)}</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
