// CYBERVERSE — Lightweight i18n (no external dependency)

import { create } from 'zustand';
import en from './locales/en';

export type Locale = 'en' | 'ta' | 'es' | 'fr' | 'de' | 'ja';

type TranslationKeys = Record<string, string>;

const locales: Record<Locale, () => Promise<TranslationKeys>> = {
  en: async () => en as unknown as TranslationKeys,
  ta: () => import('./locales/ta').then(m => m.default as unknown as TranslationKeys),
  es: () => import('./locales/es').then(m => m.default as unknown as TranslationKeys),
  fr: () => import('./locales/fr').then(m => m.default as unknown as TranslationKeys),
  de: () => import('./locales/de').then(m => m.default as unknown as TranslationKeys),
  ja: () => import('./locales/ja').then(m => m.default as unknown as TranslationKeys),
};

interface I18nStore {
  locale: Locale;
  translations: TranslationKeys;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string) => string;
}

export const useI18n = create<I18nStore>((set, get) => ({
  locale: 'en',
  translations: en as unknown as TranslationKeys,
  setLocale: async (locale: Locale) => {
    const translations = await locales[locale]();
    set({ locale, translations });
  },
  t: (key) => get().translations[key] || key,
}));
