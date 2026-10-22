import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../locales/translations';

/**
 * Professional dropdown language selector.
 * Adding a new language only requires a new JSON dictionary + one line in
 * `src/locales/config.ts` (LANGUAGES array).
 */
export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (code: typeof lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-100 backdrop-blur-md transition-colors hover:border-indigo-400/40 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
      >
        <Globe className="h-4 w-4 shrink-0 text-indigo-300" aria-hidden="true" />
        <span className="text-base leading-none" aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl start-0"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm transition-colors ${
                  active
                    ? 'bg-indigo-600/20 text-white ring-1 ring-indigo-500/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-lg leading-none" aria-hidden="true">{l.flag}</span>
                <span className="flex-1 font-semibold">{l.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{l.code}</span>
                {active && <Check className="h-4 w-4 shrink-0 text-indigo-300" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
