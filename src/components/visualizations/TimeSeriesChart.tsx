// src/components/visualizations/TimeSeriesChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeSeriesPoint } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  dataKey?: string;
  xAxisKey?: string;
  className?: string;
  title?: string;
  height?: number;
}

export default function TimeSeriesChart({
  data,
  dataKey = "value",
  xAxisKey = "time",
  className,
  title,
  height = 300,
}: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-gray-500",
          className
        )}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-xs text-gray-500 mb-1">
            {typeof label === "string" ? formatDateTime(label) : label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={`tooltip-${index}`}
              className="flex items-center space-x-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm font-medium">
                <span className="text-gray-700">{entry.name}:</span>{" "}
                <span className="font-bold">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="text-base font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={xAxisKey}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(time) => {
                if (typeof time === "string") {
                  const date = new Date(time);
                  return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                return time;
              }}
            />
            <YAxis
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#166534"
              strokeWidth={2}
              dot={{ stroke: "#166534", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#166534", strokeWidth: 2 }}
              name={dataKey}
            />
            {data[0]?.latency && (
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ stroke: "#4F46E5", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#4F46E5", strokeWidth: 2 }}
                name="Latency (ms)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
