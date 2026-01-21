import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Info } from "lucide-react";

const generationData = [
  { name: "Wind", value: 32, color: "hsl(var(--chart-load))" },
  { name: "Solar", value: 8, color: "hsl(40 75% 50%)" },
  { name: "Hydro", value: 18, color: "hsl(200 70% 50%)" },
  { name: "Thermal", value: 35, color: "hsl(var(--muted-foreground))" },
  { name: "Imports", value: 7, color: "hsl(var(--chart-volatility))" },
];

export function GenerationMixChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-foreground">Generation Mix</h3>
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Context
        </span>
      </div>
      
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={generationData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {generationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs shadow-lg">
                      <span className="font-medium">{data.name}:</span>{" "}
                      <span className="text-muted-foreground">{data.value}%</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Compact legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {generationData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-muted-foreground">
              {item.name} {item.value}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Indicative label */}
      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
        <Info className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">
          Indicative mix for narrative context
        </span>
      </div>
    </motion.div>
  );
}
