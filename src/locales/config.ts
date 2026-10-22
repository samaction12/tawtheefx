export type Language = 'ar' | 'en' | 'ko' | 'es' | 'it';

export interface LanguageMeta {
  code: Language;
  label: string; // native name shown in the switcher
  flag: string;
  dir: 'rtl' | 'ltr';
}

/**
 * Adding a new language requires exactly two steps:
 *  1) drop `src/locales/<code>.json` next to the other dictionaries
 *  2) add one line to the array below
 * The dictionary file is auto-discovered at build time.
 */
export const LANGUAGES: LanguageMeta[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE: Language = 'ar';

export const getLanguageMeta = (code: Language): LanguageMeta =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)!;
