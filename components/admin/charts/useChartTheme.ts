"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

export function useChartTheme() {
  const { theme } = useTheme();
  const [vars, setVars] = useState({ text: "#9AA3B2", font: "monospace" });

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVars({
      text: cs.getPropertyValue("--text-dim").trim() || "#9AA3B2",
      font: cs.getPropertyValue("--font-jetbrains-mono").trim() || "monospace",
    });
  }, [theme]);

  const gridColor = theme === "light" ? "rgba(10,12,18,0.06)" : "rgba(255,255,255,0.04)";

  return { textColor: vars.text, gridColor, fontFamily: vars.font, theme };
}
