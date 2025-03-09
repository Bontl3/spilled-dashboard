export type FilterOptionType =
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

export interface FilterOption {
  label: string;
  value: string;
}

export const FILTER_OPTIONS: Record<FilterOptionType, FilterOption[]> = {
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
