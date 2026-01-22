import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Info, 
  Loader2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SwissSmartDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ACCENT_COLOR = "#333670";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/dashboard/swiss-smart');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to retrieve forecast intelligence.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderChart = () => {
    if (!data || !data.chart_js) return null;

    const { type, data: chartData, options } = data.chart_js;

    // Apply the accent color to the chart datasets dynamically
    const themedData = {
      ...chartData,
      datasets: chartData.datasets.map((ds: any) => ({
        ...ds,
        borderColor: ACCENT_COLOR,
        backgroundColor: ds.label?.toLowerCase().includes('price') 
          ? 'rgba(51, 54, 112, 0.1)' 
          : ds.backgroundColor,
        tension: 0.4, // Smoother lines
        fill: true,
      }))
    };

    const chartConfig = {
      data: themedData,
      options: {
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
            labels: { usePointStyle: true, font: { size: 11 } }
          }
        },
        scales: {
          y: { grid: { display: false }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      },
    };

    return type === 'bar' ? <Bar {...chartConfig} /> : <Line {...chartConfig} />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#333670]" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing Swiss Market Signals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
        <Info className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  const { analysis } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden max-w-5xl mx-auto my-8"
    >
      {/* HEADER */}
      <div className="p-6 border-b border-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🇨🇭</span>
            <h2 className="text-xl font-bold text-[#333670] tracking-tight">Swiss Smart Intelligence</h2>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Next 24h Price Optimization
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#333670]/5 px-4 py-2 rounded-full border border-[#333670]/10">
          <Sparkles className="w-4 h-4 text-[#333670]" />
          <span className="text-xs font-semibold text-[#333670] uppercase tracking-wider">Smart Recommendation</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* INSIGHT BANNER */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="p-5 bg-[#333670] rounded-xl text-white shadow-lg shadow-[#333670]/20 relative overflow-hidden"
        >
          <div className="relative z-10 flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Market Advice</p>
              <p className="text-lg font-medium leading-snug">
                {analysis.advice}
              </p>
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            label="Current Market Rate" 
            value={`${analysis.current_price} €/MWh`}
            icon={TrendingUp}
            color="default"
          />
          <StatCard 
            label="Optimal Purchase Window" 
            value={`${analysis.min_price} €/MWh`}
            subtext={`Expected at ${analysis.best_time_label}`}
            icon={TrendingDown}
            color="success"
          />
          <StatCard 
            label="Daily Peak Risk" 
            value={`${analysis.max_price} €/MWh`}
            icon={Info}
            color="danger"
          />
        </div>

        {/* CHART AREA */}
        <div className="bg-slate-50/50 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Price Forecast Curve</h3>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#333670]" />
                    <span className="text-[10px] text-muted-foreground font-medium">Spot Forecast</span>
                </div>
            </div>
          </div>
          <div className="h-72 w-full">
            {renderChart()}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 bg-slate-50 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
          Powered by Volue Insight · EC00 Forecast Engine
        </span>
      </div>
    </motion.div>
  );
};

// Sub-component for Stats to keep code clean
const StatCard = ({ label, value, subtext, icon: Icon, color }: any) => {
  const colorStyles: any = {
    default: "bg-white border-border",
    success: "bg-emerald-50/30 border-emerald-100",
    danger: "bg-rose-50/30 border-rose-100",
  };

  const iconColors: any = {
    default: "text-[#333670]",
    success: "text-emerald-600",
    danger: "text-rose-600",
  };

  return (
    <div className={`p-4 border rounded-xl shadow-sm ${colorStyles[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColors[color]}`} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
        {subtext && <span className="text-[10px] font-medium text-emerald-600 mt-0.5">{subtext}</span>}
      </div>
    </div>
  );
};