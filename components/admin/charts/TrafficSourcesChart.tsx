"use client";

import "./registry";
import { Doughnut } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

const LABELS = ["Direct", "LinkedIn", "GitHub", "Google"];
const VALUES = [38, 29, 19, 14];
const COLORS = ["#22D3EE", "#7C3AED", "#3b82f6", "#34d399"];

export function TrafficSourcesChart() {
  const { textColor, fontFamily } = useChartTheme();

  const data = {
    labels: LABELS,
    datasets: [
      {
        data: VALUES,
        backgroundColor: COLORS,
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
