import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";

type StressLevel = "low" | "below" | "normal" | "above" | "high";

interface RegionData {
  id: string;
  name: string;
  stress: StressLevel;
  value: number; // -100 to +100 scale
}

const regionData: RegionData[] = [
  { id: "NO", name: "Norway", stress: "low", value: -45 },
  { id: "SE", name: "Sweden", stress: "below", value: -25 },
  { id: "FI", name: "Finland", stress: "normal", value: 5 },
  { id: "DK", name: "Denmark", stress: "above", value: 35 },
  { id: "DE", name: "Germany", stress: "high", value: 65 },
  { id: "NL", name: "Netherlands", stress: "above", value: 40 },
  { id: "BE", name: "Belgium", stress: "above", value: 30 },
  { id: "FR", name: "France", stress: "normal", value: 10 },
  { id: "GB", name: "UK", stress: "below", value: -15 },
  { id: "PL", name: "Poland", stress: "high", value: 55 },
  { id: "CZ", name: "Czechia", stress: "above", value: 25 },
  { id: "AT", name: "Austria", stress: "normal", value: 0 },
  { id: "CH", name: "Switzerland", stress: "below", value: -20 },
  { id: "IT", name: "Italy", stress: "normal", value: 15 },
  { id: "ES", name: "Spain", stress: "low", value: -40 },
  { id: "PT", name: "Portugal", stress: "low", value: -50 },
];

const stressColors: Record<StressLevel, string> = {
  low: "hsl(var(--chart-load))",
  below: "hsl(180 40% 60%)",
  normal: "hsl(var(--muted))",
  above: "hsl(var(--warning))",
  high: "hsl(var(--anomaly))",
};

const stressLabels: Record<StressLevel, string> = {
  low: "Well below normal",
  below: "Below normal",
  normal: "Normal",
  above: "Above normal",
  high: "High stress",
};

// Simplified Europe paths (stylized for dashboard use)
const europePaths: Record<string, string> = {
  NO: "M 145 20 L 160 15 L 175 25 L 170 60 L 155 80 L 145 70 L 140 45 Z",
  SE: "M 170 60 L 185 55 L 195 75 L 190 110 L 175 120 L 165 100 L 155 80 Z",
  FI: "M 195 35 L 215 30 L 225 50 L 220 85 L 200 95 L 190 75 Z",
  DK: "M 155 100 L 165 95 L 175 105 L 170 120 L 155 115 Z",
  DE: "M 155 120 L 180 115 L 190 130 L 185 160 L 160 165 L 145 150 Z",
  NL: "M 140 115 L 155 110 L 160 125 L 150 135 L 135 130 Z",
  BE: "M 135 135 L 150 130 L 155 145 L 145 155 L 130 150 Z",
  GB: "M 95 95 L 120 90 L 130 110 L 125 140 L 105 150 L 90 130 Z",
  FR: "M 100 155 L 140 145 L 155 165 L 145 200 L 110 210 L 90 185 Z",
  PL: "M 190 115 L 225 110 L 235 140 L 220 165 L 190 160 L 185 135 Z",
  CZ: "M 175 145 L 200 140 L 205 160 L 190 170 L 170 165 Z",
  AT: "M 165 170 L 195 165 L 200 185 L 175 195 L 160 185 Z",
  CH: "M 145 175 L 165 170 L 170 190 L 155 200 L 140 190 Z",
  IT: "M 160 200 L 180 190 L 200 220 L 185 270 L 165 265 L 155 230 Z",
  ES: "M 60 200 L 105 195 L 115 240 L 95 275 L 55 270 L 45 235 Z",
  PT: "M 40 215 L 55 210 L 60 250 L 50 270 L 35 260 Z",
};

export function SystemStressMap() {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            System Stress Map
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Context
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Residual load vs seasonal normal
        </span>
      </div>

      <div className="relative">
        {/* SVG Map */}
        <svg
          viewBox="0 0 280 290"
          className="w-full h-auto max-h-[280px]"
          style={{ background: "hsl(var(--background))" }}
        >
          {/* Ocean background */}
          <rect
            x="0"
            y="0"
            width="280"
            height="290"
            fill="hsl(200 30% 95%)"
            rx="8"
          />
          
          {/* Country paths */}
          {regionData.map((region) => (
            <path
              key={region.id}
              d={europePaths[region.id]}
              fill={stressColors[region.stress]}
              stroke="hsl(var(--background))"
              strokeWidth="1.5"
              className="transition-all duration-150 cursor-pointer"
              style={{
                opacity: hoveredRegion && hoveredRegion.id !== region.id ? 0.4 : 1,
                filter: hoveredRegion?.id === region.id ? "brightness(1.1)" : "none",
              }}
              onMouseEnter={() => setHoveredRegion(region)}
              onMouseLeave={() => setHoveredRegion(null)}
            />
          ))}

          {/* Country labels for key regions */}
          <text x="150" y="55" className="text-[8px] fill-foreground font-medium pointer-events-none">NO</text>
          <text x="175" y="90" className="text-[8px] fill-foreground font-medium pointer-events-none">SE</text>
          <text x="205" y="65" className="text-[8px] fill-foreground font-medium pointer-events-none">FI</text>
          <text x="165" y="145" className="text-[8px] fill-foreground font-medium pointer-events-none">DE</text>
          <text x="120" y="180" className="text-[8px] fill-foreground font-medium pointer-events-none">FR</text>
          <text x="205" y="140" className="text-[8px] fill-foreground font-medium pointer-events-none">PL</text>
          <text x="110" y="120" className="text-[8px] fill-foreground font-medium pointer-events-none">UK</text>
          <text x="75" y="240" className="text-[8px] fill-foreground font-medium pointer-events-none">ES</text>
          <text x="175" y="235" className="text-[8px] fill-foreground font-medium pointer-events-none">IT</text>
        </svg>

        {/* Hover tooltip */}
        {hoveredRegion && (
          <div className="absolute top-2 right-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-foreground">{hoveredRegion.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {stressLabels[hoveredRegion.stress]}
            </p>
            <p className="text-[10px] font-mono mt-1">
              <span className={hoveredRegion.value >= 0 ? "text-anomaly" : "text-success"}>
                {hoveredRegion.value >= 0 ? "+" : ""}{hoveredRegion.value}%
              </span>
              {" "}vs normal
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {(["low", "below", "normal", "above", "high"] as StressLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-1">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: stressColors[level] }}
            />
            {level === "low" && (
              <span className="text-[9px] text-muted-foreground mr-2">Below</span>
            )}
            {level === "normal" && (
              <span className="text-[9px] text-muted-foreground mx-1">Normal</span>
            )}
            {level === "high" && (
              <span className="text-[9px] text-muted-foreground ml-1">Above</span>
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
        <Info className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="text-[10px] text-muted-foreground">
          Indicative stress levels for spatial context. Germany and Poland show elevated residual load.
        </span>
      </div>
    </motion.div>
  );
}
