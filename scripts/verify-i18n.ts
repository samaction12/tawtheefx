import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../src/locales/config.ts';

const LOCALES_DIR = path.resolve('src/locales');

const readJson = (file: string): Record<string, string> =>
  JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
  if (ok) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
};

const main = () => {
  console.log('i18n verification');

  // 1. every configured language has a dictionary file
  for (const lang of LANGUAGES) {
    const file = path.join(LOCALES_DIR, `${lang.code}.json`);
    check(`dictionary exists: ${lang.code}.json`, fs.existsSync(file));
  }

  // 2. every dictionary file on disk is registered in LANGUAGES
  const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const code = file.replace('.json', '');
    check(`dictionary registered: ${code}`, LANGUAGES.some((l) => l.code === code));
  }

  // 3. all dictionaries share the exact same key set as the English source
  const en = readJson('en.json');
  const enKeys = Object.keys(en).sort();
  check('en.json is not empty', enKeys.length > 0);
  for (const lang of LANGUAGES) {
    if (lang.code === 'en') continue;
    const dict = readJson(`${lang.code}.json`);
    const keys = Object.keys(dict).sort();
    const missing = enKeys.filter((k) => !(k in dict));
    const extra = keys.filter((k) => !(k in en));
    check(`${lang.code}.json has all keys`, missing.length === 0, `missing: ${missing.join(',')}`);
    check(`${lang.code}.json has no extra keys`, extra.length === 0, `extra: ${extra.join(',')}`);
  }

  // 4. no empty values in any dictionary
  for (const lang of LANGUAGES) {
    const dict = readJson(`${lang.code}.json`);
    const empty = Object.entries(dict)
      .filter(([, v]) => typeof v !== 'string' || v.trim() === '')
      .map(([k]) => k);
    check(`${lang.code}.json has no empty values`, empty.length === 0, `empty: ${empty.join(',')}`);
  }

  // 5. package copy keys exist for every package id used by the UI
  const pkgIds = ['pkg-standard', 'pkg-pro-interview', 'pkg-enterprise'];
  const slugs: Record<string, string> = {
    'pkg-standard': 'standard',
    'pkg-pro-interview': 'pro',
    'pkg-enterprise': 'enterprise',
  };
  for (const lang of LANGUAGES) {
    const dict = readJson(`${lang.code}.json`);
    for (const id of pkgIds) {
      const slug = slugs[id];
      const needed = [`pkg_${slug}_name`, `pkg_${slug}_desc`, ...[1, 2, 3, 4, 5].map((i) => `pkg_${slug}_f${i}`)];
      const missing = needed.filter((k) => !(k in dict));
      check(`${lang.code}.json package copy: ${id}`, missing.length === 0, `missing: ${missing.join(',')}`);
    }
  }

  // 6. the default language is registered
  check('default language is registered', LANGUAGES.some((l) => l.code === DEFAULT_LANGUAGE));

  // 7. exactly one RTL language (Arabic) and the rest LTR
  const rtl = LANGUAGES.filter((l) => l.dir === 'rtl').map((l) => l.code);
  check('arabic is rtl', rtl.includes('ar'), `rtl codes: ${rtl.join(',')}`);
  check('other languages are ltr', LANGUAGES.filter((l) => l.code !== 'ar').every((l) => l.dir === 'ltr'));

  // 8. mixed-language guard: a non-Arabic dictionary must not contain Arabic script,
  //    and the Arabic dictionary must actually be written in Arabic.
  const ARABIC_SCRIPT = /[\u0600-\u06FF]/;
  for (const lang of LANGUAGES) {
    const dict = readJson(`${lang.code}.json`);
    const withArabic = Object.entries(dict).filter(([, v]) => ARABIC_SCRIPT.test(v)).map(([k]) => k);
    if (lang.code === 'ar') {
      const notArabic = Object.keys(dict).length - withArabic.length;
      check('ar.json is written in Arabic', notArabic === 0, `non-arabic values: ${notArabic}`);
    } else {
      check(`${lang.code}.json contains no Arabic script`, withArabic.length === 0, `arabic in: ${withArabic.join(',')}`);
    }
  }

  // 9. every language has its own distinct values (no copy-paste dictionaries)
  const enDict = readJson('en.json');
  for (const lang of LANGUAGES) {
    if (lang.code === 'ar' || lang.code === 'en') continue;
    const dict = readJson(`${lang.code}.json`);
    const identical = Object.keys(dict).filter((k) => dict[k] === enDict[k]);
    const ratio = identical.length / Object.keys(dict).length;
    check(`${lang.code}.json is not a copy of en.json`, ratio < 0.5, `${identical.length} identical values`);
  }

  if (failures > 0) {
    console.error(`\n${failures} i18n check(s) failed`);
    process.exit(1);
  }
  console.log('\nAll i18n checks passed');
};

main();
