"use client";

import "./registry";
import { Doughnut } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

const DEFAULT_COLORS = ["#22D3EE", "#7C3AED", "#3b82f6", "#34d399", "#f59e0b", "#ec4899"];

export function TrafficSourcesChart({
  labels,
  values,
  colors = DEFAULT_COLORS,
}: {
  labels: string[];
  values: number[];
  colors?: string[];
}) {
  const { textColor, fontFamily } = useChartTheme();

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 10, padding: 12, color: textColor, font: { family: fontFamily, size: 11 } },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
