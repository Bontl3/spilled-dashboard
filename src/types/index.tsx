export interface NetworkData {
  timeSeriesData: TimeSeriesPoint[];
  groupedData?: Record<string, any>[];
  summary?: {
    totalCount?: number;
    avgLatency?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  latency?: number;
  packetLoss?: number;
  [key: string]: any;
}

export interface QueryParams {
  dataSource: string;
  visualizeFields: string[];
  whereConditions: string[];
  groupBy?: string;
  orderBy?: string;
  limit: number;
  timeRange?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ElementType;
}

export interface TableColumn {
  header: string;
  accessor: string;
}
