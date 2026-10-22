import { TranslationDict } from './translations';

export interface PackageCopy {
  name: string;
  desc: string;
  features: string[];
  badge?: string;
}

const SLUG_BY_PACKAGE_ID: Record<string, 'standard' | 'pro' | 'enterprise'> = {
  'pkg-standard': 'standard',
  'pkg-pro-interview': 'pro',
  'pkg-enterprise': 'enterprise',
};

/**
 * Resolves the localized copy for a package id using the flat keys stored in
 * the translation dictionaries (pkg_<slug>_name, pkg_<slug>_f1 ... ).
 */
export const getPackageCopy = (packageId: string, t: TranslationDict): PackageCopy | null => {
  const slug = SLUG_BY_PACKAGE_ID[packageId];
  if (!slug) return null;
  const key = (k: string) => (t as Record<string, string>)[`pkg_${slug}_${k}`];
  return {
    name: key('name') || '',
    desc: key('desc') || '',
    badge: key('badge') || undefined,
    features: [1, 2, 3, 4, 5].map((i) => key(`f${i}`) || '').filter(Boolean),
  };
};
