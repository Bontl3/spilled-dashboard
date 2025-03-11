// src/types/alerts.ts
export interface AlertDetails {
  ipAddress?: string;
  protocol?: string;
  port?: number;
}

export interface Alert {
  id: string;
  message: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string | Date;
  source: string;
  type: string;
  details?: AlertDetails;
  acknowledged?: boolean;
}
