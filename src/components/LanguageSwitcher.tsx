import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
      <Globe className="w-4 h-4 text-slate-600 ml-2" />
      {(['ar', 'en', 'ko', 'es', 'it'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 text-xs font-bold rounded ${lang === l ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
