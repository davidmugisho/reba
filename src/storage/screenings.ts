import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import type { Screening } from '../types/screening';

/**
 * Our own database rather than the shared default store. The package's default
 * export is a v2 compatibility shim that its own docs discourage; this is the
 * v3 API. One database per app also means clearAll() can never reach another
 * library's keys.
 */
const storage = createAsyncStorage('reba');

const KEY = 'screenings:v1';

const newestFirst = (a: Screening, b: Screening) => b.createdAt.localeCompare(a.createdAt);

/**
 * Reads the stored records. Returns [] only when nothing has ever been saved.
 *
 * A storage failure throws instead of reporting "no records" — the write path
 * relies on that distinction. Treating an unreadable store as empty means the
 * next save writes a one-record list over the top of every screening the
 * device already holds.
 */
async function readAll(): Promise<Screening[]> {
  const raw = await storage.getItem(KEY);
  if (raw == null) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('stored value is not an array');
    return parsed as Screening[];
  } catch (cause) {
    // Corrupt payload. Park it under its own key rather than letting the next
    // save overwrite it, so the records can still be pulled off the device.
    await storage.setItem(`${KEY}:corrupt:${Date.now()}`, raw);
    await storage.removeItem(KEY);
    console.warn('[reba] screening store was unreadable and has been quarantined', cause);
    return [];
  }
}

/**
 * Every screening stays on this device. Nothing here ever leaves it.
 *
 * Read path: a failure degrades to an empty list so the screen still renders.
 */
export async function listScreenings(): Promise<Screening[]> {
  try {
    return (await readAll()).sort(newestFirst);
  } catch (cause) {
    console.warn('[reba] could not read screenings', cause);
    return [];
  }
}

export async function getScreening(id: string): Promise<Screening | null> {
  const all = await listScreenings();
  return all.find((s) => s.id === id) ?? null;
}

/**
 * Commits one screening. Throws if the store cannot be read or written —
 * the caller must tell the health worker, not fail quietly. A screening the
 * app claims to have saved and hasn't is worse than no app at all.
 */
export async function saveScreening(screening: Screening): Promise<void> {
  const all = await readAll();
  const next = [screening, ...all.filter((s) => s.id !== screening.id)];
  await storage.setItem(KEY, JSON.stringify(next));
}

export async function clearAll(): Promise<void> {
  await storage.removeItem(KEY);
}
