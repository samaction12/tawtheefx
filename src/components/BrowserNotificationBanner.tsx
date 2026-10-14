import React, { useEffect } from 'react';
import { X, Briefcase, Video, ExternalLink, Bell, Wallet } from 'lucide-react';
import { BrowserPushPayload } from '../services/notificationService';

interface BrowserNotificationBannerProps {
  notification: BrowserPushPayload | null;
  onClose: () => void;
}

export const BrowserNotificationBanner: React.FC<BrowserNotificationBannerProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <aside
      aria-label="تنبيه المتصفح"
      className="fixed top-20 left-6 z-60 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200/80 shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5"
    >
      <div className="flex items-start gap-3">
        {/* Icon based on notification type */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            notification.type === 'interview'
              ? 'bg-rose-50 text-rose-600'
              : notification.type === 'application'
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {notification.type === 'interview' ? (
            <Video className="w-5 h-5" />
          ) : notification.type === 'application' ? (
            <Briefcase className="w-5 h-5" />
          ) : (
            <Wallet className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-700">تنبيه المتصفح الفوري</span>
            <span className="font-mono tabular-nums">{notification.timestamp}</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {notification.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {notification.body}
          </p>

          {notification.onAction && (
            <div className="pt-2">
              <button
                onClick={() => {
                  notification.onAction?.();
                  onClose();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{notification.actionText || 'عرض التفاصيل'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md transition-colors"
          title="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
