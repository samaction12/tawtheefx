import React from 'react';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { PACKAGES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export const PackagesSection = ({ onSelectPackage }: { onSelectPackage: any }) => {
  const { t } = useLanguage();
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{t.pkg_title}</h2>
        <p className="text-slate-500">{t.pkg_sub}</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map(pkg => (
          <div key={pkg.id} className={`p-8 rounded-3xl border ${pkg.popular ? 'bg-slate-900 text-white border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
            <div className="text-5xl font-extrabold mb-6">${pkg.priceUSD}</div>
            <ul className="space-y-4 mb-8">{pkg.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-emerald-400"/> {f}</li>)}</ul>
            <button onClick={() => onSelectPackage(pkg, 'USD')} className={`w-full py-3 rounded-xl font-bold ${pkg.popular ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-white'}`}>{t.pkg_btn}</button>
          </div>
        ))}
      </div>
    </section>
  );
};
