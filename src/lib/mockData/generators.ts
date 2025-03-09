// /src/lib/mockData/generators.ts
import {
  Device,
  NetworkData,
  MetricData,
  ErrorData,
  TrafficData,
  BandwidthData,
  NetworkDevice,
  TrafficFlow,
  NetworkMetrics,
  Protocol,
  ErrorType,
  SeverityLevel,
} from "@/types/network";

// Helper functions
function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const generateRandomId = () => Math.random().toString(36).substring(2, 9);

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

// Mock Data Generators
const generateRandomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

const generateRandomBandwidth = () =>
  `${Math.floor(Math.random() * 10)}${Math.random() > 0.5 ? "Gbps" : "Mbps"}`;

const randomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

const randomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024);

const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

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
          type: randomChoice(["CRC", "Fragment", "Collision"] as ErrorType[]),
          severity: randomChoice(["low", "medium", "high"] as SeverityLevel[]),
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
  if (!metrics || metrics.length === 0) {
    return {
      bandwidth: { peak: 0, average: 0, current: 0, unit: "Mbps" },
      latency: { min: 0, max: 0, average: 0, unit: "ms" },
      packetLoss: { average: 0, threshold: 2.0, unit: "%" },
      errors: { total: 0, breakdown: { crc: 0, fragments: 0, collisions: 0 } },
    };
  }

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

function generateErrorData(count: number, devices: Device[]): ErrorData[] {
  if (!devices || devices.length === 0) {
    return [];
  }

  const now = new Date();

  return Array.from({ length: count }, (_, i) => ({
    type: randomChoice(["CRC", "Fragment", "Collision"] as ErrorType[]),
    severity: randomChoice(["low", "medium", "high"] as SeverityLevel[]),
    count: Math.floor(Math.random() * 100),
    deviceId: randomChoice(devices).id,
    timestamp: new Date(now.getTime() - i * 300000).toISOString(), // Every 5 minutes
  }));
}

// Helper function for mock bandwidth
export function generateMockBandwidth(
  hours: number,
  devices: NetworkDevice[]
): BandwidthData[] {
  if (!devices || devices.length === 0) {
    return [];
  }

  const now = new Date();
  const data: BandwidthData[] = [];

  devices.forEach((device) => {
    for (let i = 0; i < hours; i++) {
      const hour = new Date(now.getTime() - i * 3600000).getHours();
      const businessHoursFactor = hour >= 9 && hour <= 17 ? 1.5 : 0.5;

      const inbound = Math.floor(Math.random() * 1000 * businessHoursFactor);
      const outbound = Math.floor(Math.random() * 1000 * businessHoursFactor);

      data.push({
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        inbound,
        outbound,
        total: inbound + outbound,
        deviceId: device.id,
      });
    }
  });

  return data;
}

export function generateBandwidthData(hours: number): BandwidthData[] {
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
  if (!device || !timestamp) {
    throw new Error(
      "Device and timestamp are required for traffic data generation"
    );
  }

  const hour = new Date(timestamp).getHours();
  const businessHoursFactor = hour >= 9 && hour <= 17 ? 1.5 : 1.0;

  return {
    deviceId: device.id,
    timestamp,
    protocol: randomChoice([
      "HTTP",
      "HTTPS",
      "TCP",
      "UDP",
      "ICMP",
    ] as Protocol[]),
    bytes: Math.floor(Math.random() * 1000 * businessHoursFactor),
    packets: generateRandomNumber(100, 1000),
    flows: generateRandomNumber(10, 100),
  };
}
