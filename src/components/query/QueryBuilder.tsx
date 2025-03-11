// src/components/query/QueryBuilder.tsx
"use client";

import { useState, useEffect } from "react";
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
  Info,
  AlertCircle,
  Database,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { QueryConfig, QueryParams } from "@/types";

// Constants for predefined queries
const PREDEFINED_QUERIES = [
  {
    id: "bandwidth_usage",
    category: "Performance",
    name: "Bandwidth Usage Analysis",
    description: "Monitor bandwidth consumption patterns",
    availableMetrics: ["inbound", "outbound", "total"],
    defaultTimeRange: "last_24h",
    applicableFilters: ["threshold", "device", "interface"],
  },
  {
    id: "network_errors",
    category: "Troubleshooting",
    name: "Network Error Analysis",
    description: "Analyze network errors and their distribution",
    availableMetrics: ["crc_errors", "fragments", "collisions"],
    defaultTimeRange: "last_6h",
    applicableFilters: ["error_type", "severity", "device"],
  },
  {
    id: "traffic_patterns",
    category: "Analysis",
    name: "Traffic Pattern Analysis",
    description: "Analyze traffic patterns by protocol and port",
    availableMetrics: ["bytes", "packets", "flows"],
    defaultTimeRange: "last_12h",
    applicableFilters: ["protocol", "port", "device"],
  },
  {
    id: "device_health",
    category: "Monitoring",
    name: "Device Health Metrics",
    description: "Monitor device health and performance",
    availableMetrics: ["cpu", "memory", "temperature"],
    defaultTimeRange: "last_1h",
    applicableFilters: ["device_type", "location", "status"],
  },
];

