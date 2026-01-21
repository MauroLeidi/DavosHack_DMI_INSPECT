import { createContext, useContext, useState, ReactNode } from "react";

export type HighlightTarget = "price" | "volatility" | "driver" | null;

interface HighlightContextType {
  activeHighlight: HighlightTarget;
  setActiveHighlight: (target: HighlightTarget) => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [activeHighlight, setActiveHighlight] = useState<HighlightTarget>(null);

  return (
    <HighlightContext.Provider value={{ activeHighlight, setActiveHighlight }}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error("useHighlight must be used within a HighlightProvider");
  }
  return context;
}
