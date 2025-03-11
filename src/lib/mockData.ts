// Network Types
export interface Node {
  id: string;
  label: string;
  type: "router" | "switch" | "server" | "client";
  status: "active" | "inactive" | "warning" | "error";
  ipAddress?: string;
  location?: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  bandwidth: string;
  latency?: number;
  status: "active" | "congested" | "down";
}

export interface NetworkMetrics {
  timestamp: string;
  bandwidth: {
    current: number;
    max: number;
    unit: "Mbps" | "Gbps";
    utilization: number;
  };
  latency: {
    current: number;
    min: number;
    max: number;
    unit: "ms";
  };
  packetLoss: {
    current: number;
    threshold: number;
    unit: "%";
  };
  errors: {
    crc: number;
    fragments: number;
    collisions: number;
  };
}

export interface NetworkData {
  devices: Array<{
    id: string;
    name: string;
    type: "router" | "switch" | "firewall" | "server";
    location: string;
    status: "active" | "inactive" | "maintenance";
  }>;
  metrics: Array<{
    deviceId: string;
    timestamp: string;
    cpu: number;
    memory: number;
    bandwidth: {
      inbound: number;
      outbound: number;
    };
    temperature: number;
  }>;
  errors: Array<{
    deviceId: string;
    timestamp: string;
    type: "CRC" | "Fragment" | "Collision";
    severity: "low" | "medium" | "high";
    count: number;
  }>;
  traffic: Array<{
    deviceId: string;
    timestamp: string;
    protocol: "HTTP" | "HTTPS" | "TCP" | "UDP" | "ICMP";
    bytes: number;
    packets: number;
    flows: number;
  }>;
}

// First, export all the base types
export interface Device {
  id: string;
  name: string;
  type: "router" | "switch" | "firewall" | "server";
  location: string;
  status: "active" | "inactive" | "maintenance";
}

export interface MetricData {
  deviceId: string;
  timestamp: string;
  cpu: number;
  memory: number;
  bandwidth: {
    inbound: number;
    outbound: number;
  };
  temperature: number;
}

export interface ErrorData {
  deviceId: string;
  timestamp: string;
  type: "CRC" | "Fragment" | "Collision";
  severity: "low" | "medium" | "high";
  count: number;
}

export interface TrafficData {
  deviceId: string;
  timestamp: string;
  protocol: Protocol;
  bytes: number;
  packets: number;
  flows: number;
}

// First, define all the data types
export interface BandwidthData {
  timestamp: string;
  inbound: number;
  outbound: number;
  total: number;
  deviceId?: string;
}

// Mock Data Generators
const generateRandomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

const generateRandomBandwidth = () =>
  `${Math.floor(Math.random() * 10)}${Math.random() > 0.5 ? "Gbps" : "Mbps"}`;

