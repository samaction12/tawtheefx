import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { JobListings } from './components/JobListings';
import { PaymentModal } from './components/PaymentModal';
import { ReminderModal } from './components/ReminderModal';
import { JobPostModal } from './components/JobPostModal';
import { OwnerFinancialsModal } from './components/OwnerFinancialsModal';
import { AdminOrdersTab } from './components/AdminOrdersTab';
import { AdminAIAssistant } from './components/AdminAIAssistant';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider } from './contexts/LanguageContext';
import { PACKAGES, INITIAL_OWNER_FINANCIALS } from './data/mockData';
import { googleSignIn, handleGoogleRedirectResult, adminSignOut } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, loadOwnerFinancialsFromCloud, syncOwnerFinancialsToCloud, loadTransactionsFromCloud } from './services/firebase';
import { CheckCircle2, ShieldCheck, LogOut, Wallet, Briefcase, Users, MessageSquare, Bot, CreditCard } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ownerFinancials, setOwnerFinancials] = useState<any>(INITIAL_OWNER_FINANCIALS);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isJobPostOpen, setIsJobPostOpen] = useState(false);
  
  // حالة لوحة تحكم المالك
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminTab, setAdminTab] = useState<'financials' | 'orders' | 'jobs' | 'users' | 'messages' | 'ai'>('financials');

  const [pkgForPayment, setPkgForPayment] = useState(PACKAGES[0]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.search.includes('admin=true')) {
      setIsAdminRoute(true);
    }

    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setUserEmail(user?.email ?? null);
      if ((window.location.pathname === '/admin' || window.location.search.includes('admin=true')) && user?.email === 'janatamall559@gmail.com') {
        setIsOwnerFinancialsOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userEmail === 'janatamall559@gmail.com') {
      loadOwnerFinancialsFromCloud().then((data) => { if (data) setOwnerFinancials(data); }).catch(console.error);
      loadTransactionsFromCloud().then((data) => { if (data) setOrders(data); }).catch(console.error);
    }
  }, [userEmail]);

  useEffect(() => {
    handleGoogleRedirectResult().catch((err) => {
      if (err.code !== 'auth/no-auth-event') console.error(err);
    });
  }, []);

  const handleJobPostSubmit = (jobData: any, selectedPkg: any) => {
    setIsJobPostOpen(false); setPkgForPayment(selectedPkg); setIsPaymentOpen(true);
  };

  const handleUpdateProfile = async (updated: any) => {
    setOwnerFinancials(updated);
    try {
      await syncOwnerFinancialsToCloud(updated);
      showToast('تم حفظ البيانات بنجاح!');
    } catch (e) {
      showToast('حدث خطأ في الحفظ');
    }
  };

  const handleConfirmPayment = async (id: string) => {
    showToast(`تم تأكيد الطلب ${id.slice(0,8)}`);
  };

  // --- لوحة تحكم المالك (Full Page Dashboard) ---
  if (isOwnerFinancialsOpen) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex" dir="rtl">
        <aside className="w-64 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-8 text-white">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">لوحة الإدارة</h1>
          </div>
          
          <button onClick={() => setAdminTab('financials')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'financials' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Wallet className="w-5 h-5" /> البيانات المالية</button>
          <button onClick={() => setAdminTab('orders')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'orders' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><CreditCard className="w-5 h-5" /> الطلبات والمدفوعات</button>
          <button onClick={() => setAdminTab('jobs')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'jobs' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Briefcase className="w-5 h-5" /> إدارة الوظائف</button>
          <button onClick={() => setAdminTab('users')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Users className="w-5 h-5" /> إدارة المستخدمين</button>
          <button onClick={() => setAdminTab('messages')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'messages' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><MessageSquare className="w-5 h-5" /> صندوق الرسائل</button>
          <button onClick={() => setAdminTab('ai')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${adminTab === 'ai' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Bot className="w-5 h-5" /> مساعد المطور</button>

          <div className="mt-auto pt-6 border-t border-slate-800">
             <button onClick={() => { adminSignOut(); setIsOwnerFinancialsOpen(false); window.location.href = '/'; }} className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
          </div>
        </aside>

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {adminTab === 'financials' ? 'البيانات المالية' : 
               adminTab === 'orders' ? 'الطلبات والمدفوعات' :
               adminTab === 'jobs' ? 'إدارة الوظائف' : 
               adminTab === 'users' ? 'إدارة المستخدمين' :
               adminTab === 'messages' ? 'صندوق الرسائل' : 'مساعد المطور'}
            </h2>
          </header>

          <div className="bg-white rounded-2xl p-6 min-h-[500px]">
            {adminTab === 'financials' && <OwnerFinancialsModal isOpen={true} onClose={() => {}} profile={ownerFinancials} payouts={[]} onUpdateProfile={handleUpdateProfile} onRequestPayout={() => {}} />}
            {adminTab === 'orders' && <AdminOrdersTab orders={orders} onConfirmPayment={handleConfirmPayment} />}
            {adminTab === 'jobs' && <p className="text-center text-slate-500 py-20">قائمة الوظائف ستظهر هنا.</p>}
            {adminTab === 'users' && <p className="text-center text-slate-500 py-20">قائمة المستخدمين ستظهر هنا.</p>}
            {adminTab === 'messages' && <p className="text-center text-slate-500 py-20">صندوق الرسائل سيكون هنا.</p>}
            {adminTab === 'ai' && <AdminAIAssistant />}
          </div>
        </main>
      </div>
    );
  }

  // --- شاشة تسجيل دخول الأدمن ---
  if (isAdminRoute && !userEmail) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AdminLoginModal isOpen={true} onClose={() => window.location.href = '/'} onLoginSuccess={() => {}} />
      </div>
    );
  }

  // --- الموقع العادي للزوار ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span>{toastMessage}</span></div>
      )}
      <div className="w-full bg-slate-900 py-2 px-4 flex justify-center"><LanguageSwitcher /></div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenJobPost={() => setIsJobPostOpen(true)} onOpenReminders={() => setIsReminderOpen(true)} onGoogleLogin={() => googleSignIn().catch(console.error)} onLogout={() => adminSignOut().then(() => showToast('تم تسجيل الخروج'))} userEmail={userEmail} remindersCount={0} />
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection onPostJobClick={() => setIsJobPostOpen(true)} onOpenInterviewRoom={() => {}} onExploreJobs={() => {}} />
            <JobListings jobs={jobs} onOpenInterviewRoomForJob={() => {}} onApplySuccess={() => {}} onPostJobClick={() => setIsJobPostOpen(true)} />
            <PackagesSection onSelectPackage={(pkg) => { setPkgForPayment(pkg); setIsPaymentOpen(true); }} />
          </>
        )}
      </main>
      <Footer onNavigate={setActiveTab} />
      {isJobPostOpen && <JobPostModal onClose={() => setIsJobPostOpen(false)} onProceedToPayment={handleJobPostSubmit} />}
      {isPaymentOpen && <PaymentModal packageToBuy={pkgForPayment} onClose={() => setIsPaymentOpen(false)} onPaymentSuccess={() => {}} />}
      {isReminderOpen && <ReminderModal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} />}
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
