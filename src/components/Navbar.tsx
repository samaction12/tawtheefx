import React from 'react';
import { Briefcase, Package, Video, LogIn, Bell, Plus, LayoutDashboard, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenJobPost, onOpenReminders, onGoogleLogin, userEmail, remindersCount, onOpenOwnerFinancials, isCleanSlateActive }: any) => {
  const { t } = useLanguage();
  const navItems = [
    { id: 'jobs', label: t.nav_jobs, icon: Briefcase },
    { id: 'packages', label: t.nav_packages, icon: Package },
    { id: 'interviews', label: t.nav_interviews, icon: Video },
    { id: 'employer', label: t.nav_admin, icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('jobs')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="font-bold text-xl text-slate-900 hidden sm:block">ThakiHire</span>
          </div>

          {/* إزالة كلاس hidden md:flex عشان تظهر في الموبايل */}
          <div className="flex overflow-x-auto items-center gap-4 md:gap-8 px-4 scrollbar-hide">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === item.id ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 pb-1'}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={onOpenJobPost} className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
              <Plus className="w-4 h-4" />{t.nav_post_job}
            </button>
            <button onClick={onOpenReminders} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
              {remindersCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{remindersCount}</span>}
            </button>
            <button onClick={onOpenOwnerFinancials} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" title="Owner Dashboard">
               <Wallet className="w-5 h-5" />
            </button>
            {userEmail ? (
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full hidden sm:block">{userEmail.split('@')[0]}</span>
            ) : (
              <button onClick={onGoogleLogin} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" title={t.nav_login}><LogIn className="w-5 h-5" /></button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
