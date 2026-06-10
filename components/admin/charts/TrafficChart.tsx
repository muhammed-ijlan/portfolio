"use client";

import "./registry";
import { Line } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

export function TrafficChart({ days, views, visitors }: { days: string[]; views: number[]; visitors: number[] }) {
  const { textColor, gridColor, fontFamily } = useChartTheme();

  const data = {
    labels: days,
    datasets: [
      {
        label: "Page views",
        data: views,
        borderColor: "#22D3EE",
        backgroundColor: "rgba(34,211,238,0.09)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Unique visitors",
        data: visitors,
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124,58,237,0.07)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { boxWidth: 10, padding: 16, color: textColor, font: { family: fontFamily, size: 11 } },
      },
      tooltip: { titleFont: { family: fontFamily, size: 11 }, bodyFont: { family: fontFamily, size: 11 } },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { maxTicksLimit: 8, color: textColor, font: { family: fontFamily, size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: fontFamily, size: 11 } },
      },
    },
  };

  return <Line data={data} options={options} />;
}
