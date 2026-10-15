
import React from 'react';
import {
  Briefcase,
  Plus,
  Video,
  Receipt,
  Sparkles,
  Bell,
  Wallet,
  Bot,
  LogIn,
} from 'lucide-react';

import { OwnerFinancialProfile } from '../types';

interface NavbarProps {
  activeTab: 'jobs' | 'packages' | 'interviews' | 'employer' | 'billing';
  setActiveTab: (
    tab: 'jobs' | 'packages' | 'interviews' | 'employer' | 'billing'
  ) => void;
  onOpenJobPost: () => void;
  onOpenReminders: () => void;
  remindersCount: number;
  onOpenOwnerFinancials: () => void;
  ownerFinancials?: OwnerFinancialProfile;
  onOpenAIOperations: () => void;
  isCleanSlateActive?: boolean;
  onGoogleLogin?: () => void;
  userEmail?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenJobPost,
  onOpenReminders,
  remindersCount,
  onOpenOwnerFinancials,
  ownerFinancials,
  onOpenAIOperations,
  isCleanSlateActive,
  onGoogleLogin,
  userEmail,
}) => {
  return (<header className="sticky top-0 z-[100] bg-white/95 backdrop-blur border-b border-slate-200">     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 min-h-18 py-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">
              توظيف إكسبرتس <span className="text-xs text-indigo-600">TawtheefX</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            {([
              ['jobs', 'استكشاف الوظائف'],
              ['packages', 'باقات الإعلانات'],
              ['interviews', 'المقابلات الإلكترونية'],
              ['employer', 'لوحة جهة العمل'],
              ['billing', 'سجل الفواتير والمدفوعات'],
            ] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-1 border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {onGoogleLogin && (
              <button
                onClick={onGoogleLogin}
                className="px-3 py-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                {userEmail ? 'تم تسجيل الدخول' : 'دخول Google'}
              </button>
            )}

     <button
  type="button"
  onClick={onGoogleLogin}
  className="relative z-[101] pointer-events-auto touch-manipulation px-3 py-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1.5"
>
              title="مركز العمليات الذكي"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">وكيل العمليات الذكي</span>
            </button>

            <button
              onClick={onOpenOwnerFinancials}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-2"
              title="حساب المالك"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>حساب المالك</span>
            </button>

            <button
              onClick={onOpenReminders}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
              title="التذكيرات"
            >
              <Bell className="w-4 h-4" />
              {remindersCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>

            <button
              onClick={onOpenJobPost}
              className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>نشر وظيفة</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
