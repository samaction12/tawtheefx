import React from 'react';
import { Briefcase, Package, Video, LogIn, Bell, Plus, LayoutDashboard, Wallet, LogOut, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenJobPost, 
  onOpenReminders, 
  onGoogleLogin, 
  onLogout, 
  userEmail, 
  remindersCount = 0, 
  onOpenOwnerFinancials 
}: any) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'jobs', label: t.nav_jobs, icon: Briefcase },
    { id: 'packages', label: t.nav_packages, icon: Package },
    { id: 'interviews', label: t.nav_interviews, icon: Video },
    { id: 'employer', label: t.nav_admin, icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0 group select-none" 
            onClick={() => setActiveTab('jobs')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-slate-900 tracking-tight">ThakiHire</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 -mt-1 hidden sm:block">منصة التوظيف الذكية</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenJobPost} 
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t.nav_post_job}</span>
            </button>

            <button 
              onClick={onOpenReminders} 
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="المقابلات المجدولة"
            >
              <Bell className="w-4 h-4" />
              {remindersCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            <button 
              onClick={onOpenOwnerFinancials} 
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="المالية والعوائد"
            >
              <Wallet className="w-4 h-4" />
            </button>
            
            {userEmail ? (
              <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-xl px-2 py-1">
                <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate">
                  {userEmail.split('@')[0]}
                </span>
                <button 
                  onClick={onLogout} 
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" 
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onGoogleLogin} 
                className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.nav_login}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto items-center gap-2 pb-2.5 pt-1 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
