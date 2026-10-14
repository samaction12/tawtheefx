import React, { useState } from 'react';
import { PACKAGES } from '../data/mockData';
import { Currency, JobPackage } from '../types';
import { Check, ShieldCheck, Zap, Lock, CreditCard } from 'lucide-react';

interface PackagesSectionProps {
  onSelectPackage: (pkg: JobPackage, currency: Currency) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const [currency, setCurrency] = useState<Currency>('SAR');

  const getPrice = (pkg: JobPackage) => {
    switch (currency) {
      case 'SAR':
        return `${pkg.priceSAR.toLocaleString()} ر.س`;
      case 'AED':
        return `${pkg.priceAED.toLocaleString()} د.إ`;
      case 'USD':
        return `$${pkg.priceUSD.toLocaleString()}`;
    }
  };

  return (
    <section id="packages-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              حلول استقطاب الكفاءات والخدمات الرقمية
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              باقات نشر إعلانات الوظائف والمقابلات الإلكترونية
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              اختر الباقة المناسبة لاحتياجات فريقك مع إمكانية الترقية في أي وقت ونظام دفع فوري وآمن يتيح بطاقات مدى، فيزا، ماستركارد، وApple Pay.
            </p>
          </div>

          {/* Currency Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shrink-0 self-start md:self-auto">
            <button
              onClick={() => setCurrency('SAR')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currency === 'SAR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ريال سعودي (SAR)
            </button>
            <button
              onClick={() => setCurrency('AED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currency === 'AED' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              درهم إماراتي (AED)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              دولار أمريكي (USD)
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const isFeatured = pkg.popular;
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-xl bg-white p-7 transition-all ${
                  isFeatured
                    ? 'border-2 border-indigo-600 shadow-md ring-1 ring-indigo-600/20'
                    : 'border border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-sm">
                    {pkg.badge}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-[36px]">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                        {getPrice(pkg)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {pkg.id === 'pkg-enterprise' ? '/ شهرياً' : '/ إعلان'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      شامل الدعم الفني وتوليد فاتورة ضريبية رسمية
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-900">المزايا المشمولة في الباقة:</div>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                  <button
                    onClick={() => onSelectPackage(pkg, currency)}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>شراء الباقة والبدء فوراً</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>تأكيد فوري عبر بوابة الدفع الآمنة</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Box */}
        <div className="mt-12 p-5 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                ضمان المعاملات المالية وحماية بيانات المقابلات
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                تتم جميع عمليات الدفع عبر خوادم بنكية مشفرة بأعلى بروتوكولات الأمان (256-bit TLS/SSL). جميع تسجيلات المقابلات مشفرة بالكامل وخاضعة لسياسات الخصوصية وحماية البيانات الشخصية.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-slate-600">
            <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-semibold">MADA</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-semibold">VISA</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-semibold">MC</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-semibold">APPLE PAY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
