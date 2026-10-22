import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, Language, getLanguageMeta, DEFAULT_LANGUAGE } from '../locales/translations';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'thakihire.lang';

const readStoredLang = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Language;
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  if (browser in translations) return browser as Language;
  return DEFAULT_LANGUAGE;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(readStoredLang);

  const setLang = (next: Language) => {
    if (!next || !(next in translations)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) — language still applies for the session */
    }
  };

  const meta = getLanguageMeta(lang);
  const dir = meta.dir;

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], dir, isRtl: dir === 'rtl' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
