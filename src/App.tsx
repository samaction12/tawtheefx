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
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PACKAGES, INITIAL_OWNER_FINANCIALS } from './data/mockData';
import { googleSignIn, handleGoogleRedirectResult, adminSignOut } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, syncOwnerFinancialsToCloud } from './services/firebase';
import { CheckCircle2 } from 'lucide-react';

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
  
  const [pkgForPayment, setPkgForPayment] = useState(PACKAGES[0]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleGoogleRedirectResult().catch((err) => {
      if (err.code !== 'auth/no-auth-event') console.error(err);
    });
  }, []);

  const handleJobPostSubmit = (jobData: any, selectedPkg: any) => {
    setIsJobPostOpen(false);
    setPkgForPayment(selectedPkg);
    setIsPaymentOpen(true);
  };

  // هنا بنحفظ البيانات في Firebase
  const handleUpdateProfile = async (updated: any) => {
    setOwnerFinancials(updated);
    try {
      await syncOwnerFinancialsToCloud(updated);
      showToast('تم حفظ البيانات بنجاح في السيرفر!');
    } catch (e) {
      console.error(e);
      showToast('تم الحفظ محلياً، لكن حدث خطأ في الاتصال بالسيرفر');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
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
        onOpenOwnerFinancials={() => setIsOwnerFinancialsOpen(true)} 
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
      
      {isJobPostOpen && (
        <JobPostModal 
          onClose={() => setIsJobPostOpen(false)} 
          onProceedToPayment={handleJobPostSubmit} 
        />
      )}

      {isOwnerFinancialsOpen && (
        <OwnerFinancialsModal 
          isOpen={isOwnerFinancialsOpen} 
          onClose={() => setIsOwnerFinancialsOpen(false)} 
          profile={ownerFinancials} 
          payouts={[]} 
          onUpdateProfile={handleUpdateProfile} 
          onRequestPayout={() => {}} 
        />
      )}

      {isPaymentOpen && (
        <PaymentModal 
          packageToBuy={pkgForPayment} 
          onClose={() => setIsPaymentOpen(false)} 
          onPaymentSuccess={() => {}} 
        />
      )}

      {isReminderOpen && (
        <ReminderModal 
          isOpen={isReminderOpen} 
          onClose={() => setIsReminderOpen(false)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
