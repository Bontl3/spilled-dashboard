// src/lib/mockData/generators.ts
import {
  Device,
  NetworkData,
  MetricData,
  ErrorData,
  TrafficData,
  Protocol,
  ErrorType,
  SeverityLevel,
  Alert,
  NetworkDevice,
  BandwidthData,
} from "@/types";

// Helper functions
function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateTimeSeriesData = (hours: number): string[] => {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    return date.toISOString();
  }).reverse();
};

const generateRandomIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");

// Generate base network data
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
          type: ["CRC", "Fragment", "Collision"][
            generateRandomNumber(0, 2)
          ] as ErrorType,
          severity: ["low", "medium", "high"][
            generateRandomNumber(0, 2)
          ] as SeverityLevel,
          count: generateRandomNumber(1, 10),
        });
      }

      // Generate traffic
      traffic.push(generateTrafficData(device, timestamp));
    });
  });

  return { devices, metrics, errors, traffic };
}

// Generate traffic data
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

// Generate alert data
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

// Generate mock device data
export function generateMockDeviceData(count: number = 10) {
  const deviceTypes = [
    "router",
    "switch",
    "server",
    "firewall",
    "access point",
  ];
  const statuses = ["Online", "Offline", "Maintenance"];

  return Array.from({ length: count }, (_, i) => {
    const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const trafficIn = Math.floor(Math.random() * 10000000);
    const trafficOut = Math.floor(Math.random() * 10000000);

    return {
      id: `device-${i + 1}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${i + 1}`,
      type: type,
      ip: generateRandomIP(),
      status: status,
      lastSeen: new Date().toISOString(),
      trafficIn,
      trafficOut,
      location: `Datacenter ${Math.floor(Math.random() * 3) + 1}`,
      uptime: `${Math.floor(Math.random() * 30) + 1}d ${Math.floor(
        Math.random() * 24
      )}h`,
    };
  });
}
