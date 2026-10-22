import React, { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { JobListing, JobPackage } from '../types';
import { PACKAGES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { getPackageCopy } from '../locales/packages';

export const JobPostModal = ({ onClose, onProceedToPayment }: any) => {
  const { t, dir } = useLanguage();
  const [formData, setFormData] = useState({ title: '', company: '', location: '', type: 'fulltime', salary: '', description: '', requirements: '' });
  const [selectedPkg, setSelectedPkg] = useState<JobPackage>(PACKAGES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqArray = formData.requirements.split('\n').filter(r => r.trim() !== '');
    onProceedToPayment({ ...formData, requirements: reqArray.length > 0 ? reqArray : [t.post_default_requirement], requiresVideoInterview: selectedPkg.id !== 'pkg-standard' }, selectedPkg);
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto" dir={dir}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-bold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-600" /> {t.post_title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">{t.post_field_title}</label><input className={inputClass} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
            <div><label className="block text-sm font-bold mb-1">{t.post_field_company}</label><input className={inputClass} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required /></div>
            <div><label className="block text-sm font-bold mb-1">{t.post_field_location}</label><input className={inputClass} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required /></div>
            <div><label className="block text-sm font-bold mb-1">{t.post_field_type}</label><select className={inputClass} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="fulltime">{t.post_type_fulltime}</option><option value="remote">{t.post_type_remote}</option><option value="hybrid">{t.post_type_hybrid}</option><option value="contract">{t.post_type_contract}</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">{t.post_field_salary}</label><input className={inputClass} value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">{t.post_field_description}</label><textarea className={`${inputClass} h-24 resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">{t.post_field_requirements}</label><textarea className={`${inputClass} h-24 resize-none`} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} required /></div>
          </div>
          <div className="border-t pt-6">
            <h4 className="font-bold mb-4">{t.post_choose_package}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACKAGES.map(pkg => (
                <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPkg.id === pkg.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>
                  <h5 className="font-bold text-slate-900">{getPackageCopy(pkg.id, t)?.name || pkg.name}</h5>
                  <div className="text-2xl font-extrabold text-indigo-600 mt-2">${(pkg?.priceUSD || 0)}</div>
                  <p className="text-xs text-slate-500 mt-2">لمدة {pkg.durationDays} يوم</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-6"><button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg w-full md:w-auto">{t.post_submit}</button></div>
        </form>
      </div>
    </div>
  );
};
