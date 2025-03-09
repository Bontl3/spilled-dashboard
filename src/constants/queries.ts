import { FilterOptionType } from "./filters";

export const PREDEFINED_QUERIES = [
  {
    id: "bandwidth_usage",
    category: "Performance",
    name: "Bandwidth Usage Analysis",
    description: "Monitor bandwidth consumption patterns",
    availableMetrics: ["inbound", "outbound", "total"],
    defaultTimeRange: "last_24h",
    applicableFilters: [
      "threshold",
      "device",
      "interface",
    ] as FilterOptionType[],
  },
  {
    id: "network_errors",
    category: "Troubleshooting",
    name: "Network Error Analysis",
    description: "Analyze network errors and their distribution",
    availableMetrics: ["crc_errors", "fragments", "collisions"],
    defaultTimeRange: "last_6h",
    applicableFilters: [
      "error_type",
      "severity",
      "device",
    ] as FilterOptionType[],
  },
  {
    id: "traffic_patterns",
    category: "Analysis",
    name: "Traffic Pattern Analysis",
    description: "Analyze traffic patterns by protocol and port",
    availableMetrics: ["bytes", "packets", "flows"],
    defaultTimeRange: "last_12h",
    applicableFilters: ["protocol", "port", "device"] as FilterOptionType[],
  },
  {
    id: "device_health",
    category: "Monitoring",
    name: "Device Health Metrics",
    description: "Monitor device health and performance",
    availableMetrics: ["cpu", "memory", "temperature"],
    defaultTimeRange: "last_1h",
    applicableFilters: [
      "device_type",
      "location",
      "status",
    ] as FilterOptionType[],
  },
];
