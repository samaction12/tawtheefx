import React from 'react';
import { ShieldCheck, Mail, Globe, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4"><h3 className="text-xl font-bold text-white">ThakiHire Global</h3><p className="text-sm text-slate-400">Global Smart Recruitment.</p></div>
        <div><h4 className="text-white font-bold mb-4">{t.ftr_platform}</h4><ul className="space-y-2 text-sm"><li><button onClick={() => onNavigate('jobs')} className="hover:text-indigo-400">{t.nav_jobs}</button></li><li><button onClick={() => onNavigate('packages')} className="hover:text-indigo-400">{t.nav_packages}</button></li></ul></div>
        <div><h4 className="text-white font-bold mb-4">{t.ftr_security}</h4><ul className="space-y-2 text-sm"><li><ShieldCheck className="inline w-4 h-4 mr-2"/> 256-Bit SSL</li><li><Lock className="inline w-4 h-4 mr-2"/> PCI-DSS</li></ul></div>
        <div><h4 className="text-white font-bold mb-4">{t.ftr_support}</h4><ul className="space-y-2 text-sm"><li><Mail className="inline w-4 h-4 mr-2"/> support@thakihire.com</li><li><Globe className="inline w-4 h-4 mr-2"/> Global 24/7</li></ul></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">© 2026 ThakiHire. {t.ftr_rights}.</div>
    </footer>
  );
};
