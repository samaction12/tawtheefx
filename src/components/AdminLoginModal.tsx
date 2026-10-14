import React, { useState } from 'react';
import { adminSignIn } from '../services/auth';

export const AdminLoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (!isOpen) return null;
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await adminSignIn(email, pw); onClose(); } catch { setErr('بيانات الدخول غير صحيحة.'); } finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <form onSubmit={go} className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3">
        <h3 className="font-bold">دخول الإدارة</h3>
        <input className="w-full px-3 py-2 border rounded-lg text-sm" type="email" placeholder="البريد" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" autoComplete="username" />
        <input className="w-full px-3 py-2 border rounded-lg text-sm" type="password" placeholder="كلمة المرور" value={pw} onChange={(e) => setPw(e.target.value)} required dir="ltr" autoComplete="current-password" />
        {err && <p className="text-xs text-red-600" role="alert">{err}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold">دخول</button>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm">إلغاء</button>
        </div>
      </form>
    </div>
  );
};
