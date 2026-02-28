"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ProgressContextType = {
  start: () => void;
  stop: () => void;
  loading: boolean;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);

  return (
    <ProgressContext.Provider value={{ loading, start, stop }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}
