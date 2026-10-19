import React, { useState } from 'react';
import { PaymentTransaction, OwnerFinancialProfile } from '../types';
import {
  Receipt,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Eye,
  X,
  Wallet,
  Building
} from 'lucide-react';

interface InvoicesTabProps {
  transactions: PaymentTransaction[];
  ownerFinancials?: OwnerFinancialProfile;
  onOpenOwnerFinancials?: () => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  transactions,
  ownerFinancials,
  onOpenOwnerFinancials,
}) => {
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-10 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>الإدارة المالية</span>
              <span>/</span>
              <span>سجل المدفوعات والاشتراكات</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              سجل المعاملات والفواتير الضريبية
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              كافة العمليات المنفذة بنجاح عبر بوابات الدفع الإلكتروني المربوطة بحساب تحصيل المالك.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenOwnerFinancials && (
              <button
                onClick={onOpenOwnerFinancials}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>حساب المالك والعوائد ({ownerFinancials?.availableBalanceSAR.toLocaleString('en-US')} $)</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>نظام فوترة إلكترونية متوافق مع هيئة الزكاة والضريبة والجمارك</span>
            </div>
          </div>
        </div>

        {/* Owner Merchant Settlement Strip */}
        {ownerFinancials && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-emerald-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>الحساب البنكي المعتمد لتحصيل مبيعات المنصة (حساب المالك):</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    المالك: {ownerFinancials.ownerEmail}
                  </span>
                </div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                  {ownerFinancials.merchantBusinessName} · {ownerFinancials.bankName} · الآيبان: {ownerFinancials?.iban}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] shrink-0 font-mono">
              <div className="text-slate-500">
                الرقم الضريبي: <span className="font-bold text-slate-900">{ownerFinancials.vatNumber}</span>
              </div>
              <div className="text-slate-500">
                السجل التجاري: <span className="font-bold text-slate-900">{ownerFinancials.crNumber}</span>
              </div>
              {onOpenOwnerFinancials && (
                <button
                  onClick={onOpenOwnerFinancials}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-semibold rounded-md border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                  <span>تعديل وبرمجة البوابة</span>
                </button>
              )}
            </div>
          </div>
        )}


        {/* Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الباقة المشتراة</th>
                  <th className="py-3 px-4">المنشأة المستفيدة</th>
                  <th className="py-3 px-4">طريقة الدفع</th>
                  <th className="py-3 px-4">المبلغ بدون ضريبة</th>
                  <th className="py-3 px-4">الضريبة (15%)</th>
                  <th className="py-3 px-4">الإجمالي النهائي</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الفاتورة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-indigo-600">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{tx.date}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900">
                      {tx.packageName}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600">{tx.companyName}</td>
                    <td className="py-3.5 px-4 uppercase text-slate-700">
                      {tx.paymentMethod} {tx.cardLast4 ? `(**** ${tx.cardLast4})` : ''}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {tx.amount??.toLocaleString() || "0" || "0"} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {tx.vatAmount??.toLocaleString() || "0" || "0"} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {tx.totalWithVat??.toLocaleString() || "0" || "0"} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض وطباعة</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice View Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">فاتورة ضريبية رسمية</h3>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">{selectedTx.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Invoice Body */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs text-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">
                      {ownerFinancials?.merchantBusinessName || 'منصة توظيف ذكي لتقنية المعلومات'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      الرقم الضريبي: {ownerFinancials?.vatNumber || '31094829100003'} · السجل التجاري: {ownerFinancials?.crNumber || '1010784920'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      حساب التحصيل: {ownerFinancials?.bankName || ''} ({ownerFinancials?.iban || ''})
                    </div>
                  </div>

                  <div className="text-left font-mono tabular-nums text-[11px]">
                    <div className="font-bold text-slate-900">{selectedTx.date}</div>
                    <div className="text-emerald-600 font-bold">حالة الدفع: مكتمل بنجاح</div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <div className="text-slate-400 text-[11px]">بيانات العميل:</div>
                  <div className="font-bold text-slate-900">{selectedTx.companyName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedTx.customerName} · {selectedTx.email}</div>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3 font-mono tabular-nums">
                  <div className="flex justify-between font-sans">
                    <span>{selectedTx.packageName}</span>
                    <span>{selectedTx.amount??.toLocaleString() || "0" || "0"} {selectedTx.currency}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] font-sans">
                    <span>ضريبة القيمة المضافة (15% VAT)</span>
                    <span>{selectedTx.vatAmount??.toLocaleString() || "0" || "0"} {selectedTx.currency}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-300 pt-2 text-sm font-sans">
                    <span>الإجمالي الكلي المسدد</span>
                    <span className="text-indigo-700 font-mono">{selectedTx.totalWithVat??.toLocaleString() || "0" || "0"} {selectedTx.currency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-200 pt-3">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <QrCode className="w-9 h-9 text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    فاتورة إلكترونية صادرة وموثقة إلكترونياً ومشفرة تشفيراً كاملاً.
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة</span>
                </button>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
