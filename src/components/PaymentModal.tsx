import React, { useState } from 'react';
import { X, Lock, CreditCard, Landmark, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PaymentModal = ({ packageToBuy, onClose, onPaymentSuccess, pendingJob }: any) => {
  const { t, dir } = useLanguage();
  const [method, setMethod] = useState<'card' | 'bank_transfer'>('card');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(pendingJob?.company || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  
  const price = packageToBuy?.priceUSD || 19; 
  const total = price;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/orders', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: packageToBuy?.id, method, email, company, job: pendingJob }) 
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to create order');
      if (method === 'card') window.location.href = d.checkoutUrl;
      else { onPaymentSuccess(); onClose(); }
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4" dir={dir} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-600" /> {t.modal_checkout}</h3>
          <button type="button" onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-700" /></button>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm">
          <div className="font-bold text-slate-900 mb-2">{packageToBuy?.name || 'Standard'}</div>
          <div className="flex justify-between text-slate-600"><span>{t.modal_price}</span><span>${price.toFixed(2)} USD</span></div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2 text-slate-900"><span>{t.modal_total}</span><span>${total.toFixed(2)} USD</span></div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button type="button" onClick={() => setMethod('card')} className={`py-2 rounded-lg border font-semibold text-sm ${method === 'card' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'}`}><CreditCard className="inline w-4 h-4 me-1"/> {t.modal_card}</button>
            <button type="button" onClick={() => setMethod('bank_transfer')} className={`py-2 rounded-lg border font-semibold text-sm ${method === 'bank_transfer' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'}`}><Landmark className="inline w-4 h-4 me-1"/> {t.modal_bank}</button>
          </div>
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t.modal_company} value={company} onChange={(e) => setCompany(e.target.value)} required />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" type="email" placeholder={t.modal_email} value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
          <button disabled={busy} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold flex justify-center gap-2">
            {busy ? <Loader2 className="w-4 h-4 animate-spin"/> : t.modal_btn}
          </button>
        </form>
      </div>
    </div>
  );
};
