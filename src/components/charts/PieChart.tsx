"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((d) => d.type),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  return (
    <Pie
      data={chartData}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  );
}
