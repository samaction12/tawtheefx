import React, { useState } from 'react';
import { X, Lock, CreditCard, Landmark, Copy, Check, Loader2 } from 'lucide-react';
import { JobListing, JobPackage } from '../types';

interface Props {
  packageToBuy: JobPackage;
  onClose: () => void;
  onPaymentSuccess: () => void;
  pendingJob?: Partial<JobListing> | null;
}

export const PaymentModal: React.FC<Props> = ({ packageToBuy, onClose, onPaymentSuccess, pendingJob }) => {
  const [method, setMethod] = useState<'card' | 'bank_transfer'>('card');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(pendingJob?.company || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  
  // استخدام سعر الدولار مباشرة وإلغاء الضريبة
  const price = packageToBuy?.priceUSD || 0;
  const vat = 0;
  const total = price;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: packageToBuy?.id, method, email, company, job: pendingJob || undefined }) 
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to create order');
      if (method === 'card') {
        window.location.href = d.checkoutUrl;
      } else {
        // سيتم تفعيل الحوالة البنكية لاحقاً
        onPaymentSuccess();
        onClose();
      }
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  const input = 'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir="ltr">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-600" /> Complete Order</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-slate-50 border p-4 text-sm space-y-1">
            <div className="font-bold text-slate-900">{packageToBuy?.name || 'Package'}</div>
            <div className="flex justify-between text-slate-600"><span>Price</span><span>${price.toFixed(2)} USD</span></div>
            <div className="flex justify-between font-bold border-t pt-1 text-slate-900"><span>Total</span><span>${total.toFixed(2)} USD</span></div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMethod('card')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold ${method === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}>
                <CreditCard className="w-4 h-4" /> Card
              </button>
              <button type="button" onClick={() => setMethod('bank_transfer')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold ${method === 'bank_transfer' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}>
                <Landmark className="w-4 h-4" /> Bank Transfer
              </button>
            </div>
            <input className={input} placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input className={input} type="email" placeholder="Invoice Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
            
            <button disabled={busy} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} {method === 'card' ? 'Pay with Card' : 'Show Bank Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
