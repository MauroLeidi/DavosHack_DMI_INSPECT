import { motion } from "framer-motion";
import { AlertTriangle, Wind, TrendingUp, Clock } from "lucide-react";

const watchItems = [
  {
    icon: Clock,
    title: "Morning peak stress tomorrow",
    description: "Residual load forecast remains elevated for tomorrow morning (07:00-09:00). Monitor for potential price continuation.",
    severity: "warning" as const,
  },
  {
    icon: Wind,
    title: "Wind production uncertainty",
    description: "If wind production underperforms forecasts again, price pressure may persist through the week.",
    severity: "medium" as const,
  },
  {
    icon: TrendingUp,
    title: "Elevated volatility regime",
    description: "Market volatility likely to remain above normal levels (>20%) for the next 48-72 hours based on current conditions.",
    severity: "low" as const,
  },
];

const severityStyles = {
  warning: "border-l-2 border-l-warning bg-warning/5",
  medium: "border-l-2 border-l-warning/60",
  low: "border-l-2 border-l-muted-foreground/40",
};

const iconStyles = {
  warning: "text-warning",
  medium: "text-warning/80",
  low: "text-muted-foreground",
};

export function WatchList() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <h2 className="section-title">What to Watch Next</h2>
      </div>
      
      <div className="grid gap-3">
        {watchItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              className={`watch-card ${severityStyles[item.severity]}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[item.severity]}`} />
              <div>
                <p className="font-medium text-foreground text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
