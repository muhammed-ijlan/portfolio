"use client";

import "./registry";
import { Line } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

export type LineSeries = { label: string; data: number[]; color: string; fillColor?: string };

export function TrafficChart({ labels, series }: { labels: string[]; series: LineSeries[] }) {
  const { textColor, gridColor, fontFamily } = useChartTheme();

  const data = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.data,
      borderColor: s.color,
      backgroundColor: s.fillColor ?? "transparent",
      fill: !!s.fillColor,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    })),
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
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { precision: 0, color: textColor, font: { family: fontFamily, size: 11 } },
      },
    },
  };

  return <Line data={data} options={options} />;
}
