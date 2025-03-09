"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartData {
  time: string;
  inbound: number;
  outbound: number;
  total: number;
}

interface LineChartProps {
  data: LineChartData[];
}

export function LineChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.map((d) => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: "Inbound",
        data: data.map((d) => d.inbound),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Outbound",
        data: data.map((d) => d.outbound),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Total",
        data: data.map((d) => d.total),
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Traffic (Mbps)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