export function generateNetworkTopology(
  nodeCount: number = 10,
  edgeCount: number = 15
) {
  // This function now specifically generates topology data
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i + 1}`,
    label: `Device-${i + 1}`,
    type: randomChoice(["router", "switch", "server", "client"] as const),
    status: randomChoice(["active", "inactive", "warning", "error"] as const),
    ipAddress: generateRandomIP(),
    location: `DC-${Math.floor(i / 3) + 1}`,
  }));

  const edges = Array.from({ length: edgeCount }, (_, i) => ({
    id: `edge-${i + 1}`,
    source: randomChoice(nodes).id,
    target: randomChoice(nodes).id,
    bandwidth: generateRandomBandwidth(),
    latency: Math.floor(Math.random() * 100),
    status: randomChoice(["active", "congested", "down"] as const),
  }));

  return { nodes, edges };
}

// Use generateCompleteNetworkData as the main data generator
export function generateCompleteNetworkData(): NetworkData {
  const devices: Device[] = [
    {
      id: "r1",
      name: "Router-DC-North",
      type: "router",
      location: "DC-North",
      status: "active",
    },
    {
      id: "r2",
      name: "Router-DC-South",
      type: "router",
      location: "DC-South",
      status: "active",
    },
    {
      id: "s1",
      name: "Switch-Core-1",
      type: "switch",
      location: "DC-North",
      status: "active",
    },
    {
      id: "f1",
      name: "Firewall-Edge",
      type: "firewall",
      location: "DC-North",
      status: "active",
    },
    {
      id: "srv1",
      name: "Server-App-1",
      type: "server",
      location: "DC-South",
      status: "active",
    },
  ];

  const timestamps = generateTimeSeriesData(24);
  const metrics: MetricData[] = [];
  const errors: ErrorData[] = [];
  const traffic: TrafficData[] = [];

  devices.forEach((device) => {
    timestamps.forEach((timestamp) => {
      // Generate metrics
      metrics.push({
        deviceId: device.id,
        timestamp,
        cpu: generateRandomNumber(10, 90),
        memory: generateRandomNumber(20, 85),
        bandwidth: {
          inbound: generateRandomNumber(100, 1000),
          outbound: generateRandomNumber(100, 1000),
        },
        temperature: generateRandomNumber(35, 75),
      });

      // Generate errors
      if (Math.random() > 0.7) {
        errors.push({
          deviceId: device.id,
          timestamp,
          type: ["CRC", "Fragment", "Collision"][generateRandomNumber(0, 2)] as
            | "CRC"
            | "Fragment"
            | "Collision",
          severity: ["low", "medium", "high"][generateRandomNumber(0, 2)] as
            | "low"
            | "medium"
            | "high",
          count: generateRandomNumber(1, 10),
        });
      }

      // Generate traffic
      traffic.push(generateTrafficData(device, timestamp));
    });
  });

  return { devices, metrics, errors, traffic };
}

// Keep the existing Alert type and generateMockAlerts function
export type Alert = {
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
};

export function generateMockAlerts(count: number): Alert[] {
  const severities: Alert["severity"][] = ["Critical", "High", "Medium", "Low"];

  return Array.from({ length: count }, () => ({
    id: Math.random().toString(36).substring(7),
    message: "Suspicious network activity detected",
    severity: severities[Math.floor(Math.random() * severities.length)],
    timestamp: new Date().toISOString(),
    source: "Network Monitor",
    type: "Security Alert",
    details: {
      ipAddress: "192.168.1.1",
      protocol: "TCP",
      port: 443,
    },
    acknowledged: false,
  }));
}

// Types
export interface NetworkDevice {
  id: string;
  name: string;
  type: "router" | "switch" | "server" | "client" | "firewall";
  status: "active" | "inactive" | "maintenance" | "error";
  ipAddress: string;
  location: string;
  lastSeen: string;
  metrics: {
    cpu: number;
    memory: number;
    diskUsage: number;
    temperature: number;
  };
}

export interface TrafficFlow {
  id: string;
  source: string;
  destination: string;
  protocol: "TCP" | "UDP" | "ICMP" | "HTTP" | "HTTPS";
  port: number;
  bytesTransferred: number;
  packetsTransferred: number;
  timestamp: string;
  duration: number; // in milliseconds
}

// Helper functions
const randomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

const randomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024);

const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// Mock data generators
export function generateMockDevices(count: number = 10): NetworkDevice[] {
  const deviceTypes: NetworkDevice["type"][] = [
    "router",
    "switch",
    "server",
    "client",
    "firewall",
  ];
  const locations = [
    "DC-North",
    "DC-South",
    "Office-HQ",
    "Branch-East",
    "Branch-West",
  ];
  const statuses: NetworkDevice["status"][] = [
    "active",
    "inactive",
    "maintenance",
    "error",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `device-${i + 1}`,
    name: `${deviceTypes[i % deviceTypes.length].toUpperCase()}-${i + 1}`,
    type: deviceTypes[i % deviceTypes.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    ipAddress: randomIP(),
    location: locations[Math.floor(Math.random() * locations.length)],
    lastSeen: new Date().toISOString(),
    metrics: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      diskUsage: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 50) + 20,
    },
  }));
}

export function generateMockTrafficFlows(count: number = 100): TrafficFlow[] {
  const protocols: TrafficFlow["protocol"][] = [
    "TCP",
    "UDP",
    "ICMP",
    "HTTP",
    "HTTPS",
  ];
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  return Array.from({ length: count }, (_, i) => ({
    id: `flow-${i + 1}`,
    source: randomIP(),
    destination: randomIP(),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    port: randomPort(),
    bytesTransferred: Math.floor(Math.random() * 1000000),
    packetsTransferred: Math.floor(Math.random() * 1000),
    timestamp: randomDate(hourAgo, now),
    duration: Math.floor(Math.random() * 1000),
  }));
}

export function generateMockMetricsTimeSeries(
  hours: number = 24
): NetworkMetrics[] {
  const now = new Date();
  const data: NetworkMetrics[] = [];

  for (let i = 0; i < hours * 60; i++) {
    // Generate data points per minute
    const timestamp = new Date(now.getTime() - i * 60 * 1000).toISOString();

    // Create some periodic patterns in the data
    const timeOfDay = new Date(timestamp).getHours();
    const businessHoursFactor = timeOfDay >= 9 && timeOfDay <= 17 ? 1.5 : 1;
    const periodicFactor = Math.sin((i / 60) * Math.PI) * 0.3 + 1;

    data.push({
      timestamp,
      bandwidth: {
        current: Math.floor(
          Math.random() * 500 * businessHoursFactor * periodicFactor
        ),
        max: Math.floor(
          Math.random() * 500 * businessHoursFactor * periodicFactor
        ),
        unit: "Mbps",
        utilization: Math.floor(Math.random() * 100),
      },
      latency: {
        min: Math.floor(Math.random() * 10),
        max: Math.floor(Math.random() * 50) + 50,
        current: Math.floor(Math.random() * 30) + 20,
        unit: "ms",
      },
      packetLoss: {
        current: Number((Math.random() * 2).toFixed(2)),
        threshold: 2.0, // Added threshold property instead of total
        unit: "%",
      },
      errors: {
        crc: Math.floor(Math.random() * 100),
        fragments: Math.floor(Math.random() * 50),
        collisions: Math.floor(Math.random() * 25),
      },
    });
  }

  return data;
}

// Generate aggregated statistics
export function generateNetworkStats(metrics: NetworkMetrics[]) {
  return {
    bandwidth: {
      peak: Math.max(...metrics.map((m) => m.bandwidth.current)),
      average: Number(
        (
          metrics.reduce((acc, m) => acc + m.bandwidth.current, 0) /
          metrics.length
        ).toFixed(2)
      ),
      current: metrics[0].bandwidth.current,
      unit: "Mbps",
    },
    latency: {
      min: Math.min(...metrics.map((m) => m.latency.min)),
      max: Math.max(...metrics.map((m) => m.latency.max)),
      average: Number(
        (
          metrics.reduce((acc, m) => acc + m.latency.current, 0) /
          metrics.length
        ).toFixed(2)
      ),
      unit: "ms",
    },
    packetLoss: {
      average: Number(
        (
          metrics.reduce((acc, m) => acc + m.packetLoss.current, 0) /
          metrics.length
        ).toFixed(2)
      ),
      threshold: metrics[0].packetLoss.threshold,
      unit: "%",
    },
    errors: {
      total: metrics.reduce(
        (acc, m) =>
          acc + m.errors.crc + m.errors.fragments + m.errors.collisions,
        0
      ),
      breakdown: {
        crc: metrics.reduce((acc, m) => acc + m.errors.crc, 0),
        fragments: metrics.reduce((acc, m) => acc + m.errors.fragments, 0),
        collisions: metrics.reduce((acc, m) => acc + m.errors.collisions, 0),
      },
    },
  };
}

// Add helper functions at the top
function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Define constants
const ERROR_TYPES = ["CRC", "Fragment", "Collision"] as const;
type ErrorType = (typeof ERROR_TYPES)[number];

const SEVERITY_LEVELS = ["low", "medium", "high"] as const;
type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

const PROTOCOLS = ["HTTP", "HTTPS", "TCP", "UDP", "ICMP"] as const;
type Protocol = (typeof PROTOCOLS)[number];

export interface ErrorData {
  deviceId: string;
  timestamp: string;
  type: ErrorType;
  severity: SeverityLevel;
  count: number;
}

function generateErrorData(count: number, devices: Device[]): ErrorData[] {
  const now = new Date();

  return Array.from({ length: count }, (_, i) => ({
    type: randomChoice(ERROR_TYPES),
    severity: randomChoice(SEVERITY_LEVELS),
    count: Math.floor(Math.random() * 100),
    deviceId: randomChoice(devices).id,
    timestamp: new Date(now.getTime() - i * 300000).toISOString(), // Every 5 minutes
  }));
}

// Helper function for mock bandwidth
function generateMockBandwidth(
  hours: number,
  devices: NetworkDevice[]
): BandwidthData[] {
  const now = new Date();
  const data: BandwidthData[] = [];

  devices.forEach((device) => {
    for (let i = 0; i < hours; i++) {
      const hour = new Date(now.getTime() - i * 3600000).getHours();
      const businessHoursFactor = hour >= 9 && hour <= 17 ? 1.5 : 0.5;

      data.push({
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        inbound: Math.floor(Math.random() * 1000 * businessHoursFactor),
        outbound: Math.floor(Math.random() * 1000 * businessHoursFactor),
        deviceId: device.id,
        total: Math.floor(Math.random() * 1000 * businessHoursFactor),
      });
    }
  });

  return data;
}

// Add QueryConfig type to match Dashboard and QueryBuilder
export interface QueryConfig {
  query: {
    id: string;
    metrics: string[];
    timeRange: string;
    filters: string[];
    groupBy: string[];
  };
  visualization: "line" | "bar" | "pie";
  timeRange: string;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
}

export interface QueryResult {
  visualization: "line" | "bar" | "pie";
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      fill?: boolean;
    }>;
  };
}

// Update simulateQueryResults to use the QueryResult type
export async function simulateQueryResults(
  config: QueryConfig,
  networkData: NetworkData
): Promise<QueryResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const timeLabels = generateTimeSeriesData(24).map((timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Process data based on query type
  let datasets: Dataset[] = [];

  switch (config.query.id) {
    case "bandwidth_usage":
      datasets = config.query.metrics.map((metric) => ({
        label:
          metric === "total"
            ? "Total Bandwidth"
            : `${metric.charAt(0).toUpperCase() + metric.slice(1)} Traffic`,
        data: networkData.metrics
          .slice(-24)
          .map((m) =>
            metric === "total"
              ? m.bandwidth.inbound + m.bandwidth.outbound
              : m.bandwidth[metric as "inbound" | "outbound"]
          ),
        borderColor: generateColor(),
        fill: false,
      }));
      break;

    case "network_errors":
      datasets = [
        {
          label: "Error Count",
          data: networkData.errors.slice(-24).map((e) => e.count),
          backgroundColor: networkData.errors
            .slice(-24)
            .map((e) =>
              e.severity === "high"
                ? "#ef4444"
                : e.severity === "medium"
                ? "#f59e0b"
                : "#10b981"
            ),
        },
      ];
      break;

    // Add more cases as needed
    default:
      datasets = [
        {
          label: "Default Data",
          data: Array(24)
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

// Helper functions
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateTimeSeriesData = (hours: number): string[] => {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    return date.toISOString();
  }).reverse();
};

const generateColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

// Update the function to use the BandwidthData type
function generateBandwidthData(hours: number): BandwidthData[] {
  return Array.from({ length: hours }, (_, i) => {
    const inbound = generateRandomNumber(100, 1000);
    const outbound = generateRandomNumber(100, 1000);
    return {
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      inbound,
      outbound,
      total: inbound + outbound,
    };
  }).reverse();
}

function generateTrafficData(device: Device, timestamp: string): TrafficData {
  const hour = new Date(timestamp).getHours();
  const businessHoursFactor = hour >= 9 && hour <= 17 ? 1.5 : 1.0;

  return {
    deviceId: device.id,
    timestamp,
    protocol: randomChoice(PROTOCOLS),
    bytes: Math.floor(Math.random() * 1000 * businessHoursFactor),
    packets: generateRandomNumber(100, 1000),
    flows: generateRandomNumber(10, 100),
  };
}
