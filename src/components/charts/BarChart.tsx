"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Value",
        data: data.map((d) => d.value),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  );
}
