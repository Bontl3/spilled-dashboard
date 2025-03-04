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
}

export interface NetworkData {
  nodes: Node[];
  edges: Edge[];
  metrics: NetworkMetrics;
}

// Mock Data Generators
const generateRandomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

const generateRandomBandwidth = () =>
  `${Math.floor(Math.random() * 10)}${Math.random() > 0.5 ? "Gbps" : "Mbps"}`;

export function generateMockData(
  nodeCount: number = 10,
  edgeCount: number = 15
): NetworkData {
  // Generate nodes
  const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
    const types: Node["type"][] = ["router", "switch", "server", "client"];
    const statuses: Node["status"][] = [
      "active",
      "inactive",
      "warning",
      "error",
    ];

    return {
      id: `node-${i + 1}`,
      label: `${types[i % types.length].toUpperCase()}-${i + 1}`,
      type: types[i % types.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      ipAddress: generateRandomIP(),
      location: `DC-${Math.floor(i / 3) + 1}`,
    };
  });

  // Generate edges
  const edges: Edge[] = Array.from({ length: edgeCount }, (_, i) => {
    const source = nodes[Math.floor(Math.random() * nodes.length)].id;
    const target = nodes[Math.floor(Math.random() * nodes.length)].id;
    const statuses: Edge["status"][] = ["active", "congested", "down"];

    return {
      id: `edge-${i + 1}`,
      source,
      target,
      bandwidth: generateRandomBandwidth(),
      latency: Math.floor(Math.random() * 100),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  });
  // Generate metrics
  const metrics: NetworkMetrics = {
    timestamp: new Date().toISOString(),
    errors: {
      crc: Math.floor(Math.random() * 100),
      fragments: Math.floor(Math.random() * 50),
      collisions: Math.floor(Math.random() * 25),
    },
    bandwidth: {
      current: Math.floor(Math.random() * 800),
      max: 1000,
      unit: "Mbps",
      utilization: Math.random() * 100,
    },
    latency: {
      current: Math.floor(Math.random() * 50),
      min: 5,
      max: 100,
      unit: "ms",
    },
    packetLoss: {
      current: Number((Math.random() * 2).toFixed(2)),
      threshold: 2,
      unit: "%",
    },
  };

  return { nodes, edges, metrics };
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

// Usage example:
export function generateCompleteNetworkData() {
  const devices = generateMockDevices(10);
  const flows = generateMockTrafficFlows(100);
  const metrics = generateMockMetricsTimeSeries(24);
  const stats = generateNetworkStats(metrics);

  return {
    devices,
    flows,
    metrics,
    stats,
  };
}
