import React from 'react';
import { Briefcase, Package, Video, LogIn, Bell, Plus, LayoutDashboard, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenJobPost, onOpenReminders, onGoogleLogin, onLogout, userEmail, remindersCount }: any) => {
  const { t } = useLanguage();
  const navItems = [
    { id: 'jobs', label: t.nav_jobs, icon: Briefcase },
    { id: 'packages', label: t.nav_packages, icon: Package },
    { id: 'interviews', label: t.nav_interviews, icon: Video },
    { id: 'employer', label: t.nav_admin, icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('jobs')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="font-bold text-lg text-slate-900 hidden sm:block">ThakiHire</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={onOpenJobPost} className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-800">
              <Plus className="w-4 h-4" />{t.nav_post_job}
            </button>
            <button onClick={onOpenReminders} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            
            {userEmail ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 border border-slate-200 rounded-full pl-2 pr-1 py-1">
                <span className="text-xs font-bold text-indigo-700 max-w-[80px] truncate">
                  {userEmail.split('@')[0]}
                </span>
                <button onClick={onLogout} className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="تسجيل الخروج">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={onGoogleLogin} className="flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-2 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                <LogIn className="w-4 h-4" />
                <span className="inline">تسجيل الدخول</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex overflow-x-auto items-center gap-4 sm:gap-8 pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === item.id ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 pb-1'}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
