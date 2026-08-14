import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Screening } from '../types/screening';

const KEY = 'reba:screenings:v1';

/**
 * Every screening stays on this device. Nothing here ever leaves it.
 */
export async function listScreenings(): Promise<Screening[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Screening[];
    return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getScreening(id: string): Promise<Screening | null> {
  const all = await listScreenings();
  return all.find((s) => s.id === id) ?? null;
}

export async function saveScreening(screening: Screening): Promise<void> {
  const all = await listScreenings();
  const next = [screening, ...all.filter((s) => s.id !== screening.id)];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
