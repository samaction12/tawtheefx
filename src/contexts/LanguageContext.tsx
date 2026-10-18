import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, Language } from '../locales/translations';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['ar'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
