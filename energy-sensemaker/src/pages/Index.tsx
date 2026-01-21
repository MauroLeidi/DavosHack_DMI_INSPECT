import { useState,useRef } from "react";
import { AlertTriangle, Activity } from "lucide-react"; // Ho rimosso TrendingUp che non serve più
import { useReactToPrint } from "react-to-print"; // Importa la libreria
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { NarrativeSummary } from "@/components/dashboard/NarrativeSummary";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { HighlightProvider } from "@/contexts/HighlightContext";
import { EuropePriceMap } from "@/components/dashboard/EuropePriceMap";

// Sample sparkline data
const priceSparkline = [78, 82, 75, 80, 85, 78, 82, 95, 88, 142, 125, 98, 85, 80];
const volatilitySparkline = [12, 14, 11, 13, 15, 12, 14, 18, 22, 28, 25, 24];
// Ho rimosso loadSparkline perché non viene più usato

const Index = () => {
  // 1. MASTER STATE for the date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 21));

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Market_Brief_${selectedDate.toISOString().split('T')[0]}`,
  });

  return (
    <HighlightProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. PASS STATE TO HEADER */}
        <DashboardHeader 
          date={selectedDate} 
          setDate={setSelectedDate} 
          onExport={handlePrint}
        />
        
        <div ref={contentRef} className="print:p-6 print:bg-white">
        {/* MODIFICA QUI: grid-cols-1 md:grid-cols-2 (Invece di 3) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <InsightCard
            icon={AlertTriangle}
            title="Price Anomaly"
            headline="Unusual Price Spike"
            detail="Day-ahead price peaked at 142 €/MWh (+64 €/MWh vs baseline)"
            severity="high"
            sparklineData={priceSparkline}
            delay={0}
            highlightTarget="price"
          />
          <InsightCard
            icon={Activity}
            title="Volatility Regime"
            headline="High Volatility Detected"
            detail="Volatility is 2.1× higher than last week"
            severity="medium"
            sparklineData={volatilitySparkline}
            sparklineType="area"
            delay={0.1}
            highlightTarget="volatility"
          />
          {/* TERZA CARD RIMOSSA */}
        </section>
        
        <div className="mt-6">
          <NarrativeSummary />
        </div>

        {/* 3. PASS STATE TO MAP */}
        <section className="mt-8 break-inside-avoid">
          <EuropePriceMap date={selectedDate} />
        </section>
        
        <section className="mt-8">
          <h2 className="section-title mb-1">Supporting Evidence</h2>
          <p className="section-subtitle">Visual analysis with annotated patterns</p>

          <div className="mt-4">
            <PriceChart />
          </div>
        </section>
        
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Energy Market Signal Intelligence · Data refreshed Jan 15, 2026 at 06:00 UTC
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              All systems operational
            </p>
          </div>
        </footer>
        </div>
      </div>
      </div>
      
      <div className="print:hidden">
      <ChatInterface />
      </div>
    </HighlightProvider>
  );
};

export default Index;