export interface LineChartData {
  time: string;
  inbound: number;
  outbound: number;
  total: number;
}

export interface BarChartData {
  label: string;
  value: number;
}

export interface PieChartData {
  type: string;
  value: number;
}

export interface ChartProps {
  data: any; // Type will be specific to each chart
}
