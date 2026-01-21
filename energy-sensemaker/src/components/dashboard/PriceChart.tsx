import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useHighlight } from "@/contexts/HighlightContext";

// Sample data for the price chart
const generatePriceData = () => {
  const data = [];
  const basePrice = 78;
  const hours = 24 * 14; // 14 days
  
  for (let i = 0; i < hours; i++) {
    const day = Math.floor(i / 24);
    const hour = i % 24;
    
    // Add daily pattern
    let hourlyFactor = 1;
    if (hour >= 7 && hour <= 9) hourlyFactor = 1.3;
    else if (hour >= 18 && hour <= 21) hourlyFactor = 1.2;
    else if (hour >= 0 && hour <= 5) hourlyFactor = 0.7;
    
    // Add anomaly on day 13 (Jan 15)
    let price = basePrice * hourlyFactor + (Math.random() - 0.5) * 15;
    if (day === 13 && hour >= 7 && hour <= 9) {
      price = 120 + Math.random() * 25; // Spike
    }
    
    data.push({
      hour: i,
      date: `Jan ${(day + 2).toString().padStart(2, '0')}`,
      time: `${hour.toString().padStart(2, '0')}:00`,
      price: Math.round(price * 10) / 10,
      baseline: basePrice * hourlyFactor,
      isAnomaly: day === 13 && hour >= 7 && hour <= 9,
    });
  }
  
  return data;
};

const priceData = generatePriceData();

// Get last 72 hours for display
const displayData = priceData.slice(-72);

export function PriceChart() {
  const { activeHighlight } = useHighlight();
  
  const isHighlighted = activeHighlight === "price";
  const isFaded = activeHighlight !== null && activeHighlight !== "price";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className={`chart-container transition-all duration-150 ${
        isHighlighted 
          ? "ring-2 ring-accent/50 shadow-lg" 
          : isFaded 
            ? "opacity-50" 
            : ""
      }`}
    >
      <h3 className="text-base font-semibold text-foreground mb-1">
        Day-Ahead Price Evolution
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Hourly day-ahead prices with detected anomalies (rolling 7-day baseline)
      </p>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--chart-grid))" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval={11}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}€`}
              domain={[40, 160]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)} €/MWh`,
                name === 'price' ? 'Price' : 'Baseline'
              ]}
            />
            {/* Anomaly highlight area */}
            <ReferenceArea 
              x1={displayData.length - 17} 
              x2={displayData.length - 14}
              fill="hsl(var(--anomaly))"
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="hsl(var(--chart-baseline))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--chart-price))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--chart-price))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-chart-price rounded" />
          <span>Actual price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-chart-baseline rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--chart-baseline)) 0, hsl(var(--chart-baseline)) 4px, transparent 4px, transparent 8px)' }} />
          <span>7-day baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-anomaly/10 rounded" />
          <span>Anomaly window</span>
        </div>
      </div>
    </motion.div>
  );
}
