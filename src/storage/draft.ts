import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Screening } from '../types/screening';

/**
 * The screening currently being carried out, kept across app restarts.
 *
 * The flow promises a health worker can be interrupted — a crying child, a
 * queue — and come back without losing the thread. That was only true while
 * the app stayed in memory: Android kills backgrounded apps when it runs low,
 * and the half-finished screening went with it.
 *
 * This is patient data like any other, so it stays on the device and is
 * deleted the moment the screening is committed or abandoned.
 */

const KEY = 'reba:draft:v1';

/**
 * How long a draft may sit before it is no longer offered.
 *
 * Resuming a stale draft is how a new patient's photos end up attached to an
 * old patient's age and village. Long enough to survive a real interruption
 * inside one shift, short enough that it never spans a night.
 */
export const DRAFT_MAX_AGE_MS = 6 * 60 * 60 * 1000;

interface StoredDraft {
  savedAt: string;
  draft: Screening;
}

/** Writes the draft. Failures are logged, never thrown: this must not
 *  interrupt a screening in progress. */
export async function saveDraft(draft: Screening): Promise<void> {
  try {
    const payload: StoredDraft = { savedAt: new Date().toISOString(), draft };
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  } catch (cause) {
    console.warn('[reba] could not keep the screening in progress', cause);
  }
}

/**
 * Returns a resumable draft, or null.
 *
 * Null covers every doubt: nothing stored, unreadable, malformed, or too old.
 * A draft that cannot be trusted is not offered, because the health worker
 * would have no way to tell a good one from a bad one.
 */
export async function loadDraft(): Promise<Screening | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw == null) return null;

    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed?.draft?.id || !parsed.savedAt) return null;

    const age = Date.now() - new Date(parsed.savedAt).getTime();
    if (!Number.isFinite(age) || age < 0 || age > DRAFT_MAX_AGE_MS) return null;

    return parsed.draft;
  } catch (cause) {
    console.warn('[reba] could not read the screening in progress', cause);
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (cause) {
    console.warn('[reba] could not clear the screening in progress', cause);
  }
}
