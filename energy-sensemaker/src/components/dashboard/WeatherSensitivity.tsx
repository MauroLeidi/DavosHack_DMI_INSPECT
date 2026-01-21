import { motion } from "framer-motion";
import { Wind, Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Scenario {
  id: string;
  label: string;
  windDelta: number;
  residualLoad: number;
  residualLoadDelta: number;
  priceImpact: number;
  stressLevel: "low" | "moderate" | "elevated" | "high";
}

const scenarios: Scenario[] = [
  {
    id: "wind-high",
    label: "Wind +20%",
    windDelta: 20,
    residualLoad: 38.2,
    residualLoadDelta: -8.5,
    priceImpact: -18,
    stressLevel: "low",
  },
  {
    id: "baseline",
    label: "Baseline",
    windDelta: 0,
    residualLoad: 46.7,
    residualLoadDelta: 0,
    priceImpact: 0,
    stressLevel: "moderate",
  },
  {
    id: "wind-low",
    label: "Wind −20%",
    windDelta: -20,
    residualLoad: 55.3,
    residualLoadDelta: 8.6,
    priceImpact: 24,
    stressLevel: "high",
  },
];

const stressColors: Record<string, string> = {
  low: "bg-success",
  moderate: "bg-muted-foreground",
  elevated: "bg-warning",
  high: "bg-anomaly",
};

const stressBgColors: Record<string, string> = {
  low: "bg-success/10",
  moderate: "bg-muted/50",
  elevated: "bg-warning/10",
  high: "bg-anomaly/10",
};

export function WeatherSensitivity() {
  const maxResidualLoad = Math.max(...scenarios.map((s) => s.residualLoad));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="chart-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">
            Weather Sensitivity
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            What-If
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Impact of wind forecast deviation
        </span>
      </div>

      {/* Scenario comparison */}
      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const isBaseline = scenario.id === "baseline";
          const barWidth = (scenario.residualLoad / maxResidualLoad) * 100;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`rounded-lg p-3 border transition-all ${
                isBaseline
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-card"
              }`}
            >
              {/* Scenario header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      isBaseline ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {scenario.label}
                  </span>
                  {isBaseline && (
                    <span className="text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      Current forecast
                    </span>
                  )}
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${stressBgColors[scenario.stressLevel]}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${stressColors[scenario.stressLevel]}`}
                  />
                  <span className="capitalize text-foreground">
                    {scenario.stressLevel}
                  </span>
                </div>
              </div>

              {/* Residual load bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Residual Load</span>
                  <span className="font-mono">
                    {scenario.residualLoad.toFixed(1)} GW
                    {scenario.residualLoadDelta !== 0 && (
                      <span
                        className={`ml-1 ${
                          scenario.residualLoadDelta > 0
                            ? "text-anomaly"
                            : "text-success"
                        }`}
                      >
                        ({scenario.residualLoadDelta > 0 ? "+" : ""}
                        {scenario.residualLoadDelta.toFixed(1)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
                    className={`h-full rounded-full ${stressColors[scenario.stressLevel]}`}
                  />
                </div>
              </div>

              {/* Price impact */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Est. Price Impact
                </span>
                <div className="flex items-center gap-1">
                  {scenario.priceImpact > 0 ? (
                    <TrendingUp className="w-3 h-3 text-anomaly" />
                  ) : scenario.priceImpact < 0 ? (
                    <TrendingDown className="w-3 h-3 text-success" />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span
                    className={`text-xs font-mono font-medium ${
                      scenario.priceImpact > 0
                        ? "text-anomaly"
                        : scenario.priceImpact < 0
                          ? "text-success"
                          : "text-muted-foreground"
                    }`}
                  >
                    {scenario.priceImpact > 0 ? "+" : ""}
                    {scenario.priceImpact}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend / explanation */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-start gap-1.5">
          <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Illustrative sensitivity analysis.</strong>{" "}
            Shows how ±20% wind output deviation from forecast would affect system balance. 
            Not a price prediction—actual outcomes depend on multiple factors.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
