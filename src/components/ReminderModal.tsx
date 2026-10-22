import React from 'react';
import { X, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ReminderModal = ({ isOpen, onClose }: any) => {
  const { t, dir } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4" dir={dir} onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-600"/> {t.reminder_title}</h3>
          <button type="button" onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-700" /></button>
        </div>
        <div className="text-center py-8"><p className="text-slate-500 text-sm">{t.reminder_empty}</p></div>
        <button onClick={onClose} className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold">{t.modal_close}</button>
      </div>
    </div>
  );
};
