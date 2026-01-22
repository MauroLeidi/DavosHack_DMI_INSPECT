import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface VolatilityResponse {
  area: string;
  date: string;
  volatility: {
    level: "low" | "normal" | "high" | "unknown";
    percentile: number | null;
    chart_volatility: number[];
  };
  price_anomaly: {
    unusual: boolean;
    excessive_return: number | null;
    chart_price: number[];
  };
  forecasts: Record<string, number[]>;
}

interface NarrativeProps {
  data: VolatilityResponse | null;
}

export function NarrativeSummary({ data }: NarrativeProps) {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!data) return;

    const generateInsight = async () => {
      setIsGenerating(true);
      setNarrative(null);

      try {
        const response = await fetch("http://localhost:8000/v1/narrative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: data.date,
            area: data.area,
            volatility_context: data.volatility,
            anomaly_context: data.price_anomaly,
            forecast_data: data.forecasts 
          }),
        });

        if (!response.ok) throw new Error("Failed to generate narrative");

        const result = await response.json();
        setNarrative(result.content); 
      } catch (error) {
        console.error("AI Generation Error:", error);
        setNarrative("Unable to generate market narrative at this time.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateInsight();
  }, [data]);

  if (!data) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">What Happened and Why</h2>
        <span className="ai-label flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isGenerating ? "Analyzing market drivers..." : "AI-generated summary"}
        </span>
      </div>
      
      <div className="narrative-block bg-card border border-border rounded-xl p-6 shadow-sm min-h-[120px]">
        {isGenerating ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-line">
            {narrative || "No analysis available for this date."}
          </div>
        )}
      </div>
    </motion.section>
  );
}