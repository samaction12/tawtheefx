import React from 'react';
import { Briefcase, Package, Video, LogIn, Bell, Plus, LayoutDashboard, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenJobPost, onOpenReminders, onGoogleLogin, userEmail, remindersCount, onOpenOwnerFinancials }: any) => {
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
        
        {/* الصف الأول: اللوجو والأزرار الأساسية */}
        <div className="flex justify-between h-14 sm:h-16 items-center">
          
          {/* اللوجو */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('jobs')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="font-bold text-lg text-slate-900 hidden sm:block">ThakiHire</span>
          </div>

          {/* الأزرار اليسرى (في الواجهة العربية) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            <button onClick={onOpenJobPost} className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-800">
              <Plus className="w-4 h-4" />{t.nav_post_job}
            </button>
            
            <button onClick={onOpenReminders} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            
            <button onClick={onOpenOwnerFinancials} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
               <Wallet className="w-5 h-5" />
            </button>
            
            {userEmail ? (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full max-w-[80px] truncate">
                {userEmail.split('@')[0]}
              </span>
            ) : (
              <button onClick={onGoogleLogin} className="flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}
          </div>
        </div>

        {/* الصف الثاني: روابط التنقل (قابلة للسحب أفقياً) */}
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
