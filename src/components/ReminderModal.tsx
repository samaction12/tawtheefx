import React from 'react';
import { X, Bell } from 'lucide-react';

export const ReminderModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4" dir="ltr">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-600"/> Notifications</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="text-center py-8"><p className="text-slate-500 text-sm">No new notifications at this time.</p></div>
        <button onClick={onClose} className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold">Close</button>
      </div>
    </div>
  );
};
