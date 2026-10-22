import React from 'react';
import { LanguageSelector } from './LanguageSelector';

/**
 * Kept for backwards compatibility with existing imports.
 * The redesigned dropdown lives in ./LanguageSelector.tsx.
 */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => (
  <LanguageSelector className={className} />
);

export default LanguageSwitcher;
