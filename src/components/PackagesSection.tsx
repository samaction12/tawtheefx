import React from 'react';
import { Check, Sparkles, Building2, Zap } from 'lucide-react';
import { JobPackage, Currency } from '../types';
import { PACKAGES } from '../data/mockData';

interface Props {
  onSelectPackage: (pkg: JobPackage, currency: Currency) => void;
}

export const PackagesSection: React.FC<Props> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Global Pricing
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Choose your perfect plan
          </p>
          <p className="mt-4 text-xl text-slate-500">
            Transparent pricing in USD. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                pkg.popular 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-500/20 md:-translate-y-4 border border-slate-700' 
                  : 'bg-white text-slate-900 shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2'
              }`}
            >
              {pkg.badge && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                  pkg.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {pkg.badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                {pkg.popular ? <Zap className="w-6 h-6 text-indigo-400" /> : pkg.name === 'Enterprise' ? <Building2 className="w-6 h-6 text-indigo-600" /> : <Sparkles className="w-6 h-6 text-indigo-600" />}
                <h3 className={`text-2xl font-bold ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
              </div>
              
              <p className={`text-sm mb-6 ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                {pkg.description}
              </p>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">${pkg.priceUSD}</span>
                <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>/ {pkg.durationDays} days</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${pkg.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-medium ${pkg.popular ? 'text-slate-200' : 'text-slate-700'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPackage(pkg, 'USD')}
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                  pkg.popular
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
