import React, { useEffect, useState } from 'react';
import { authedFetch, adminSignOut } from '../services/auth';

interface Order { id: string; company: string; email: string; packageName: string; total: number; method: string; status: string; reference: string }
const LABEL: Record<string, string> = { awaiting_transfer: 'بانتظار الحوالة', pending_payment: 'بانتظار الدفع', paid: 'مدفوع' };

export const AdminToolsModal: React.FC<{ isOpen: boolean; onClose: () => void; onSaved: (announcement: string) => void }> = ({ isOpen, onClose, onSaved }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [msg, setMsg] = useState('');
  const load = async () => { const r = await authedFetch('/api/admin/orders'); if (r.ok) setOrders(await r.json()); };
  useEffect(() => { if (isOpen) load(); }, [isOpen]);
  if (!isOpen) return null;

  const confirm = async (id: string) => {
    if (!window.confirm('هل وصلت الحوالة فعلاً إلى حسابك البنكي؟')) return;
    const r = await authedFetch(`/api/admin/orders/${id}/confirm-transfer`, { method: 'POST', body: '{}' });
    setMsg(r.ok ? 'تم تأكيد الحوالة وإصدار الفاتورة.' : 'تعذّر التأكيد.'); load();
  };
  const suggest = async () => {
    setMsg('جارٍ إعداد مسودة...');
    const r = await authedFetch('/api/admin/ai/site_copy', { method: 'POST', body: JSON.stringify({ current: announcement }) });
    if (!r.ok) return setMsg('الوكيل الذكي غير متاح حالياً.');
    const d = await r.json(); setAnnouncement(d.announcement || ''); setMsg('هذه مسودة فقط؛ راجعها ثم اضغط حفظ.');
  };
  const save = async () => {
    const r = await authedFetch('/api/admin/site-settings', { method: 'POST', body: JSON.stringify({ announcement }) });
    if (r.ok) { onSaved(announcement.trim()); setMsg('تم النشر (مع حفظ نسخة سابقة للرجوع).'); } else setMsg('تعذّر الحفظ.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 my-6 space-y-5">
        <div className="flex justify-between items-center"><h3 className="font-bold">أدوات الإدارة</h3>
          <div className="flex gap-2"><button onClick={adminSignOut} className="text-xs underline">تسجيل الخروج</button><button onClick={onClose} className="text-xs border rounded px-2">إغلاق</button></div></div>
        {msg && <p className="text-xs bg-slate-100 rounded p-2" role="status">{msg}</p>}
        <section>
          <h4 className="text-sm font-bold mb-2">شريط الإعلان في الموقع</h4>
          <input className="w-full px-3 py-2 border rounded-lg text-sm" value={announcement} maxLength={200} onChange={(e) => setAnnouncement(e.target.value)} placeholder="اتركه فارغاً لإخفائه" />
          <div className="flex gap-2 mt-2"><button onClick={suggest} className="text-xs border rounded px-3 py-1.5">اقتراح بالذكاء الاصطناعي</button>
            <button onClick={save} className="text-xs bg-indigo-600 text-white rounded px-3 py-1.5">حفظ ونشر</button></div>
        </section>
        <section>
          <h4 className="text-sm font-bold mb-2">الطلبات والحوالات</h4>
          <div className="overflow-x-auto"><table className="w-full text-xs text-right">
            <thead><tr className="text-slate-500"><th className="p-1">المرجع</th><th>الشركة</th><th>الباقة</th><th>الإجمالي</th><th>الحالة</th><th /></tr></thead>
            <tbody>{orders.map((o) => (
              <tr key={o.id} className="border-t"><td className="p-1 font-mono">{o.reference}</td><td>{o.company}</td><td>{o.packageName}</td><td>{o.total}</td><td>{LABEL[o.status] || o.status}</td>
                <td>{o.status === 'awaiting_transfer' && <button onClick={() => confirm(o.id)} className="bg-emerald-600 text-white rounded px-2 py-1">تأكيد وصول الحوالة</button>}</td></tr>))}
            </tbody></table></div>
          {orders?.length === 0 && <p className="text-xs text-slate-500 mt-2">لا توجد طلبات بعد.</p>}
        </section>
      </div>
    </div>
  );
};
