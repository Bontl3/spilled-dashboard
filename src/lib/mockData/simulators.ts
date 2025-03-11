// src/lib/mockData/simulators.ts
// src/lib/mockData/simulators.ts
import { QueryParams, NetworkData, TimeSeriesPoint } from "@/types";

export function generateMockData(queryParams: QueryParams): {
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
} {
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
      source_ip: group, // Add source_ip for convenience
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
