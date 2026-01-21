import { motion } from "framer-motion";
import { Wind, Sun, CloudRain, Thermometer, TrendingDown, TrendingUp, Minus } from "lucide-react";

type ConditionLevel = "low" | "normal" | "high";

interface WeatherIndicator {
  label: string;
  icon: React.ElementType;
  level: ConditionLevel;
  value: string;
  vsNormal: "below" | "normal" | "above";
}

const weatherIndicators: WeatherIndicator[] = [
  {
    label: "Wind",
    icon: Wind,
    level: "low",
    value: "Low",
    vsNormal: "below",
  },
  {
    label: "Solar",
    icon: Sun,
    level: "normal",
    value: "Moderate",
    vsNormal: "normal",
  },
  {
    label: "Temperature",
    icon: Thermometer,
    level: "high",
    value: "Above avg",
    vsNormal: "above",
  },
];

const levelStyles: Record<ConditionLevel, string> = {
  low: "bg-warning-soft text-warning-foreground border-warning/20",
  normal: "bg-muted text-muted-foreground border-border",
  high: "bg-anomaly-soft text-anomaly-foreground border-anomaly/20",
};

const trendIcons: Record<"below" | "normal" | "above", React.ElementType> = {
  below: TrendingDown,
  normal: Minus,
  above: TrendingUp,
};

export function WeatherContext() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-card border border-border rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-foreground">Weather Conditions</h3>
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Context
        </span>
      </div>
      
      <div className="space-y-2">
        {weatherIndicators.map((indicator) => {
          const Icon = indicator.icon;
          const TrendIcon = trendIcons[indicator.vsNormal];
          
          return (
            <div
              key={indicator.label}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border ${levelStyles[indicator.level]}`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{indicator.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{indicator.value}</span>
                <div className="flex items-center gap-0.5 text-[10px] opacity-70">
                  <TrendIcon className="w-3 h-3" />
                  <span>vs normal</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Seasonal context note */}
      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <CloudRain className="w-3 h-3 inline mr-1" />
          Low wind output contributing to higher thermal generation and elevated prices.
        </p>
      </div>
    </motion.div>
  );
}
