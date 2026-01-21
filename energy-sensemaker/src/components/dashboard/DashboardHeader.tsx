import { Calendar, Zap, Download, Printer } from "lucide-react"; // Importa nuove icone
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

interface DashboardHeaderProps {
  date: Date;
  setDate: (date: Date) => void;
  onExport?: () => void; // Aggiungi questa prop opzionale
}

export function DashboardHeader({ date, setDate, onExport }: DashboardHeaderProps) {
  const [region, setRegion] = useState("CH");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    // Aggiungi print:hidden per nascondere TUTTO l'header durante la stampa se vuoi un report pulito,
    // oppure nascondi solo i bottoni. Qui nascondiamo i controlli ma lasciamo il titolo.
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 print:hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Daily Energy Market Brief</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Region: {regions.find(r => r.code === region)?.name} ({region}) · 
            Date: {date ? format(date, "MMM d, yyyy") : "Select a date"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[160px] bg-card border-border"><SelectValue placeholder="Select region" /></SelectTrigger>
          <SelectContent className="bg-card border-border">
            {regions.map((r) => <SelectItem key={r.code} value={r.code}>{r.name} ({r.code})</SelectItem>)}
          </SelectContent>
        </Select>
        
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
                  setDate(d);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Pulsante EXPORT aggiornato */}
        <Button 
          onClick={onExport} 
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-6 gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;