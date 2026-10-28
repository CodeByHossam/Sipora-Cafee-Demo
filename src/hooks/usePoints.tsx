// src/hooks/usePoints.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PointsContextValue {
  points: number;
  earn: (amount: number) => void;
  redeem: (amount: number) => boolean;
  canRedeem: boolean;
}

const PointsContext = createContext<PointsContextValue | null>(null);

const REDEEM_COST = 50;

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);

  const earn = useCallback((amount: number) => {
    if (amount <= 0) return;
    setPoints((p) => p + amount);
  }, []);

  const redeem = useCallback((amount: number) => {
    if (points < amount) return false;
    setPoints((p) => p - amount);
    return true;
  }, [points]);

  return (
    <PointsContext.Provider value={{ points, earn, redeem, canRedeem: points >= REDEEM_COST }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}

export const POINTS_PER_DRINK = 5;
export const REDEEM_THRESHOLD = 50;