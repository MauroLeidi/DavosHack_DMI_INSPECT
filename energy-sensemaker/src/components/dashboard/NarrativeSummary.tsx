import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

// Mock data to be used while the API is commented out
const MOCK_NARRATIVE = `The current power market situation in Switzerland (code: CH) is characterized by high volatility, exceeding 71% of the levels observed over the past six months. Despite this elevated volatility, no price anomalies have been detected. The market has experienced an excessive return above the median of 5.75 €/MWh, indicating a notable deviation in pricing compared to typical levels.

Analyzing the drivers behind these market conditions, the forecast data reveals that peak spot prices align with high consumption periods and relatively low renewable energy output, particularly during early morning and late afternoon. Wind power is expected to be moderate to high in the later hours, helping to stabilize prices somewhat. Solar output, however, peaks at midday but then rapidly declines, which coincides with periods of high consumption, exerting upward pressure on spot prices.

For traders, the outlook suggests monitoring intra-day price fluctuations closely due to the forecasted high volatility and the anticipated variability in solar and wind generation. Strategies that account for potential price spikes during high demand periods, particularly when renewable outputs are low, will be crucial. Additionally, leveraging the anticipated increase in wind generation towards the evening could provide opportunities to mitigate cost risks associated with price volatility.`;

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

      /* --- REAL API LOGIC (Commented Out) ---
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
      --------------------------------------- */

      // --- MOCK LOGIC START ---
      // Simulate a 1.2s delay to show the loading state
      setTimeout(() => {
        setNarrative(MOCK_NARRATIVE);
        setIsGenerating(false);
      }, 1200);
      // --- MOCK LOGIC END ---
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