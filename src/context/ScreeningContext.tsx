import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { emptyScreening, type Screening } from '../types/screening';

/**
 * Holds the screening currently being carried out. One at a time —
 * a CHW is with one patient. Committed to storage at the referral step.
 */
interface ScreeningContextValue {
  draft: Screening;
  update: (patch: Partial<Screening>) => void;
  reset: () => void;
}

const ScreeningContext = createContext<ScreeningContextValue | null>(null);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Screening>(emptyScreening);

  const value = useMemo<ScreeningContextValue>(
    () => ({
      draft,
      update: (patch) => setDraft((current) => ({ ...current, ...patch })),
      reset: () => setDraft(emptyScreening()),
    }),
    [draft],
  );

  return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>;
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used inside ScreeningProvider');
  return ctx;
}
