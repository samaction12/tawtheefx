import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { JobListings } from './components/JobListings';
import { PaymentModal } from './components/PaymentModal';
import { ReminderModal } from './components/ReminderModal';
import { JobPostModal } from './components/JobPostModal';
import { OwnerFinancialsModal } from './components/OwnerFinancialsModal';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider } from './contexts/LanguageContext';
import { PACKAGES, INITIAL_OWNER_FINANCIALS } from './data/mockData';
import { googleSignIn, handleGoogleRedirectResult, adminSignOut } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, loadOwnerFinancialsFromCloud, syncOwnerFinancialsToCloud } from './services/firebase';
import { CheckCircle2, ShieldCheck, LogOut } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ownerFinancials, setOwnerFinancials] = useState<any>(INITIAL_OWNER_FINANCIALS);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isJobPostOpen, setIsJobPostOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [pkgForPayment, setPkgForPayment] = useState(PACKAGES[0]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  // التحقق من الرابط المخفي
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.search.includes('admin=true')) {
      setIsLoginOpen(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsubscribe();
  }, []);

  // تحميل بيانات المالك
  useEffect(() => {
    if (userEmail === 'janatamall559@gmail.com') {
      loadOwnerFinancialsFromCloud().then((data) => {
        if (data) setOwnerFinancials(data);
      }).catch(console.error);
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
      showToast('تم حفظ البيانات بنجاح في السيرفر!');
    } catch (e) {
      showToast('حدث خطأ في الحفظ');
    }
  };

  // لما الأدمن يسجل دخول، بنقفل شاشة الدخول، وبنفتح لوحة المالك
  const handleAdminLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsOwnerFinancialsOpen(true);
  };

  // --- لوحة تحكم المالك (صفحة كاملة) ---
  if (isOwnerFinancialsOpen) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">لوحة تحكم المالك - ThakiHire</h1>
          </div>
          <button 
            onClick={() => { adminSignOut(); setIsOwnerFinancialsOpen(false); window.location.href = '/'; }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </nav>
        <div className="p-8 max-w-7xl mx-auto">
          <OwnerFinancialsModal 
            isOpen={isOwnerFinancialsOpen} 
            onClose={() => {}} // مفيش إغلاق دلوقتي عشان هي صفحة كاملة
            profile={ownerFinancials} 
            payouts={[]} 
            onUpdateProfile={handleUpdateProfile} 
            onRequestPayout={() => {}} 
          />
        </div>
      </div>
    );
  }

  // --- الموقع العادي (للزوار) ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /><span>{toastMessage}</span>
        </div>
      )}
      
      <div className="w-full bg-slate-900 py-2 px-4 flex justify-center">
        <LanguageSwitcher />
      </div>
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenJobPost={() => setIsJobPostOpen(true)} 
        onOpenReminders={() => setIsReminderOpen(true)} 
        onGoogleLogin={() => googleSignIn().catch(console.error)} 
        onLogout={() => adminSignOut().then(() => showToast('تم تسجيل الخروج'))} 
        userEmail={userEmail} 
        remindersCount={0} 
      />
      
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
      
      {isLoginOpen && <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleAdminLoginSuccess} />}
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
