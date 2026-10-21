import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export const AdminOrdersTab = ({ orders, onConfirmPayment }: { orders: any[], onConfirmPayment: (id: string) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">إدارة الطلبات والحوالات</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
          <p className="text-slate-500">لا توجد طلبات حالياً.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <tr>
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">العميل</th>
                <th className="p-4 font-bold">الباقة</th>
                <th className="p-4 font-bold">المبلغ</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs text-slate-500">{order.id.slice(0, 8)}...</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.company}</div>
                    <div className="text-xs text-slate-500">{order.email}</div>
                  </td>
                  <td className="p-4 text-slate-700">{order.packageName}</td>
                  <td className="p-4 font-bold text-slate-900">${order.total}</td>
                  <td className="p-4">
                    {order.status === 'awaiting_transfer' ? (
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit"><Clock className="w-3 h-3" /> بانتظار التحويل</span>
                    ) : order.status === 'paid' ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit"><CheckCircle2 className="w-3 h-3" /> مكتمل</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-lg w-fit"><XCircle className="w-3 h-3" /> {order.status}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {order.status === 'awaiting_transfer' && (
                      <button onClick={() => onConfirmPayment(order.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        تأكيد استلام المبلغ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