// Filter options based on context
const FILTER_OPTIONS = {
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

// Group by options for different query types
const GROUP_BY_OPTIONS = {
  bandwidth_usage: [
    { label: "Device", value: "device_id" },
    { label: "Location", value: "location" },
    { label: "Interface", value: "interface" },
    { label: "Time", value: "time" },
  ],
  network_errors: [
    { label: "Error Type", value: "error_type" },
    { label: "Device", value: "device_id" },
    { label: "Severity", value: "severity" },
    { label: "Time", value: "time" },
  ],
  traffic_patterns: [
    { label: "Protocol", value: "protocol" },
    { label: "Device", value: "device_id" },
    { label: "Port", value: "port" },
    { label: "Time", value: "time" },
  ],
  device_health: [
    { label: "Device Type", value: "device_type" },
    { label: "Location", value: "location" },
    { label: "Status", value: "status" },
  ],
};

interface QueryBuilderProps {
  onExecute?: (config: QueryConfig) => void;
  onRunQuery?: (params: QueryParams) => Promise<void>;
  savedQuery?: QueryParams;
}

export default function QueryBuilder({
  onExecute,
  onRunQuery,
  savedQuery,
}: QueryBuilderProps) {
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("last_24h");
  const [visualization, setVisualization] = useState<"line" | "bar" | "pie">(
    "line"
  );
  const [groupByOptions, setGroupByOptions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [queryValid, setQueryValid] = useState(false);

  // Get the current query definition
  const currentQuery = PREDEFINED_QUERIES.find((q) => q.id === selectedQuery);

  // Update query validity
  useEffect(() => {
    setQueryValid(
      !!currentQuery && selectedMetrics.length > 0 && timeRange !== ""
    );
  }, [currentQuery, selectedMetrics, timeRange]);

  // Initialize selected metrics when query changes
  useEffect(() => {
    if (currentQuery) {
      // Set first metric by default
      setSelectedMetrics(currentQuery.availableMetrics.slice(0, 1));
      // Set time range to default
      setTimeRange(currentQuery.defaultTimeRange);
      // Reset filters
      setSelectedFilters([]);
      // Reset group by options
      setGroupByOptions([]);
    }
  }, [currentQuery]);

  // Load saved query if provided
  useEffect(() => {
    if (savedQuery) {
      // Find matching query template
      const matchingQuery = PREDEFINED_QUERIES.find(
        (q) =>
          savedQuery.dataSource.includes(q.id) ||
          (savedQuery.visualizeFields &&
            q.availableMetrics.some((m) =>
              savedQuery.visualizeFields.includes(m)
            ))
      );

      if (matchingQuery) {
        setSelectedQuery(matchingQuery.id);

        if (savedQuery.visualizeFields) {
          setSelectedMetrics(savedQuery.visualizeFields);
        }

        if (savedQuery.whereConditions) {
          setSelectedFilters(savedQuery.whereConditions);
        }

        if (savedQuery.timeRange) {
          setTimeRange(savedQuery.timeRange);
        }

        if (savedQuery.groupBy) {
          setGroupByOptions([savedQuery.groupBy]);
        }
      }
    }
  }, [savedQuery]);

  // Filter available filters based on current query
  const availableFilters = currentQuery
    ? currentQuery.applicableFilters.map((filterType) => ({
        type: filterType,
        options:
          FILTER_OPTIONS[filterType as keyof typeof FILTER_OPTIONS] || [],
      }))
    : [];

  const handleExecute = () => {
    if (!currentQuery) return;

    if (onExecute) {
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
    }

    if (onRunQuery && savedQuery) {
      onRunQuery(savedQuery);
    }
  };

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      // Don't allow removing all metrics
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleFilterToggle = (filterValue: string) => {
    if (selectedFilters.includes(filterValue)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filterValue));
    } else {
      setSelectedFilters([...selectedFilters, filterValue]);
    }
  };

  const handleGroupByChange = (option: string) => {
    if (groupByOptions.includes(option)) {
      setGroupByOptions(groupByOptions.filter((o) => o !== option));
    } else {
      setGroupByOptions([option]);
    }
  };

  const renderQueryPreview = () => {
    if (!currentQuery) return null;

    // Create readable filter conditions
    const filterReadable = selectedFilters.map((filter) => {
      for (const filterType of currentQuery.applicableFilters) {
        const options =
          FILTER_OPTIONS[filterType as keyof typeof FILTER_OPTIONS] || [];
        const matchingOption = options.find((o) => o.value === filter);
        if (matchingOption) {
          return matchingOption.label;
        }
      }
      return filter;
    });

    // Create readable group by
    const groupByReadable = groupByOptions.map((option) => {
      const options =
        GROUP_BY_OPTIONS[currentQuery.id as keyof typeof GROUP_BY_OPTIONS] ||
        [];
      const match = options.find((o) => o.value === option);
      return match ? match.label : option;
    });

    // Create readable time range
    const timeRangeReadable =
      TIME_RANGES.find((t) => t.value === timeRange)?.label || timeRange;

    return (
      <div className="p-4 border rounded-lg bg-gray-50 mt-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          Query Preview
        </h3>
        <div className="text-xs text-gray-600 space-y-2">
          <div>
            <span className="font-medium">Query Type:</span> {currentQuery.name}
          </div>
          <div>
            <span className="font-medium">Metrics:</span>{" "}
            {selectedMetrics.length > 0
              ? selectedMetrics
                  .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
                  .join(", ")
              : "None selected"}
          </div>
          <div>
            <span className="font-medium">Time Range:</span> {timeRangeReadable}
          </div>
          <div>
            <span className="font-medium">Filters:</span>{" "}
            {filterReadable.length > 0 ? filterReadable.join("; ") : "None"}
          </div>
          <div>
            <span className="font-medium">Group By:</span>{" "}
            {groupByReadable.length > 0 ? groupByReadable.join(", ") : "None"}
          </div>
          <div>
            <span className="font-medium">Visualization:</span>{" "}
            {VISUALIZATION_TYPES.find((v) => v.value === visualization)?.label}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Query Selection */}
      <div className="relative">
        <div
          className={cn(
            "p-4 border rounded-lg cursor-pointer transition-colors",
            showQueryDropdown
              ? "border-green-500 ring-2 ring-green-200"
              : "hover:border-green-500"
          )}
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
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    showQueryDropdown ? "transform rotate-180" : ""
                  }`}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {currentQuery.category}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-gray-500 flex items-center">
                <Database className="h-5 w-5 mr-2 text-gray-400" />
                <span>Select a query template...</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  showQueryDropdown ? "transform rotate-180" : ""
                }`}
              />
            </div>
          )}
        </div>

        {showQueryDropdown && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
            <div className="p-2 border-b sticky top-0 bg-white z-10">
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
                  className={cn(
                    "p-3 cursor-pointer hover:bg-gray-50",
                    selectedQuery === query.id && "bg-green-50"
                  )}
                  onClick={() => {
                    setSelectedQuery(query.id);
                    setShowQueryDropdown(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{query.name}</h3>
                    {selectedQuery === query.id && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{query.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    {query.category}
                  </span>
                </div>
              ))}

              {PREDEFINED_QUERIES.filter(
                (q) =>
                  q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  q.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  q.category.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  No queries found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {currentQuery && (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center text-sm text-gray-700"
            >
              {previewMode ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Show Preview
                </>
              )}
            </button>
          </div>

          <div className={previewMode ? "grid grid-cols-2 gap-6" : ""}>
            <div className="space-y-6">
              {/* Metrics Selection */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-1 text-gray-500" />
                  Metrics to Analyze
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {currentQuery.availableMetrics.map((metric) => (
                    <button
                      key={metric}
                      onClick={() => handleMetricToggle(metric)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm text-left flex items-center",
                        selectedMetrics.includes(metric)
                          ? "bg-green-100 border-green-300 border text-green-800"
                          : "bg-gray-50 border-gray-200 border text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded mr-2 flex items-center justify-center",
                          selectedMetrics.includes(metric)
                            ? "bg-green-500 text-white"
                            : "bg-white border border-gray-300"
                        )}
                      >
                        {selectedMetrics.includes(metric) && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range Selection */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Time Range
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      className={cn(
                        "flex justify-start items-center px-3 py-2 rounded-md text-sm",
                        timeRange === range.value
                          ? "bg-green-100 border-green-300 border text-green-800"
                          : "bg-gray-50 border-gray-200 border text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded mr-2 flex items-center justify-center",
                          timeRange === range.value
                            ? "bg-green-500 text-white"
                            : "bg-white border border-gray-300"
                        )}
                      >
                        {timeRange === range.value && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              {availableFilters.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-1 text-gray-500" />
                    Filters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableFilters.map(({ type, options }) => (
                      <div key={type} className="space-y-2">
                        <h4 className="text-xs font-medium uppercase text-gray-500 flex items-center">
                          {type.replace("_", " ")}
                          <span className="ml-1 text-gray-400">
                            ({options.length})
                          </span>
                        </h4>
                        <div className="space-y-2 border rounded-md p-3 bg-white">
                          {options.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={selectedFilters.includes(
                                    option.value
                                  )}
                                  onChange={() =>
                                    handleFilterToggle(option.value)
                                  }
                                />
                                <div className="w-4 h-4 border border-gray-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500"></div>
                                <CheckCircle className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group By (if applicable) */}
              {GROUP_BY_OPTIONS[
                currentQuery.id as keyof typeof GROUP_BY_OPTIONS
              ] && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Database className="h-4 w-4 mr-1 text-gray-500" />
                    Group By
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GROUP_BY_OPTIONS[
                      currentQuery.id as keyof typeof GROUP_BY_OPTIONS
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleGroupByChange(option.value)}
                        className={cn(
                          "flex justify-start items-center px-3 py-2 rounded-md text-sm",
                          groupByOptions.includes(option.value)
                            ? "bg-green-100 border-green-300 border text-green-800"
                            : "bg-gray-50 border-gray-200 border text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded mr-2 flex items-center justify-center",
                            groupByOptions.includes(option.value)
                              ? "bg-green-500 text-white"
                              : "bg-white border border-gray-300"
                          )}
                        >
                          {groupByOptions.includes(option.value) && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                        </div>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visualization Type */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <BarChart2 className="h-4 w-4 mr-1 text-gray-500" />
                  Visualization
                </h3>
                <div className="flex gap-2">
                  {VISUALIZATION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setVisualization(type.value as "line" | "bar" | "pie")
                      }
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                        visualization === type.value
                          ? "bg-green-100 border-green-300 border text-green-800"
                          : "bg-gray-50 border-gray-200 border text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {previewMode && (
              <div className="space-y-4">
                {renderQueryPreview()}

                {!queryValid && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
                    <div>
                      <p className="font-medium">Query not yet ready</p>
                      <p className="mt-1">
                        Please make sure you've selected a query type and at
                        least one metric to visualize.
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium mb-2">
                    Query Completeness
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Query Type</span>
                      <span className="text-xs font-medium">
                        {currentQuery ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Selected
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <X className="h-3 w-3 mr-1" />
                            Missing
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Metrics</span>
                      <span className="text-xs font-medium">
                        {selectedMetrics.length > 0 ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {selectedMetrics.length} selected
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <X className="h-3 w-3 mr-1" />
                            None selected
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Time Range</span>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Visualization</span>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedQuery("");
                  setSelectedMetrics([]);
                  setSelectedFilters([]);
                  setTimeRange("last_24h");
                  setVisualization("line");
                  setGroupByOptions([]);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                onClick={handleExecute}
                disabled={!queryValid}
                className={!queryValid ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Play className="h-4 w-4 mr-1" />
                Run Query
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
