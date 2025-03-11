// src/types/recharts.d.ts
declare module "recharts" {
  import React from "react";

  // General container components
  export const ResponsiveContainer: React.FC<any>;
  export const Surface: React.FC<any>;
  export const Layer: React.FC<any>;

  // Chart components
  export const LineChart: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const PieChart: React.FC<any>;
  export const AreaChart: React.FC<any>;
  export const RadarChart: React.FC<any>;
  export const ScatterChart: React.FC<any>;
  export const ComposedChart: React.FC<any>;
  export const TreeMap: React.FC<any>;
  export const Sankey: React.FC<any>;
  export const RadialBarChart: React.FC<any>;
  export const FunnelChart: React.FC<any>;

  // Series components
  export const Line: React.FC<any>;
  export const Bar: React.FC<any>;
  export const Area: React.FC<any>;
  export const Radar: React.FC<any>;
  export const Scatter: React.FC<any>;
  export const Pie: React.FC<any>;
  export const RadialBar: React.FC<any>;
  export const Funnel: React.FC<any>;

  // Axis and grid components
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const ZAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const PolarGrid: React.FC<any>;
  export const RadialGrid: React.FC<any>;
  export const PolarAngleAxis: React.FC<any>;
  export const PolarRadiusAxis: React.FC<any>;

  // Graphics components
  export const Rectangle: React.FC<any>;
  export const Dot: React.FC<any>;
  export const Cross: React.FC<any>;
  export const Curve: React.FC<any>;
  export const Polygon: React.FC<any>;
  export const Sector: React.FC<any>;

  // Utility components
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
  export const Label: React.FC<any>;
  export const LabelList: React.FC<any>;
  export const Brush: React.FC<any>;
  export const ReferenceArea: React.FC<any>;
  export const ReferenceDot: React.FC<any>;
  export const ReferenceLine: React.FC<any>;
  export const ErrorBar: React.FC<any>;
  export const Cell: React.FC<any>;
  export const Text: React.FC<any>;

  // Animation components
  export const Animate: React.FC<any>;
  export const AnimationTiming: React.FC<any>;

  // Common types used by recharts
  export type TooltipPayload = {
    name: string;
    value: any;
    unit?: string;
    color?: string;
    fill?: string;
    dataKey?: string | number;
    payload?: any;
  };

  export interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: any;
    content?: React.ReactNode | ((props: any) => React.ReactNode);
    viewBox?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    coordinate?: {
      x: number;
      y: number;
    };
    position?: {
      x: number;
      y: number;
    };
  }

  // Common helper types and interfaces
  export type CurveType =
    | "basis"
    | "basisClosed"
    | "basisOpen"
    | "linear"
    | "linearClosed"
    | "natural"
    | "monotoneX"
    | "monotoneY"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";

  export type LayoutType = "horizontal" | "vertical";

  // Utility functions
  export function getValueByDataKey(
    obj: any,
    dataKey: string | number | ((obj: any) => any)
  ): any;
}
