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

// src/types/index.ts or src/types/queries.ts
export interface QueryParams {
  dataSource: string;
  visualizeFields: string[];
  whereConditions: string[];
  groupBy?: string;
  limit: number;
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
