import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Building2, CreditCard, Landmark } from 'lucide-react';

export const OwnerFinancialsModal = ({ isOpen, onClose, profile, onUpdateProfile }: any) => {
  const [ownerName, setOwnerName] = useState(profile?.ownerName || '');
  const [ownerEmail, setOwnerEmail] = useState(profile?.ownerEmail || '');
  const [merchantBusinessName, setMerchantBusinessName] = useState(profile?.merchantBusinessName || '');
  const [crNumber, setCrNumber] = useState(profile?.crNumber || '');
  const [vatNumber, setVatNumber] = useState(profile?.vatNumber || '');
  const [bankName, setBankName] = useState(profile?.bankName || '');
  const [iban, setIban] = useState(profile?.iban || '');
  const [swiftCode, setSwiftCode] = useState(profile?.swiftCode || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateProfile({
        ...profile, ownerName, ownerEmail, merchantBusinessName, crNumber, vatNumber, bankName, iban, swiftCode
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";
  const labelClass = "block text-sm font-semibold mb-2 text-slate-300";

  return (
    <div className="w-full" dir="rtl">
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* قسم المعلومات الشخصية */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">المعلومات الشخصية للمالك</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>اسم المستفيد المالي (المالك)</label>
              <input className={inputClass} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>البريد الإلكتروني المالي</label>
              <input type="email" className={inputClass} value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required dir="ltr" />
            </div>
          </div>
        </div>

        {/* قسم معلومات الشركة */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-white">بيانات المنشأة التجارية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>اسم المنشأة التجارية</label>
              <input className={inputClass} value={merchantBusinessName} onChange={(e) => setMerchantBusinessName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>رقم السجل التجاري (CR)</label>
              <input className={inputClass} value={crNumber} onChange={(e) => setCrNumber(e.target.value)} required dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>الرقم الضريبي (VAT)</label>
              <input className={inputClass} value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required dir="ltr" />
            </div>
          </div>
        </div>

        {/* قسم الحساب البنكي */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-white">بيانات الحساب البنكي</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>اسم البنك المعتمد للتحصيل</label>
              <input className={inputClass} value={bankName} onChange={(e) => setBankName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>رمز السويفت (SWIFT)</label>
              <input className={inputClass} value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} required dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>رقم الآيبان (IBAN)</label>
              <input className={inputClass} value={iban} onChange={(e) => setIban(e.target.value)} required dir="ltr" />
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
             {saveSuccess && (
              <span className="text-emerald-400 font-semibold text-sm flex items-center gap-2 bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20">
                ✅ تم حفظ البيانات بنجاح
              </span>
            )}
          </div>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> 
            {isSaving ? 'جاري الحفظ...' : 'حفظ وتحديث البيانات'}
          </button>
        </div>
      </form>
    </div>
  );
};
