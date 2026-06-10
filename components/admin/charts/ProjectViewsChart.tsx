"use client";

import "./registry";
import { Bar } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

export function ProjectViewsChart({ labels, values }: { labels: string[]; values: number[] }) {
  const { textColor, gridColor, fontFamily } = useChartTheme();

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: values,
        backgroundColor: [
          "rgba(34,211,238,0.75)",
          "rgba(124,58,237,0.7)",
          "rgba(59,130,246,0.7)",
          "rgba(52,211,153,0.7)",
          "rgba(236,72,153,0.7)",
          "rgba(251,191,36,0.7)",
        ],
        borderRadius: 6,
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { family: fontFamily, size: 11 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: fontFamily, size: 11 } } },
    },
  };

  return <Bar data={data} options={options} />;
}
