import React from 'react';
import { FileText, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getPackageCopy } from '../locales/packages';
import type { TranslationKey } from '../locales/translations';

interface StatusStyle {
  labelKey: TranslationKey;
  className: string;
}

/** Invoice statuses are language-neutral ids; map them for display. */
const STATUS_STYLES: Record<string, StatusStyle> = {
  completed: { labelKey: 'inv_status_completed', className: 'bg-emerald-100 text-emerald-700' },
  paid: { labelKey: 'inv_status_completed', className: 'bg-emerald-100 text-emerald-700' },
  processing: { labelKey: 'inv_status_processing', className: 'bg-amber-100 text-amber-700' },
  refunded: { labelKey: 'inv_status_refunded', className: 'bg-slate-100 text-slate-600' },
};

const DEFAULT_STATUS_STYLE: StatusStyle = {
  labelKey: 'inv_status_completed',
  className: 'bg-emerald-100 text-emerald-700',
};

export const InvoicesTab = ({ transactions, ownerFinancials, onOpenOwnerFinancials }: any) => {
  const { t, dir } = useLanguage();
  // حماية الأرقام من الكراش
  const totalEarnings = ownerFinancials?.totalEarningsSAR || 0;
  const availableBalance = ownerFinancials?.availableBalanceSAR || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={dir}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Wallet className="w-6 h-6 text-indigo-600" /> {t.inv_title}</h2>
        <button onClick={onOpenOwnerFinancials} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">{t.inv_btn_owner}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">{t.inv_total_earnings}</p>
          <p className="text-3xl font-bold text-slate-900">${(totalEarnings || 0).toLocaleString()}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-sm text-indigo-600 mb-1">{t.inv_available_balance}</p>
          <p className="text-3xl font-bold text-indigo-900">${(availableBalance || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="font-bold flex items-center gap-2"><FileText className="w-4 h-4" /> {t.inv_ledger_title}</h3>
        </div>
        {!transactions || transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">{t.inv_empty}</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx: any) => {
              const status = STATUS_STYLES[tx.status] || DEFAULT_STATUS_STYLE;
              const packageName = getPackageCopy(tx.packageId, t)?.name || tx.packageName;

              return (
                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-sm">{tx.customerName || t.inv_customer_fallback}</p>
                    <p className="text-xs text-slate-500">{packageName}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">${(tx.totalWithVat || 0).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>{t[status.labelKey]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
