// Network entity types
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
  type: ErrorType;
  severity: SeverityLevel;
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

export interface BandwidthData {
  timestamp: string;
  inbound: number;
  outbound: number;
  total: number;
  deviceId?: string;
}

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

// Type aliases
export const ERROR_TYPES = ["CRC", "Fragment", "Collision"] as const;
export type ErrorType = (typeof ERROR_TYPES)[number];

export const SEVERITY_LEVELS = ["low", "medium", "high"] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const PROTOCOLS = ["HTTP", "HTTPS", "TCP", "UDP", "ICMP"] as const;
export type Protocol = (typeof PROTOCOLS)[number];
