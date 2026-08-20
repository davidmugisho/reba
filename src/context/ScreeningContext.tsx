import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { clearDraft, loadDraft, saveDraft } from '../storage/draft';
import { deleteScreeningPhotos } from '../storage/photos';
import { emptyScreening, type Screening } from '../types/screening';

/**
 * Holds the screening currently being carried out. One at a time —
 * a CHW is with one patient. Committed to storage at the referral step.
 *
 * The draft is also written to disk as it goes, so an interruption that kills
 * the app does not lose it. What is found at startup is offered, never
 * adopted: resuming the wrong screening silently is how one patient's photos
 * end up filed under another patient's name.
 */
interface ScreeningContextValue {
  draft: Screening;
  update: (patch: Partial<Screening>) => void;
  /** Starts a fresh screening and drops whatever was in progress. */
  reset: () => void;
  /** An unfinished screening found on disk, waiting to be resumed or dropped. */
  pending: Screening | null;
  resume: () => Screening | null;
  discardPending: () => void;
}

const ScreeningContext = createContext<ScreeningContextValue | null>(null);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Screening>(emptyScreening);
  const [pending, setPending] = useState<Screening | null>(null);

  // Nothing is written until the draft is worth keeping, so that simply
  // opening the app does not leave a screening behind on the device.
  const started = useRef(false);

  useEffect(() => {
    loadDraft().then((found) => {
      if (found) setPending(found);
    });
  }, []);

  const value = useMemo<ScreeningContextValue>(
    () => ({
      draft,
      pending,

      update: (patch) =>
        setDraft((current) => {
          const next = { ...current, ...patch };
          if (started.current || next.consentGiven) {
            started.current = true;
            void saveDraft(next);
          }
          return next;
        }),

      reset: () => {
        started.current = false;
        void clearDraft();
        setDraft(emptyScreening());
      },

      resume: () => {
        if (!pending) return null;
        started.current = true;
        setDraft(pending);
        setPending(null);
        return pending;
      },

      discardPending: () => {
        if (!pending) return;
        // The photos go with it: a screening nobody will finish should not
        // leave pictures of someone's eyes on the phone.
        deleteScreeningPhotos(pending.id);
        setPending(null);
        void clearDraft();
      },
    }),
    [draft, pending],
  );

  return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>;
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used inside ScreeningProvider');
  return ctx;
}

/** The id of the screening in progress, so the photo sweep can spare it. */
export function useActiveScreeningIds(): string[] {
  const { draft, pending } = useScreening();
  return useMemo(
    () => [draft.id, pending?.id].filter((id): id is string => !!id),
    [draft.id, pending?.id],
  );
}
