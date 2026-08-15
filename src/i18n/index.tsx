import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { de } from './de';
import { en, type Strings } from './en';
import { fr } from './fr';
import { rw } from './rw';

export type Locale = 'rw' | 'en' | 'fr' | 'de';

const DICTIONARIES: Record<Locale, Strings> = { rw, en, fr, de };

/** Kinyarwanda first: it is the language most of the people using this speak. */
export const LOCALES: Locale[] = ['rw', 'en', 'fr', 'de'];

const KEY = 'reba:locale:v1';

const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Strings;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Read the stored choice once. A failure here is not worth blocking the app
  // for — English is a usable fallback, and the picker is on the first screen.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((stored) => {
        if (!cancelled && isLocale(stored)) setLocaleState(stored);
      })
      .catch((cause) => console.warn('[reba] could not read the saved language', cause));
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: DICTIONARIES[locale],
      setLocale: (next) => {
        // Switch first, persist second. The health worker should never wait on
        // the disk to see the language change.
        setLocaleState(next);
        AsyncStorage.setItem(KEY, next).catch((cause) =>
          console.warn('[reba] could not save the language choice', cause),
        );
      },
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT must be used inside LocaleProvider');
  return ctx;
}

/** The strings for the current language. */
export function useT(): Strings {
  return useLocaleContext().t;
}

/** The current language and a way to change it. */
export function useLocale() {
  const { locale, setLocale } = useLocaleContext();
  return { locale, setLocale };
}

/** Language names for the picker, in their own language. */
export const LOCALE_NAMES: Record<Locale, { code: string; name: string }> = {
  rw: { code: rw.code, name: rw.name },
  en: { code: en.code, name: en.name },
  fr: { code: fr.code, name: fr.name },
  de: { code: de.code, name: de.name },
};
