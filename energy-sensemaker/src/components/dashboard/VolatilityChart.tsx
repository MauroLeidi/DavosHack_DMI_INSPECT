import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useHighlight } from "@/contexts/HighlightContext";

// Generate volatility data
const generateVolatilityData = () => {
  const data = [];
  const days = 14;
  
  for (let i = 0; i < days; i++) {
    const normalVolatility = 12 + Math.random() * 5;
    let volatility = normalVolatility;
    
    // Elevated volatility in last 3 days
    if (i >= 11) {
      volatility = 22 + Math.random() * 8;
    }
    
    data.push({
      day: `Jan ${(i + 2).toString().padStart(2, '0')}`,
      volatility: Math.round(volatility * 10) / 10,
      normalUpper: 20,
      normalLower: 8,
    });
  }
  
  return data;
};

const volatilityData = generateVolatilityData();

export function VolatilityChart() {
  const { activeHighlight } = useHighlight();
  
  const isHighlighted = activeHighlight === "volatility";
  const isFaded = activeHighlight !== null && activeHighlight !== "volatility";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={`chart-container transition-all duration-150 ${
        isHighlighted 
          ? "ring-2 ring-accent/50 shadow-lg" 
          : isFaded 
            ? "opacity-50" 
            : ""
      }`}
    >
      <h3 className="text-base font-semibold text-foreground mb-1">
        Volatility Regime
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Rolling 24h volatility compared to recent historical levels
      </p>
      
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volatilityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volatilityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="normalBandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--chart-grid))" 
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 35]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Volatility']}
            />
            {/* Normal range band */}
            <ReferenceLine 
              y={20} 
              stroke="hsl(var(--chart-baseline))" 
              strokeDasharray="3 3"
              label={{ value: 'Normal range', position: 'right', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <ReferenceLine 
              y={8} 
              stroke="hsl(var(--chart-baseline))" 
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="volatility"
              stroke="hsl(280, 65%, 60%)"
              strokeWidth={2}
              fill="url(#volatilityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: 'hsl(280, 65%, 60%)' }} />
          <span>Rolling volatility</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-muted rounded" />
          <span>Normal range (8-20%)</span>
        </div>
      </div>
    </motion.div>
  );
}
