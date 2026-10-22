import en from './en.json';
import { LANGUAGES, Language, DEFAULT_LANGUAGE } from './config';

/** The English dictionary is the source of truth for the available keys. */
export type TranslationKey = keyof typeof en;
export type TranslationDict = Record<TranslationKey, string>;

/**
 * Every `*.json` file in this folder is picked up automatically, so adding a
 * language only requires dropping in the dictionary file plus one line in
 * `LANGUAGES` (see ./config.ts).
 */
const modules = import.meta.glob<{ default: unknown }>('./*.json', { eager: true });

const dictionaries: Record<string, Partial<TranslationDict>> = {};
for (const [path, mod] of Object.entries(modules)) {
  const code = path.replace(/^\.\//, '').replace(/\.json$/, '');
  const value = (mod as { default: Partial<TranslationDict> }).default;
  if (value && typeof value === 'object') dictionaries[code] = value;
}

const buildDictionary = (code: string): TranslationDict => ({
  // English is the fallback so a missing key never renders as blank.
  ...(dictionaries.en || (en as Partial<TranslationDict>)),
  ...(dictionaries[code] || {}),
}) as TranslationDict;

export const translations: Record<Language, TranslationDict> = (() => {
  const out = {} as Record<Language, TranslationDict>;
  for (const lang of LANGUAGES) out[lang.code] = buildDictionary(lang.code);
  return out;
})();

export { LANGUAGES, DEFAULT_LANGUAGE };
export type { Language };
export { getLanguageMeta } from './config';
