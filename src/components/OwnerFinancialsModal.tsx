import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck } from 'lucide-react';

export const OwnerFinancialsModal = ({ isOpen, onClose, profile, onUpdateProfile }: any) => {
  const [ownerName, setOwnerName] = useState(profile?.ownerName || '');
  const [ownerEmail, setOwnerEmail] = useState(profile?.ownerEmail || '');
  const [merchantBusinessName, setMerchantBusinessName] = useState(profile?.merchantBusinessName || '');
  const [crNumber, setCrNumber] = useState(profile?.crNumber || '');
  const [vatNumber, setVatNumber] = useState(profile?.vatNumber || '');
  const [bankName, setBankName] = useState(profile?.bankName || '');
  const [iban, setIban] = useState(profile?.iban || '');
  const [swiftCode, setSwiftCode] = useState(profile?.swiftCode || '');

  // هنا السر: تحديث الخانات أوتوماتيك أول ما البيانات توصل من Firebase
  useEffect(() => {
    if (profile) {
      setOwnerName(profile.ownerName || '');
      setOwnerEmail(profile.ownerEmail || '');
      setMerchantBusinessName(profile.merchantBusinessName || '');
      setCrNumber(profile.crNumber || '');
      setVatNumber(profile.vatNumber || '');
      setBankName(profile.bankName || '');
      setIban(profile.iban || '');
      setSwiftCode(profile.swiftCode || '');
    }
  }, [profile]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      ...profile, ownerName, ownerEmail, merchantBusinessName, crNumber, vatNumber, bankName, iban, swiftCode
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 flex items-start justify-center p-4 overflow-y-auto pt-10 pb-32" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /> بيانات الحساب البنكي والمالك</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">اسم المستفيد المالي (المالك)</label><input className={inputClass} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required /></div>
            <div><label className="block text-sm font-bold mb-1">البريد الإلكتروني المالي</label><input type="email" className={inputClass} value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required /></div>
            <div><label className="block text-sm font-bold mb-1">اسم المنشأة التجارية</label><input className={inputClass} value={merchantBusinessName} onChange={(e) => setMerchantBusinessName(e.target.value)} required /></div>
            <div><label className="block text-sm font-bold mb-1">رقم السجل التجاري</label><input className={inputClass} value={crNumber} onChange={(e) => setCrNumber(e.target.value)} required /></div>
            <div><label className="block text-sm font-bold mb-1">الرقم الضريبي</label><input className={inputClass} value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required /></div>
            <div><label className="block text-sm font-bold mb-1">اسم البنك</label><input className={inputClass} value={bankName} onChange={(e) => setBankName(e.target.value)} required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">رقم الآيبان (IBAN)</label><input className={inputClass} value={iban} onChange={(e) => setIban(e.target.value)} required dir="ltr" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">رمز السويفت (SWIFT)</label><input className={inputClass} value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} required dir="ltr" /></div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-6">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> حفظ وتحديث بيانات المالك</button>
          </div>
        </form>
      </div>
    </div>
  );
};
