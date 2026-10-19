import React from 'react';
import { Check, Sparkles, Zap, Building2, ShieldCheck, Video, Clock } from 'lucide-react';
import { PACKAGES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export const PackagesSection = ({ onSelectPackage }: { onSelectPackage: (pkg: any, currency?: string) => void }) => {
  const { t } = useLanguage();

  return (
    <section id="packages-section" className="py-24 bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[400px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>باقات توظيف مرنة ومضمونة</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {t.pkg_title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {t.pkg_sub}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div 
                key={pkg.id} 
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular 
                    ? 'bg-gradient-to-b from-slate-900 to-indigo-950 text-white shadow-2xl border-2 border-indigo-500/50 md:-translate-y-2' 
                    : 'bg-white text-slate-900 border border-slate-200/90 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    {pkg.badge || 'الأكثر طلباً للشركات'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold tracking-tight">
                      {pkg.name}
                    </h3>
                    {isPopular ? (
                      <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                        <Zap className="w-5 h-5 fill-current" />
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-600">
                        <Building2 className="w-5 h-5" />
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mb-6 leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100/20">
                    <span className="text-5xl font-black tracking-tight">${pkg.priceUSD}</span>
                    <span className={`text-xs font-semibold ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>/ للإعلان الكامل</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs leading-normal">
                        <div className={`rounded-full p-0.5 mt-0.5 shrink-0 ${isPopular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <div>
                  <button 
                    onClick={() => onSelectPackage(pkg, 'USD')} 
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                      isPopular 
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/30' 
                        : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-900/10'
                    }`}
                  >
                    {t.pkg_btn}
                  </button>
                  <p className={`text-[11px] text-center mt-2.5 ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                    تفعيل فوري وفاتورة ضريبية معتمدة
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Security & Guarantees Strip */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-around gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>بوابات دفع مشفرة 256-Bit SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-600" />
            <span>تسجيل وتوثيق المقابلات بجودة 1080p</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>نشر فوري وظهور عالمي خلال دقيقة واحدة</span>
          </div>
        </div>

      </div>
    </section>
  );
};
