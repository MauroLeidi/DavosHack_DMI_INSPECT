import { useMemo } from "react";
import { SeverityLevel } from "./InsightCard";

interface SparklineChartProps {
  data: number[];
  type?: "line" | "area";
  severity?: SeverityLevel;
  width?: number;
  height?: number;
}

const colorMap: Record<SeverityLevel, { stroke: string; fill: string }> = {
  high: { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.1)" },
  medium: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)" },
  low: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.1)" },
};

export function SparklineChart({ 
  data, 
  type = "line", 
  severity = "low",
  width = 200,
  height = 48,
}: SparklineChartProps) {
  const { path, areaPath } = useMemo(() => {
    if (data.length === 0) return { path: "", areaPath: "" };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return { x, y };
    });
    
    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    
    const area = `${linePath} L ${width} ${height} L 0 ${height} Z`;
    
    return { path: linePath, areaPath: area };
  }, [data, width, height]);

  const colors = colorMap[severity];
  
  // Find the peak point for highlighting
  const maxIndex = data.indexOf(Math.max(...data));
  const maxX = (maxIndex / (data.length - 1)) * width;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const maxY = height - ((max - min) / range) * (height - 8) - 4;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {type === "area" && (
        <path
          d={areaPath}
          fill={colors.fill}
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight peak */}
      <circle
        cx={maxX}
        cy={maxY}
        r={3}
        fill={colors.stroke}
      />
    </svg>
  );
}
