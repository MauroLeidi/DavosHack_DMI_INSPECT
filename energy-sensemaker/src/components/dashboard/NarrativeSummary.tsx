import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function NarrativeSummary() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">What Happened and Why</h2>
        <span className="ai-label">
          <Sparkles className="w-3 h-3" />
          AI-generated summary
        </span>
      </div>
      
      <div className="narrative-block">
        <p className="text-foreground leading-relaxed mb-4">
          The Swiss day-ahead power market experienced a{" "}
          <strong>significant price spike on January 15th</strong>, with hourly prices 
          reaching <strong>142 €/MWh</strong> during the morning peak hours (07:00–09:00). 
          This represents a deviation of <strong>+64 €/MWh</strong> above the 7-day rolling 
          baseline, triggering a high-severity anomaly detection.
        </p>
        
        <p className="text-foreground leading-relaxed mb-4">
          The price surge correlates strongly with <strong>elevated residual load</strong> 
          conditions (correlation coefficient: 0.58). Residual load—total demand minus 
          renewable generation—reached unusually high levels as wind production 
          underperformed forecasts while heating demand remained elevated due to 
          below-average temperatures across Central Europe.
        </p>
        
        <p className="text-muted-foreground leading-relaxed text-sm">
          <em>
            Note: This analysis identifies statistical correlations and patterns. 
            Correlation does not imply causation. Market participants should 
            incorporate additional context and domain expertise when making decisions.
          </em>
        </p>
      </div>
    </motion.section>
  );
}
