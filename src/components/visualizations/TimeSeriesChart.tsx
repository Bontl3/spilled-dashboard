// src/components/visualizations/TimeSeriesChart.tsx
"use client";

import React from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { TimeSeriesPoint } from "@/types";

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

  // We'll use a client-side only approach with useEffect and refs
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = React.useState(false);

  React.useEffect(() => {
    // This code only runs on the client
    const renderChart = async () => {
      if (chartRef.current && !chartRendered) {
        // Dynamically import recharts only on the client side
        const {
          LineChart,
          Line,
          XAxis,
          YAxis,
          CartesianGrid,
          Tooltip,
          Legend,
          ResponsiveContainer,
        } = await import("recharts");

        // Format the data
        const formattedData = data.map((point) => ({
          ...point,
          formattedTime:
            typeof point.time === "string"
              ? new Date(point.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : point.time,
        }));

        // Use React.createElement to create the chart instead of JSX
        // This avoids TypeScript issues with the recharts components
        const CustomTooltip = (props: any) => {
          const { active, payload, label } = props;
          if (active && payload && payload.length) {
            return React.createElement(
              "div",
              {
                className:
                  "bg-white p-3 border border-gray-200 shadow-md rounded-md",
              },
              [
                React.createElement(
                  "p",
                  { className: "text-xs text-gray-500 mb-1", key: "label" },
                  typeof label === "string" ? formatDateTime(label) : label
                ),
                ...payload.map((entry: any, index: number) =>
                  React.createElement(
                    "div",
                    {
                      key: `tooltip-${index}`,
                      className: "flex items-center space-x-2",
                    },
                    [
                      React.createElement("div", {
                        key: "color",
                        className: "w-3 h-3 rounded-full",
                        style: { backgroundColor: entry.color },
                      }),
                      React.createElement(
                        "p",
                        { key: "value", className: "text-sm font-medium" },
                        [
                          React.createElement(
                            "span",
                            { key: "name", className: "text-gray-700" },
                            `${entry.name}: `
                          ),
                          React.createElement(
                            "span",
                            { key: "val", className: "font-bold" },
                            entry.value
                          ),
                        ]
                      ),
                    ]
                  )
                ),
              ]
            );
          }
          return null;
        };

        // Ensure chartRef.current is still available
        if (chartRef.current) {
          const chart = React.createElement(
            ResponsiveContainer,
            { width: "100%", height: "100%" },
            React.createElement(
              LineChart,
              {
                data: formattedData,
                margin: { top: 5, right: 30, left: 20, bottom: 5 },
              },
              [
                React.createElement(CartesianGrid, {
                  key: "grid",
                  strokeDasharray: "3 3",
                  stroke: "#E5E7EB",
                }),
                React.createElement(XAxis, {
                  key: "xaxis",
                  dataKey: "formattedTime",
                  axisLine: { stroke: "#D1D5DB" },
                  tickLine: { stroke: "#D1D5DB" },
                  tick: { fill: "#6B7280", fontSize: 12 },
                }),
                React.createElement(YAxis, {
                  key: "yaxis",
                  axisLine: { stroke: "#D1D5DB" },
                  tickLine: { stroke: "#D1D5DB" },
                  tick: { fill: "#6B7280", fontSize: 12 },
                }),
                React.createElement(Tooltip, {
                  key: "tooltip",
                  content: CustomTooltip,
                }),
                React.createElement(Legend, { key: "legend" }),
                React.createElement(Line, {
                  key: "line1",
                  type: "monotone",
                  dataKey: dataKey,
                  stroke: "#166534",
                  strokeWidth: 2,
                  dot: { stroke: "#166534", strokeWidth: 2, r: 4 },
                  activeDot: { r: 6, stroke: "#166534", strokeWidth: 2 },
                  name: dataKey,
                }),
                formattedData[0]?.latency &&
                  React.createElement(Line, {
                    key: "line2",
                    type: "monotone",
                    dataKey: "latency",
                    stroke: "#4F46E5",
                    strokeWidth: 2,
                    dot: { stroke: "#4F46E5", strokeWidth: 2, r: 4 },
                    activeDot: { r: 6, stroke: "#4F46E5", strokeWidth: 2 },
                    name: "Latency (ms)",
                  }),
              ].filter(Boolean)
            )
          );

          // Use React DOM to render the chart
          const { createRoot } = await import("react-dom/client");
          const root = createRoot(chartRef.current);
          root.render(chart);
          setChartRendered(true);
        }
      }
    };

    renderChart();

    // Cleanup function
    return () => {
      if (chartRef.current && chartRendered) {
        // Clear the chart container when component unmounts
        chartRef.current.innerHTML = "";
        setChartRendered(false);
      }
    };
  }, [data, dataKey, chartRendered]);

  return (
    <div className={className}>
      {title && (
        <h3 className="text-base font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div style={{ height }} ref={chartRef}></div>
    </div>
  );
}
