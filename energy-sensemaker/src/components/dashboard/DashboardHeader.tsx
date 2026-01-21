import { Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const regions = [
  { code: "CH", name: "Switzerland" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AT", name: "Austria" },
  { code: "IT", name: "Italy" },
];

// INTERFACCIA PROPS (Fondamentale!)
interface DashboardHeaderProps {
  date: Date;
  setDate: (date: Date) => void;
}

// RICEVI LE PROPS QUI (Non usare useState per la data!)
export function DashboardHeader({ date, setDate }: DashboardHeaderProps) {
  const [region, setRegion] = useState("CH");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Daily Energy Market Brief</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Region: {regions.find(r => r.code === region)?.name} ({region}) · 
            Date: {date ? format(date, "MMM d, yyyy") : "Select a date"} · 
            Data window: last 14 days
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* ... Select Regioni ... */}
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[160px] bg-card border-border"><SelectValue placeholder="Select region" /></SelectTrigger>
          <SelectContent className="bg-card border-border">
            {regions.map((r) => <SelectItem key={r.code} value={r.code}>{r.name} ({r.code})</SelectItem>)}
          </SelectContent>
        </Select>
        
        {/* POPOVER CALENDARIO */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal bg-card border-border", !date && "text-muted-foreground")}>
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border" align="end">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d); // <--- AGGIORNA IL PADRE
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-6">Generate Brief</Button>
      </div>
    </header>
  );
}

// IMPORTANTE: Export default per evitare errori di importazione
export default DashboardHeader;