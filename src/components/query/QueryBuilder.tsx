// src/components/query/QueryBuilder.tsx
// src/components/query/QueryBuilder.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Play,
  Plus,
  X,
  Search,
  Clock,
  BarChart2,
  LineChart,
  PieChart,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import WhereCondition from "./WhereCondition";
import GroupBySelector from "./GroupBySelector";

// Import QueryConfig from a shared types file instead of Dashboard
import { QueryConfig } from "@/lib/mockData";

// Type definitions for filter options
type FilterOptionType =
  | "threshold"
  | "device_type"
  | "protocol"
  | "error_type"
  | "location"
  | "device"
  | "interface"
  | "severity"
  | "status"
  | "port";

interface FilterOption {
  label: string;
  value: string;
}

// Predefined queries with proper context
const PREDEFINED_QUERIES = [
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

// Filter options based on context
const FILTER_OPTIONS: Record<FilterOptionType, FilterOption[]> = {
  threshold: [
    { label: "High Usage (>90%)", value: "utilization > 90" },
    { label: "Medium Usage (50-90%)", value: "utilization BETWEEN 50 AND 90" },
    { label: "Low Usage (<50%)", value: "utilization < 50" },
  ],
  device_type: [
    { label: "Routers", value: 'type = "router"' },
    { label: "Switches", value: 'type = "switch"' },
    { label: "Firewalls", value: 'type = "firewall"' },
    { label: "Servers", value: 'type = "server"' },
  ],
  protocol: [
    { label: "HTTP/HTTPS", value: 'protocol IN ("HTTP", "HTTPS")' },
    { label: "TCP", value: 'protocol = "TCP"' },
    { label: "UDP", value: 'protocol = "UDP"' },
    { label: "ICMP", value: 'protocol = "ICMP"' },
  ],
  error_type: [
    { label: "CRC Errors", value: 'error_type = "CRC"' },
    { label: "Fragments", value: 'error_type = "Fragment"' },
    { label: "Collisions", value: 'error_type = "Collision"' },
  ],
  location: [
    { label: "Data Center North", value: 'location = "DC-North"' },
    { label: "Data Center South", value: 'location = "DC-South"' },
    { label: "Edge Locations", value: 'location LIKE "Edge%"' },
  ],
  device: [
    { label: "Core Routers", value: 'device_id LIKE "r%"' },
    { label: "Switches", value: 'device_id LIKE "s%"' },
    { label: "Firewalls", value: 'device_id LIKE "f%"' },
    { label: "Servers", value: 'device_id LIKE "srv%"' },
  ],
  interface: [
    { label: "Ethernet", value: 'interface_type = "ethernet"' },
    { label: "Fiber", value: 'interface_type = "fiber"' },
    { label: "Wireless", value: 'interface_type = "wireless"' },
  ],
  severity: [
    { label: "High", value: 'severity = "high"' },
    { label: "Medium", value: 'severity = "medium"' },
    { label: "Low", value: 'severity = "low"' },
  ],
  status: [
    { label: "Active", value: 'status = "active"' },
    { label: "Inactive", value: 'status = "inactive"' },
    { label: "Maintenance", value: 'status = "maintenance"' },
  ],
  port: [
    { label: "HTTP (80)", value: "port = 80" },
    { label: "HTTPS (443)", value: "port = 443" },
    { label: "DNS (53)", value: "port = 53" },
    { label: "SSH (22)", value: "port = 22" },
  ],
};

// Time range options
const TIME_RANGES = [
  { label: "Last 30 minutes", value: "last_30m" },
  { label: "Last hour", value: "last_1h" },
  { label: "Last 6 hours", value: "last_6h" },
  { label: "Last 12 hours", value: "last_12h" },
  { label: "Last 24 hours", value: "last_24h" },
  { label: "Last 7 days", value: "last_7d" },
];

// Visualization options
const VISUALIZATION_TYPES = [
  { icon: LineChart, label: "Line Chart", value: "line" },
  { icon: BarChart2, label: "Bar Chart", value: "bar" },
  { icon: PieChart, label: "Pie Chart", value: "pie" },
];

interface QueryBuilderProps {
  onExecute: (config: QueryConfig) => void;
}

export function QueryBuilder({ onExecute }: QueryBuilderProps) {
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("last_24h");
  const [visualization, setVisualization] = useState<"line" | "bar" | "pie">(
    "line"
  );
  const [groupByOptions, setGroupByOptions] = useState<string[]>([]);

  // Get the current query definition
  const currentQuery = PREDEFINED_QUERIES.find((q) => q.id === selectedQuery);

  // Filter available filters based on current query
  const availableFilters =
    currentQuery?.applicableFilters.map((filterType) => ({
      type: filterType,
      options: FILTER_OPTIONS[filterType],
    })) || [];

  const handleExecute = () => {
    if (!currentQuery) return;

    onExecute({
      query: {
        id: currentQuery.id,
        metrics: currentQuery.availableMetrics,
        timeRange,
        filters: selectedFilters,
        groupBy: groupByOptions,
      },
      visualization,
      timeRange,
    });
  };

  const handleGroupByChange = (options: string[]) => {
    setGroupByOptions(options);
  };

  return (
    <div className="space-y-6">
      {/* Query Selection */}
      <div className="relative">
        <div
          className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
          onClick={() => setShowQueryDropdown(!showQueryDropdown)}
        >
          {currentQuery ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentQuery.name}</h3>
                  <p className="text-sm text-gray-500">
                    {currentQuery.description}
                  </p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-2 flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {currentQuery.category}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Select a query template...</div>
          )}
        </div>

        {showQueryDropdown && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
            <div className="p-2 border-b">
              <div className="flex items-center px-3 py-2 border rounded-md">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full ml-2 focus:outline-none"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {PREDEFINED_QUERIES.filter(
                (q) =>
                  q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  q.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  q.category.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((query) => (
                <div
                  key={query.id}
                  className="p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedQuery(query.id);
                    setShowQueryDropdown(false);
                    setSelectedFilters([]);
                    setTimeRange(query.defaultTimeRange);
                  }}
                >
                  <h3 className="font-medium">{query.name}</h3>
                  <p className="text-sm text-gray-500">{query.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {query.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {currentQuery && (
        <>
          {/* Time Range Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time Range</h3>
            <div className="grid grid-cols-3 gap-2">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "outline"}
                  onClick={() => setTimeRange(range.value)}
                  className="justify-start"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              {availableFilters.map(({ type, options }) => (
                <div key={type} className="space-y-2">
                  <h4 className="text-sm font-medium capitalize">
                    {type.replace("_", " ")}
                  </h4>
                  <div className="space-y-2 border rounded-md p-3">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedFilters.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFilters([
                                ...selectedFilters,
                                option.value,
                              ]);
                            } else {
                              setSelectedFilters(
                                selectedFilters.filter(
                                  (f) => f !== option.value
                                )
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group By (if applicable) */}
          {["bandwidth_usage", "network_errors"].includes(currentQuery.id) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Group By</h3>
              <GroupBySelector
                onChange={handleGroupByChange}
                options={[
                  { label: "Device", value: "device" },
                  { label: "Location", value: "location" },
                  { label: "Time", value: "time" },
                ]}
              />
            </div>
          )}

          {/* Visualization Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Visualization</h3>
            <div className="flex gap-2">
              {VISUALIZATION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={visualization === type.value ? "default" : "outline"}
                  onClick={() =>
                    setVisualization(type.value as "line" | "bar" | "pie")
                  }
                  className="flex items-center gap-2"
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Execute Button */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedQuery("");
                setSelectedFilters([]);
                setTimeRange("last_24h");
                setVisualization("line");
                setGroupByOptions([]);
              }}
            >
              Clear
            </Button>
            <Button onClick={handleExecute}>Run Query</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default QueryBuilder;
