import React, { useEffect, useState } from 'react';
import { X, Lock, CreditCard, Landmark, Copy, Check, Loader2 } from 'lucide-react';
import { Currency, JobListing, JobPackage } from '../types';

interface Props {
  packageToBuy: JobPackage;
  currency?: Currency;
  onClose: () => void;
  onPaymentSuccess: () => void;
  pendingJob?: Partial<JobListing> | null;
}
type Bank = { orderId: string; reference: string; total: number; bank: { name: string; accountName: string; iban: string } };
const ERR: Record<string, string> = {
  invalid_package: 'هذه الباقة مخصصة؛ تواصل معنا للحصول على عرض سعر.',
  invalid_email: 'البريد الإلكتروني غير صحيح.',
  invalid_company: 'أدخل اسم الشركة.',
  card_payments_not_configured: 'الدفع بالبطاقة غير مفعّل حالياً، اختر الحوالة البنكية.',
};

export const PaymentModal: React.FC<Props> = ({ packageToBuy, onClose, onPaymentSuccess, pendingJob }) => {
  const [method, setMethod] = useState<'card' | 'bank_transfer'>('card');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(pendingJob?.company || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [bank, setBank] = useState<Bank | null>(null);
  const [copied, setCopied] = useState(false);
  const price = packageToBuy.priceSAR;
  const vat = Math.round(price * 0.15 * 100) / 100;
  const total = Math.round((price + vat) * 100) / 100;

  // After a bank transfer is confirmed by the owner, the order flips to "paid".
  useEffect(() => {
    if (!bank) return;
    const t = setInterval(async () => {
      const s = await fetch(`/api/orders/${bank.orderId}/status`).then((r) => r.json()).catch(() => null);
      if (s?.status === 'paid') { clearInterval(t); onPaymentSuccess(); onClose(); }
    }, 8000);
    return () => clearInterval(t);
  }, [bank]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: packageToBuy.id, method, email, company, job: pendingJob || undefined }) });
      const d = await r.json();
      if (!r.ok) throw new Error(ERR[d.error] || 'تعذّر إنشاء الطلب، حاول لاحقاً.');
      if (method === 'card') window.location.href = d.checkoutUrl; // hosted checkout: card data never touches this site
      else setBank(d);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const input = 'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-600" />إتمام الطلب</h3>
          <button onClick={onClose} aria-label="إغلاق"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-slate-50 border p-4 text-sm space-y-1">
            <div className="font-bold">{packageToBuy.name}</div>
            <div className="flex justify-between text-slate-600"><span>السعر</span><span>{price.toFixed(2)} ر.س</span></div>
            <div className="flex justify-between text-slate-600"><span>ضريبة القيمة المضافة 15%</span><span>{vat.toFixed(2)} ر.س</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>الإجمالي</span><span>{total.toFixed(2)} ر.س</span></div>
          </div>

          {!bank ? (
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {([['card', 'بطاقة ائتمان', CreditCard], ['bank_transfer', 'حوالة بنكية', Landmark]] as const).map(([k, label, Icon]) => (
                  <button type="button" key={k} onClick={() => setMethod(k)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold ${method === k ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}>
                    <Icon className="w-4 h-4" />{label}
                  </button>))}
              </div>
              <input className={input} placeholder="اسم الشركة" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={120} />
              <input className={input} type="email" placeholder="البريد الإلكتروني للفاتورة" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
              {method === 'card' && <p className="text-xs text-slate-500">ستُحوَّل إلى صفحة دفع آمنة لدى مزوّد الدفع لإدخال بيانات البطاقة؛ لا نخزّن بيانات بطاقتك.</p>}
              {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
              <button disabled={busy} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}{method === 'card' ? 'المتابعة للدفع' : 'عرض بيانات الحوالة'}
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="font-semibold">حوّل <b>{bank.total.toFixed(2)} ر.س</b> إلى الحساب التالي واكتب رقم المرجع في خانة الملاحظات:</p>
              <div className="rounded-xl border p-4 space-y-2 bg-slate-50">
                <div>البنك: <b>{bank.bank.name}</b></div>
                <div>اسم الحساب: <b>{bank.bank.accountName}</b></div>
                <div className="flex items-center justify-between gap-2" dir="ltr"><span className="font-mono">{bank.bank.iban}</span>
                  <button type="button" onClick={() => copy(bank.bank.iban)} aria-label="نسخ">{copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}</button></div>
                <div>رقم المرجع: <b className="font-mono">{bank.reference}</b></div>
              </div>
              <p className="text-xs text-slate-500">سيُفعَّل طلبك وتصدر الفاتورة بعد تأكيد وصول الحوالة (عادةً خلال يوم عمل). يمكنك إغلاق النافذة؛ سنراسلك على بريدك.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
