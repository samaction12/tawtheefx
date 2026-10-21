import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { googleSignIn } from '../services/auth';

export const AdminLoginModal = ({ isOpen, onClose }: any) => {
  const [busy, setBusy] = useState(false);
  if (!isOpen) return null;

  const handleLogin = async () => {
    setBusy(true);
    try {
      await googleSignIn();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">دخول الإدارة</h2>
          <p className="text-slate-500 text-sm mt-2">هذه الصفحة مخصصة لمالك المنصة فقط.</p>
        </div>
        <button 
          onClick={handleLogin} 
          disabled={busy}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {busy ? 'جاري التحقق...' : 'تسجيل الدخول بجوجل'}
        </button>
      </div>
    </div>
  );
};
