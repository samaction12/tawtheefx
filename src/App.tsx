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
import { INITIAL_JOBS, INITIAL_APPLICANTS, PACKAGES, INITIAL_OWNER_FINANCIALS } from './data/mockData';
import { app, loadJobsFromCloud, syncApplicantToCloud, loadApplicantsFromCloud, loadTransactionsFromCloud, loadOwnerFinancialsFromCloud, loadMarketingCampaignsFromCloud, loadSupportTicketsFromCloud, loadSiteSettings } from './services/firebase';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();
  
  // States
  const [activeTab, setActiveTab] = useState<'jobs' | 'packages' | 'interviews' | 'employer' | 'billing'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ownerFinancials, setOwnerFinancials] = useState<any>(INITIAL_OWNER_FINANCIALS);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  
  // UI States
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isAIOperationsOpen, setIsAIOperationsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [packageForPayment, setPackageForPayment] = useState(PACKAGES[0]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  // Effects
  useEffect(() => onAdminChange(setIsAdmin), []);
  useEffect(() => onAuthStateChanged(getAuth(app), (user) => setUserEmail(user?.email ?? null)), []);
  useEffect(() => { handleGoogleRedirectResult().catch(() => {}); }, []);

  useEffect(() => {
    (async () => {
      const cloudJobs = await loadJobsFromCloud();
      if (cloudJobs?.length > 0) { setJobs(cloudJobs); }
      setApplicants(await loadApplicantsFromCloud() || []);
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setTransactions(await loadTransactionsFromCloud() || []);
      setOwnerFinancials({ ...INITIAL_OWNER_FINANCIALS, ...(await loadOwnerFinancialsFromCloud() || {}) });
      setCampaigns(await loadMarketingCampaignsFromCloud() || []);
      setSupportTickets(await loadSupportTicketsFromCloud() || []);
    })();
  }, [isAdmin]);

  // Handlers
  const handleOpenOwnerArea = () => isAdmin ? setIsOwnerFinancialsOpen(true) : setIsLoginOpen(true);
  const handleOpenPayment = (pkg: any) => { setPackageForPayment(pkg); setIsPaymentModalOpen(true); };
  const handlePaymentSuccess = () => { setIsPaymentModalOpen(false); showToast('Payment Successful!'); };
  const handleUpdateProfile = (updated: any) => { setOwnerFinancials(updated); showToast('Profile Updated'); };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {toastMessage && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl">{toastMessage}</div>}
      
      <div className="w-full bg-slate-900 py-2 px-4 flex justify-center"><LanguageSwitcher /></div>

      <Navbar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        onOpenJobPost={() => setIsJobPostModalOpen(true)} 
        onOpenReminders={() => setIsReminderModalOpen(true)} 
        onGoogleLogin={googleSignIn} 
        userEmail={userEmail} remindersCount={0} 
        onOpenOwnerFinancials={handleOpenOwnerArea} 
        onOpenAIOperations={() => setIsAIOperationsOpen(true)} 
      />

      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection onPostJobClick={() => setIsJobPostModalOpen(true)} onOpenInterviewRoom={() => {}} onExploreJobs={() => {}} />
            <JobListings jobs={jobs} onOpenInterviewRoomForJob={() => {}} onApplySuccess={() => {}} onPostJobClick={() => setIsJobPostModalOpen(true)} />
            <PackagesSection onSelectPackage={handleOpenPayment} />
          </>
        )}
        {activeTab === 'packages' && <PackagesSection onSelectPackage={handleOpenPayment} />}
        {activeTab === 'interviews' && <InterviewSuiteTab applicants={applicants} onLaunchLiveRoom={() => {}} onOpenReminder={() => {}} />}
        {activeTab === 'employer' && <EmployerDashboard jobs={jobs} applicants={applicants} onStartInterview={() => {}} onPostJob={() => {}} onOpenReminder={() => {}} />}
        {activeTab === 'billing' && <InvoicesTab transactions={transactions} ownerFinancials={ownerFinancials} onOpenOwnerFinancials={handleOpenOwnerArea} />}
      </main>

      <Footer onNavigate={setActiveTab} />

      {/* Modals */}
      {isJobPostModalOpen && <JobPostModal onClose={() => setIsJobPostModalOpen(false)} onProceedToPayment={() => {}} />}
      {isPaymentModalOpen && <PaymentModal packageToBuy={packageForPayment} onClose={() => setIsPaymentModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />}
      {isReminderModalOpen && <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} />}
      {isOwnerFinancialsOpen && <OwnerFinancialsModal isOpen={isOwnerFinancialsOpen} onClose={() => setIsOwnerFinancialsOpen(false)} profile={ownerFinancials} payouts={[]} onUpdateProfile={handleUpdateProfile} onRequestPayout={() => {}} />}
      {isLoginOpen && <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />}
      {isAIOperationsOpen && <AIOperationsModal isOpen={isAIOperationsOpen} onClose={() => setIsAIOperationsOpen(false)} campaigns={campaigns} supportTickets={supportTickets} />}
      
      <FloatingSupportBot />
      {isAdmin && <AdminAIAssistant />}
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
