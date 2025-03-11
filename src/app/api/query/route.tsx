import { NetworkData, QueryParams, TimeSeriesPoint } from "@/types";

export interface QueryResult {
  timeSeriesData?: TimeSeriesPoint[];
  groupedData?: Record<string, any>[];
  summary?: {
    totalCount?: number;
    avgLatency?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

interface ExtendedNetworkData extends NetworkData {
  timeSeriesData?: TimeSeriesPoint[];
  groupedData?: Record<string, any>[];
  summary?: {
    totalCount?: number;
    avgLatency?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export function generateMockData(queryParams: QueryParams): QueryResult {
  // Create randomized data based on the query parameters
  const timePoints = 24;
  const now = new Date();

  const timeSeriesData: TimeSeriesPoint[] = Array.from({
    length: timePoints,
  }).map((_, i) => {
    const time = new Date(now);
    time.setHours(now.getHours() - (timePoints - i));

    // Base value with some randomness
    const baseValue = 1500;
    const randomFactor = Math.sin(i * 0.5) * 100 + (Math.random() * 100 - 50);

    return {
      time: time.toISOString(),
      value: Math.round(baseValue + randomFactor),
      // Add more metrics if requested
      latency: Math.round((20 + Math.random() * 30) * 10) / 10, // 20-50ms with 1 decimal
    };
  });

  // If there's a group by, create some grouped data
  let groupedData: Record<string, any>[] = [];
  if (queryParams.groupBy) {
    const groups = [
      "192.168.1.1",
      "10.0.0.1",
      "172.16.0.1",
      "192.168.1.100",
      "10.0.0.2",
    ];
    groupedData = groups.map((group) => ({
      [queryParams.groupBy as string]: group,
      count: Math.round(Math.random() * 1000) + 500,
      bytes: Math.round(Math.random() * 100000000),
      packets: Math.round(Math.random() * 10000),
    }));
  }

  return {
    timeSeriesData,
    groupedData,
    summary: {
      totalCount: timeSeriesData.reduce((sum, point) => sum + point.value, 0),
      avgLatency:
        Math.round(
          (timeSeriesData.reduce(
            (sum, point) => sum + (point.latency || 0),
            0
          ) /
            timeSeriesData.length) *
            10
        ) / 10,
      timeRange: {
        start: timeSeriesData[0].time,
        end: timeSeriesData[timeSeriesData.length - 1].time,
      },
    },
  };
}

export function generateMockAlerts(count = 5) {
  const now = new Date();
  const alertTypes = [
    "High Traffic",
    "Latency Spike",
    "Packet Loss",
    "Connection Drop",
    "Security Alert",
  ];
  const severities = ["Low", "Medium", "High", "Critical"];

  return Array.from({ length: count }).map((_, i) => {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - Math.floor(Math.random() * 120)); // Random time in the last 2 hours

    return {
      id: `alert-${i + 1}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: `${
        alertTypes[Math.floor(Math.random() * alertTypes.length)]
      } detected`,
      source: `Device-${Math.floor(Math.random() * 10) + 1}`,
      timestamp: time.toISOString(),
    };
  });
}
