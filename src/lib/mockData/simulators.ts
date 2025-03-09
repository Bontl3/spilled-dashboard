// /src/lib/mockData/simulators.ts
import { QueryConfig, QueryResult, Dataset } from "@/lib/mockData";
import { NetworkData } from "@/lib/mockData";

// Helper function to parse time range string into hours
function parseTimeRange(timeRange: string): number {
  if (!timeRange) return 24; // Default to 24 hours

  const match = timeRange.match(/last_(\d+)([mhd])/i);
  if (!match) return 24;

  const [_, value, unit] = match;
  const numValue = parseInt(value, 10);

  switch (unit.toLowerCase()) {
    case "m":
      return numValue / 60; // minutes to hours
    case "h":
      return numValue; // already in hours
    case "d":
      return numValue * 24; // days to hours
    default:
      return 24;
  }
}

// Helper function to generate random colors
function generateColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

// Helper function to generate random numbers
function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update simulateQueryResults to handle timeRanges and properly filter data
export async function simulateQueryResults(
  config: QueryConfig,
  networkData: NetworkData
): Promise<QueryResult> {
  // Validate networkData
  if (!networkData || !networkData.metrics || !networkData.errors) {
    throw new Error("Network data is not properly initialized");
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Parse time range for filtering
  const timeRangeHours = parseTimeRange(config.timeRange);
  const cutoffTime = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000);

  // Filter metrics by time range
  const filteredMetrics = networkData.metrics.filter(
    (m) => new Date(m.timestamp) >= cutoffTime
  );

  // Filter errors by time range
  const filteredErrors = networkData.errors.filter(
    (e) => new Date(e.timestamp) >= cutoffTime
  );

  // Generate time labels based on the filtered data
  const timeLabels = filteredMetrics
    .map((m) => m.timestamp)
    .filter((value, index, self) => self.indexOf(value) === index) // Get unique timestamps
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort chronologically
    .map((timestamp) =>
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

  // Process data based on query type
  let datasets: Dataset[] = [];

  switch (config.query.id) {
    case "bandwidth_usage":
      datasets = config.query.metrics.map((metric) => {
        const metricData = filteredMetrics.reduce((acc, m) => {
          const timestamp = new Date(m.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const index = timeLabels.indexOf(timestamp);
          if (index !== -1) {
            if (!acc[index]) {
              acc[index] = 0;
            }

            if (metric === "total") {
              acc[index] += m.bandwidth.inbound + m.bandwidth.outbound;
            } else if (metric === "inbound" || metric === "outbound") {
              acc[index] += m.bandwidth[metric];
            }
          }
          return acc;
        }, Array(timeLabels.length).fill(0));

        return {
          label:
            metric === "total"
              ? "Total Bandwidth"
              : `${metric.charAt(0).toUpperCase() + metric.slice(1)} Traffic`,
          data: metricData,
          borderColor: generateColor(),
          fill: false,
        };
      });
      break;

    case "network_errors":
      // Group errors by timestamp and count
      const errorsByTimestamp = filteredErrors.reduce(
        (acc, error) => {
          const timestamp = new Date(error.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const index = timeLabels.indexOf(timestamp);
          if (index !== -1) {
            if (!acc.counts[index]) acc.counts[index] = 0;
            if (!acc.colors[index]) acc.colors[index] = "";

            acc.counts[index] += error.count;

            // Use the highest severity color
            if (error.severity === "high" || acc.colors[index] === "#ef4444") {
              acc.colors[index] = "#ef4444"; // red
            } else if (
              (error.severity === "medium" &&
                acc.colors[index] !== "#ef4444") ||
              acc.colors[index] === "#f59e0b"
            ) {
              acc.colors[index] = "#f59e0b"; // orange
            } else if (acc.colors[index] === "") {
              acc.colors[index] = "#10b981"; // green
            }
          }
          return acc;
        },
        {
          counts: Array(timeLabels.length).fill(0),
          colors: Array(timeLabels.length).fill(""),
        }
      );

      datasets = [
        {
          label: "Error Count",
          data: errorsByTimestamp.counts,
          backgroundColor: errorsByTimestamp.colors,
        },
      ];
      break;

    case "traffic_patterns":
      // Process traffic data
      const trafficData = networkData.traffic
        .filter((t) => new Date(t.timestamp) >= cutoffTime)
        .reduce((acc, traffic) => {
          // Handle protocol grouping if requested
          const timestamp = new Date(traffic.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const index = timeLabels.indexOf(timestamp);
          if (index !== -1) {
            config.query.metrics.forEach((metric) => {
              if (!acc[metric]) {
                acc[metric] = Array(timeLabels.length).fill(0);
              }

              if (metric === "bytes") {
                acc[metric][index] += traffic.bytes;
              } else if (metric === "packets") {
                acc[metric][index] += traffic.packets;
              } else if (metric === "flows") {
                acc[metric][index] += traffic.flows;
              }
            });
          }
          return acc;
        }, {});

      datasets = Object.entries(trafficData).map(([metric, data]) => ({
        label: `${metric.charAt(0).toUpperCase() + metric.slice(1)}`,
        data,
        borderColor: generateColor(),
        fill: false,
      }));
      break;

    case "device_health":
      // Process device health metrics
      const deviceHealthData = filteredMetrics.reduce((acc, metric) => {
        const timestamp = new Date(metric.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const index = timeLabels.indexOf(timestamp);
        if (index !== -1) {
          config.query.metrics.forEach((metricType) => {
            if (!acc[metricType]) {
              acc[metricType] = Array(timeLabels.length).fill(0);
              acc[`${metricType}_count`] = Array(timeLabels.length).fill(0);
            }

            if (metricType === "cpu") {
              acc[metricType][index] += metric.cpu;
              acc[`${metricType}_count`][index]++;
            } else if (metricType === "memory") {
              acc[metricType][index] += metric.memory;
              acc[`${metricType}_count`][index]++;
            } else if (metricType === "temperature") {
              acc[metricType][index] += metric.temperature;
              acc[`${metricType}_count`][index]++;
            }
          });
        }
        return acc;
      }, {});

      // Calculate averages
      const healthDatasets = {};
      Object.keys(deviceHealthData).forEach((key) => {
        if (!key.includes("_count")) {
          healthDatasets[key] = deviceHealthData[key].map((value, i) => {
            const count = deviceHealthData[`${key}_count`][i];
            return count > 0 ? value / count : 0;
          });
        }
      });

      datasets = Object.entries(healthDatasets).map(([metric, data]) => ({
        label: `Avg ${metric.charAt(0).toUpperCase() + metric.slice(1)}`,
        data,
        borderColor: generateColor(),
        fill: false,
      }));
      break;

    // Default case for any other query
    default:
      datasets = [
        {
          label: "Default Data",
          data: Array(timeLabels.length)
            .fill(0)
            .map(() => generateRandomNumber(0, 100)),
          borderColor: "#3b82f6",
          fill: false,
        },
      ];
  }

  return {
    visualization: config.visualization,
    data: {
      labels: timeLabels,
      datasets,
    },
  };
}
