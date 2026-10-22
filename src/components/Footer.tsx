import React from 'react';
import { ShieldCheck, Mail, Globe, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              T
            </div>
            <span className="text-xl font-black text-white tracking-tight">ThakiHire Global</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.ftr_description}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.ftr_status}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">{t.ftr_platform}</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('jobs')} className="hover:text-indigo-400 transition-colors">
                {t.nav_jobs}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('packages')} className="hover:text-indigo-400 transition-colors">
                {t.nav_packages}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('interviews')} className="hover:text-indigo-400 transition-colors">
                {t.nav_interviews}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('employer')} className="hover:text-indigo-400 transition-colors">
                {t.nav_admin}
              </button>
            </li>
          </ul>
        </div>

        {/* Security & Compliance */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">{t.ftr_security}</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.ftr_ssl}</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{t.ftr_pci}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t.ftr_compliance}</span>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">{t.ftr_support}</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>support@thakihire.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{t.ftr_support_247}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div>© 2026 ThakiHire Global Inc. {t.ftr_rights}.</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>{t.ftr_terms}</span>
          <span>•</span>
          <span>{t.ftr_privacy}</span>
          <span>•</span>
          <span>{t.ftr_digital_security}</span>
        </div>
      </div>
    </footer>
  );
};
