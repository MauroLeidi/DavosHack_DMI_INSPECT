import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { useHighlight } from "@/contexts/HighlightContext";

// Generate correlated data for price vs residual load
const generateDriverData = () => {
  const data = [];
  
  for (let i = 0; i < 50; i++) {
    const residualLoad = 4000 + Math.random() * 3000;
    // Base correlation with some noise
    const price = 40 + (residualLoad - 4000) * 0.015 + (Math.random() - 0.5) * 25;
    
    data.push({
      residualLoad: Math.round(residualLoad),
      price: Math.round(price * 10) / 10,
      hour: i,
    });
  }
  
  // Add anomaly points (high load, high price)
  for (let i = 0; i < 5; i++) {
    data.push({
      residualLoad: 6500 + Math.random() * 500,
      price: 130 + Math.random() * 20,
      hour: 50 + i,
      isAnomaly: true,
    });
  }
  
  return data;
};

const driverData = generateDriverData();

export function DriverChart() {
  const { activeHighlight } = useHighlight();
  
  const isHighlighted = activeHighlight === "driver";
  const isFaded = activeHighlight !== null && activeHighlight !== "driver";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className={`chart-container transition-all duration-150 ${
        isHighlighted 
          ? "ring-2 ring-accent/50 shadow-lg" 
          : isFaded 
            ? "opacity-50" 
            : ""
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base font-semibold text-foreground">
          Driver Relationship
        </h3>
        <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
          Correlation: 0.58
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Price vs. residual load — correlation does not imply causation
      </p>
      
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--chart-grid))" 
            />
            <XAxis 
              dataKey="residualLoad" 
              type="number"
              name="Residual Load"
              unit=" MW"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={[3500, 7500]}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            />
            <YAxis 
              dataKey="price" 
              type="number"
              name="Price"
              unit=" €"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}€`}
              domain={[30, 160]}
            />
            <ZAxis range={[40, 40]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              formatter={(value: number, name: string) => [
                name === 'Residual Load' ? `${value.toLocaleString()} MW` : `${value} €/MWh`,
                name
              ]}
            />
            <Scatter 
              name="Normal hours" 
              data={driverData.filter(d => !d.isAnomaly)} 
              fill="hsl(var(--chart-load))"
              fillOpacity={0.6}
            />
            <Scatter 
              name="Anomaly hours" 
              data={driverData.filter(d => d.isAnomaly)} 
              fill="hsl(var(--chart-anomaly))"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-load opacity-60" />
          <span>Normal hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-anomaly" />
          <span>Anomaly hours</span>
        </div>
      </div>
    </motion.div>
  );
}
