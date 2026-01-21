import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useHighlight, HighlightTarget } from "@/contexts/HighlightContext";

interface MetricRow {
  label: string;
  value: string;
  change: string | null;
  trend: "up" | "down" | "neutral";
  highlightTarget?: HighlightTarget;
}

const metrics: MetricRow[] = [
  { 
    label: "Average price (24h)", 
    value: "98 €/MWh", 
    change: "+12%",
    trend: "up",
    highlightTarget: "price",
  },
  { 
    label: "Peak price", 
    value: "142 €/MWh", 
    change: "+45%",
    trend: "up",
    highlightTarget: "price",
  },
  { 
    label: "Price change vs baseline", 
    value: "+64 €/MWh", 
    change: null,
    trend: "up",
    highlightTarget: "price",
  },
  { 
    label: "Volatility ratio", 
    value: "2.1×", 
    change: "+110%",
    trend: "up",
    highlightTarget: "volatility",
  },
  { 
    label: "Strongest driver correlation", 
    value: "Residual load (0.58)", 
    change: null,
    trend: "neutral",
    highlightTarget: "driver",
  },
];

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: "text-anomaly",
  down: "text-success",
  neutral: "text-muted-foreground",
};

export function KeyMetricsTable() {
  const { setActiveHighlight } = useHighlight();

  const handleInteraction = (target: HighlightTarget | undefined, active: boolean) => {
    setActiveHighlight(active && target ? target : null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="chart-container"
    >
      <h3 className="text-base font-semibold text-foreground mb-1">
        Key Numbers
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Summary metrics for the analysis period
      </p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th className="text-right">Value</th>
            <th className="text-right w-24">Change</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => {
            const TrendIcon = trendIcons[metric.trend];
            return (
              <tr 
                key={index}
                className="cursor-pointer transition-colors duration-150 hover:bg-muted/50"
                onMouseEnter={() => handleInteraction(metric.highlightTarget, true)}
                onMouseLeave={() => handleInteraction(metric.highlightTarget, false)}
                onTouchStart={() => handleInteraction(metric.highlightTarget, true)}
                onTouchEnd={() => handleInteraction(metric.highlightTarget, false)}
              >
                <td className="text-foreground">{metric.label}</td>
                <td className="text-right font-medium text-foreground">
                  {metric.value}
                </td>
                <td className="text-right">
                  {metric.change ? (
                    <span className={`inline-flex items-center gap-1 ${trendColors[metric.trend]}`}>
                      <TrendIcon className="w-3.5 h-3.5" />
                      {metric.change}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
