import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { JobListings } from './components/JobListings';
import { OnlineInterviewRoom } from './components/OnlineInterviewRoom';
import { PaymentModal } from './components/PaymentModal';
import { InvoicesTab } from './components/InvoicesTab';
import { EmployerDashboard } from './components/EmployerDashboard';
import { InterviewSuiteTab } from './components/InterviewSuiteTab';
import { JobPostModal } from './components/JobPostModal';
import { ReminderModal } from './components/ReminderModal';
import { OwnerFinancialsModal } from './components/OwnerFinancialsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AIOperationsModal } from './components/AIOperationsModal';
import { FloatingSupportBot } from './components/FloatingSupportBot';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AdminAIAssistant } from './components/AdminAIAssistant';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { onAdminChange, googleSignIn, handleGoogleRedirectResult } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { INITIAL_JOBS, INITIAL_APPLICANTS, PACKAGES } from './data/mockData';
import { app, loadJobsFromCloud, loadApplicantsFromCloud } from './services/firebase';

function AppContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'jobs' | 'packages' | 'interviews' | 'employer' | 'billing'>('jobs');
  const [isCleanSlateActive, setIsCleanSlateActive] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Modals state
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isAIOperationsOpen, setIsAIOperationsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [packageForPayment, setPackageForPayment] = useState(PACKAGES[1]);

  useEffect(() => onAdminChange(setIsAdmin), []);
  useEffect(() => onAuthStateChanged(getAuth(app), (user) => setUserEmail(user?.email ?? null)), []);
  useEffect(() => { handleGoogleRedirectResult().catch(() => {}); }, []);

  useEffect(() => {
    (async () => {
      const cloudJobs = await loadJobsFromCloud();
      if (cloudJobs?.length > 0) { setJobs(cloudJobs); setIsCleanSlateActive(false); }
      setApplicants(await loadApplicantsFromCloud() || []);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <div className="w-full bg-slate-900 py-2 px-4 flex justify-center border-b border-slate-800">
        <LanguageSwitcher />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenJobPost={() => setIsJobPostModalOpen(true)} onOpenReminders={() => setIsReminderModalOpen(true)} onGoogleLogin={googleSignIn} userEmail={userEmail} remindersCount={0} onOpenOwnerFinancials={() => isAdmin ? setIsOwnerFinancialsOpen(true) : setIsLoginOpen(true)} ownerFinancials={{}} onOpenAIOperations={() => setIsAIOperationsOpen(true)} isCleanSlateActive={isCleanSlateActive} />

      {isAdmin && isCleanSlateActive && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2 text-xs flex justify-between items-center">
          <span className="text-emerald-400">{t.clean_slate}</span>
          <button onClick={() => { setJobs(INITIAL_JOBS); setApplicants(INITIAL_APPLICANTS); setIsCleanSlateActive(false); }} className="underline hover:text-white">{t.restore_demo}</button>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection onPostJobClick={() => setIsJobPostModalOpen(true)} onOpenInterviewRoom={() => {}} onExploreJobs={() => {}} />
            <JobListings jobs={jobs} onOpenInterviewRoomForJob={() => {}} onApplySuccess={() => {}} onPostJobClick={() => setIsJobPostModalOpen(true)} />
            <PackagesSection onSelectPackage={(pkg) => { setPackageForPayment(pkg); setIsPaymentModalOpen(true); }} />
          </>
        )}
        {activeTab === 'packages' && <PackagesSection onSelectPackage={(pkg) => { setPackageForPayment(pkg); setIsPaymentModalOpen(true); }} />}
        {activeTab === 'interviews' && <InterviewSuiteTab applicants={applicants} onLaunchLiveRoom={() => {}} onOpenReminder={() => {}} />}
        {activeTab === 'employer' && <EmployerDashboard jobs={jobs} applicants={applicants} onStartInterview={() => {}} onPostJob={() => {}} onOpenReminder={() => {}} />}
        {activeTab === 'billing' && <InvoicesTab />}
      </main>

      <Footer onNavigate={setActiveTab} />

      {isJobPostModalOpen && <JobPostModal onClose={() => setIsJobPostModalOpen(false)} onProceedToPayment={() => {}} />}
      {isPaymentModalOpen && <PaymentModal packageToBuy={packageForPayment} onClose={() => setIsPaymentModalOpen(false)} onPaymentSuccess={() => {}} />}
      {isReminderModalOpen && <ReminderModal onClose={() => setIsReminderModalOpen(false)} onSendReminder={() => {}} />}
      {isOwnerFinancialsOpen && <OwnerFinancialsModal isOpen={isOwnerFinancialsOpen} onClose={() => setIsOwnerFinancialsOpen(false)} profile={{}} payouts={[]} onUpdateProfile={() => {}} onRequestPayout={() => {}} />}
      {isLoginOpen && <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
      {isAIOperationsOpen && <AIOperationsModal isOpen={isAIOperationsOpen} onClose={() => setIsAIOperationsOpen(false)} campaigns={[]} supportTickets={[]} />}
      
      <FloatingSupportBot />
      {isAdmin && <AdminAIAssistant />}
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
