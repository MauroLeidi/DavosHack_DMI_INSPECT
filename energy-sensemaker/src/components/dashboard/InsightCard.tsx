import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { SparklineChart } from "./SparklineChart";
import { useHighlight, HighlightTarget } from "@/contexts/HighlightContext";

export type SeverityLevel = "high" | "medium" | "low";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  headline: string;
  detail: string;
  severity: SeverityLevel;
  sparklineData: number[];
  sparklineType?: "line" | "area";
  delay?: number;
  highlightTarget?: HighlightTarget;
}

const severityStyles: Record<SeverityLevel, string> = {
  high: "insight-card insight-card-anomaly",
  medium: "insight-card insight-card-warning",
  low: "insight-card insight-card-success",
};

const badgeStyles: Record<SeverityLevel, string> = {
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const severityLabels: Record<SeverityLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function InsightCard({
  icon: Icon,
  title,
  headline,
  detail,
  severity,
  sparklineData,
  sparklineType = "line",
  delay = 0,
  highlightTarget,
}: InsightCardProps) {
  const { setActiveHighlight } = useHighlight();

  const handleInteraction = (active: boolean) => {
    setActiveHighlight(active && highlightTarget ? highlightTarget : null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${severityStyles[severity]} cursor-pointer transition-all duration-150`}
      onMouseEnter={() => handleInteraction(true)}
      onMouseLeave={() => handleInteraction(false)}
      onTouchStart={() => handleInteraction(true)}
      onTouchEnd={() => handleInteraction(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
        </div>
        <span className={badgeStyles[severity]}>{severityLabels[severity]}</span>
      </div>
      
      <p className="text-lg font-semibold text-foreground mb-1">{headline}</p>
      <p className="text-sm text-muted-foreground mb-4">{detail}</p>
      
      <div className="h-12">
        <SparklineChart 
          data={sparklineData} 
          type={sparklineType}
          severity={severity}
        />
      </div>
    </motion.div>
  );
}
