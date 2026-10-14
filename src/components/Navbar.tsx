import React from 'react';
import { Briefcase, Plus, Video, Receipt, Sparkles, Bell, Wallet, Bot } from 'lucide-react';

import { OwnerFinancialProfile } from '../types';

interface NavbarProps {
  activeTab: 'jobs' | 'packages' | 'interviews' | 'employer' | 'billing';
  setActiveTab: (tab: 'jobs' | 'packages' | 'interviews' | 'employer' | 'billing') => void;
  onOpenJobPost: () => void;
  onOpenReminders: () => void;
  remindersCount: number;
  onOpenOwnerFinancials: () => void;
  ownerFinancials?: OwnerFinancialProfile;
  onOpenAIOperations: () => void;
  isCleanSlateActive?: boolean;
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
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setActiveTab('jobs')}
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              توظيف إكسبرتس <span className="text-xs text-indigo-600 font-medium">TawtheefX</span>
            </span>
          </button>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'jobs'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              استكشاف الوظائف
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'packages'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              باقات الإعلانات
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'interviews'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              المقابلات الإلكترونية
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'employer'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              لوحة جهة العمل
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'billing'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              سجل الفواتير والمدفوعات
            </button>
          </nav>

          {/* Zone 3: 1 primary action + owner financials + reminder alert trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AI Operations & Bot Hub Button */}
            <button
              onClick={onOpenAIOperations}
              className="px-2.5 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer group"
              title="مركز الذكاء الاصطناعي وإدارة العمليات (إعلانات تسويقية، حل المشكلات، إدارة السحابة)"
            >
              <div className="relative flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              </div>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] font-bold text-indigo-950">
                  وكيل العمليات الذكي
                </span>
                <span className="hidden sm:inline text-[9px] text-indigo-600 font-medium">
                  {isCleanSlateActive ? 'وضع الإنتاج النظيف' : 'مساعد ذكي'}
                </span>
              </div>
            </button>

            <button
              onClick={onOpenOwnerFinancials}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30 text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer group"
              title={`البيانات المالية للمالك مربوطة ببوابة الدفع (${ownerFinancials?.ownerEmail})`}
            >
              <div className="relative flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                  حساب المالك
                </span>
                {ownerFinancials && (
                  <span className="hidden sm:inline text-[9px] font-mono text-emerald-600 font-semibold tabular-nums">
                    {ownerFinancials.availableBalanceSAR.toLocaleString()} ر.س
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={onOpenReminders}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="تذكيرات المقابلات الإلكترونية (SMS / Email)"
            >
              <Bell className="w-4 h-4" />
              {remindersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            <button
              onClick={onOpenJobPost}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>نشر وظيفة جديدة</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

