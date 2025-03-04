"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeSeriesPoint } from "@/types";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  dataKey?: string;
  xAxisKey?: string;
}

export default function TimeSeriesChart({
  data,
  dataKey = "value",
  xAxisKey = "time",
}: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={(time) => {
              if (typeof time === "string") {
                return new Date(time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }
              return time;
            }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [value, dataKey]}
            labelFormatter={(label) => {
              if (typeof label === "string") {
                return new Date(label).toLocaleString();
              }
              return label;
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#16a34a"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
