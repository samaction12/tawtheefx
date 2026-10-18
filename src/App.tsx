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
import { AdminToolsModal } from './components/AdminToolsModal';
import { AIOperationsModal } from './components/AIOperationsModal';
import { FloatingSupportBot } from './components/FloatingSupportBot';
import { BrowserNotificationBanner } from './components/BrowserNotificationBanner';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AdminAIAssistant } from './components/AdminAIAssistant';
import { LanguageProvider } from './contexts/LanguageContext';
import { onAdminChange, googleSignIn, handleGoogleRedirectResult } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserPushPayload, dispatchBrowserNotification, playNotificationSound, requestBrowserNotificationPermission } from './services/notificationService';
import { INITIAL_JOBS, INITIAL_APPLICANTS, INITIAL_TRANSACTIONS, INITIAL_REMINDERS, INITIAL_OWNER_FINANCIALS, INITIAL_PAYOUTS, PACKAGES } from './data/mockData';
import { Currency, JobListing, JobPackage, Applicant, PaymentTransaction, InterviewReminder, OwnerFinancialProfile, PayoutRecord, MarketingCampaign, SupportTicket } from './types';
import { app, loadJobsFromCloud, syncApplicantToCloud, loadApplicantsFromCloud, loadTransactionsFromCloud, loadOwnerFinancialsFromCloud, loadMarketingCampaignsFromCloud, loadSupportTicketsFromCloud, loadSiteSettings } from './services/firebase';
import { CheckCircle2, Bot } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'packages' | 'interviews' | 'employer' | 'billing'>('jobs');
  const [isCleanSlateActive, setIsCleanSlateActive] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [reminders, setReminders] = useState<InterviewReminder[]>([]);
  const [ownerFinancials, setOwnerFinancials] = useState<OwnerFinancialProfile>(INITIAL_OWNER_FINANCIALS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [packageForPayment, setPackageForPayment] = useState<JobPackage>(PACKAGES[1]);
  const [currencyForPayment, setCurrencyForPayment] = useState<Currency>('USD');
  const [pendingJobPost, setPendingJobPost] = useState<Partial<JobListing> | null>(null);
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isInterviewRoomOpen, setIsInterviewRoomOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isAIOperationsOpen, setIsAIOperationsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [interviewCandidate, setInterviewCandidate] = useState<Applicant | undefined>(undefined);
  const [browserNotification, setBrowserNotification] = useState<BrowserPushPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };
  const openOwnerArea = () => (isAdmin ? setIsOwnerFinancialsOpen(true) : setIsLoginOpen(true));

  useEffect(() => onAdminChange(setIsAdmin), []);
  useEffect(() => onAuthStateChanged(getAuth(app), (user) => setUserEmail(user?.email ?? null)), []);
  useEffect(() => { handleGoogleRedirectResult().catch(() => {}); }, []);

  useEffect(() => {
    (async () => {
      const cloudJobs = await loadJobsFromCloud();
      if (cloudJobs?.length > 0) { setJobs(cloudJobs); setIsCleanSlateActive(false); }
      setAnnouncement((await loadSiteSettings())?.announcement || '');
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [apps, camps, tix, inv, owner] = await Promise.all([
        loadApplicantsFromCloud(), loadMarketingCampaignsFromCloud(), loadSupportTicketsFromCloud(), loadTransactionsFromCloud(), loadOwnerFinancialsFromCloud()
      ]);
      setApplicants(apps || []); setCampaigns(camps || []); setSupportTickets(tix || []);
      setTransactions(inv || []);
      setOwnerFinancials({ ...INITIAL_OWNER_FINANCIALS, ...(owner || {}) });
    })();
  }, [isAdmin]);

  const handleGoogleLogin = async () => { showToast('Signing in...'); try { await googleSignIn(); } catch (e: any) { showToast(e.message); } };
  
  const handleSelectPackage = (pkg: JobPackage, currency: Currency) => {
    setPackageForPayment(pkg); setCurrencyForPayment(currency); setPendingJobPost(null); setIsPaymentModalOpen(true);
  };
  const handleJobPostSubmit = (jobData: Partial<JobListing>, selectedPkg: JobPackage) => {
    setPendingJobPost(jobData); setPackageForPayment(selectedPkg); setCurrencyForPayment('USD'); setIsJobPostModalOpen(false); setIsPaymentModalOpen(true);
  };
  const handlePaymentSuccess = async () => { setPendingJobPost(null); setJobs(await loadJobsFromCloud() || []); showToast('Payment successful!'); };
  const handleRequestPayout = () => showToast('Payout requested.');
  const handleOpenInterviewRoom = (applicant?: Applicant) => { setInterviewCandidate(applicant || applicants?.[0]); setIsInterviewRoomOpen(true); };
  const handleSaveEvaluation = (candidateId: string, scores: any) => {
    setApplicants((prev) => prev.map((app) => app.id === candidateId ? { ...app, status: 'Interviewed', interviewScores: scores } : app));
    showToast('Evaluation saved');
  };
  const handleRestoreDemoData = () => { setJobs(INITIAL_JOBS); setApplicants(INITIAL_APPLICANTS); setIsCleanSlateActive(false); };
  const handleApplySuccess = async (jobId: string, data: any) => {
    const job = jobs.find((j) => j.id === jobId);
    const newApp: Applicant = { id: `app-${Date.now()}`, name: data.name || 'Candidate', email: data.email || 'email@test.com', phone: data.phone || '', role: job ? job.title : 'Applicant', experienceYears: 0, currentCompany: 'N/A', avatar: '', appliedDate: new Date().toISOString().split('T')[0], status: 'New', matchScore: 80 };
    setApplicants((prev) => [newApp, ...prev]);
    await syncApplicantToCloud(newApp);
    showToast('Application received');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {toastMessage && (<div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>{toastMessage}</span></div>)}
      
      <div className="w-full bg-slate-900 border-b border-slate-800 py-1.5 px-4 flex justify-end">
         <LanguageSwitcher />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenJobPost={() => setIsJobPostModalOpen(true)} onOpenReminders={() => setIsReminderModalOpen(true)} onGoogleLogin={handleGoogleLogin} userEmail={userEmail} remindersCount={reminders?.length || 0} onOpenOwnerFinancials={openOwnerArea} ownerFinancials={ownerFinancials} onOpenAIOperations={() => setIsAIOperationsOpen(true)} isCleanSlateActive={isCleanSlateActive} />

      {announcement && (<div className="bg-indigo-600 text-white text-center text-xs py-2">{announcement}</div>)}

      {isAdmin && isCleanSlateActive && (
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex justify-between items-center">
          <span className="text-emerald-300">Clean Slate Active: Data cleared.</span>
          <button onClick={handleRestoreDemoData} className="underline text-slate-400 hover:text-white">Restore Demo</button>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection onPostJobClick={() => setIsJobPostModalOpen(true)} onOpenInterviewRoom={() => handleOpenInterviewRoom()} onExploreJobs={() => document.getElementById('job-listings')?.scrollIntoView({ behavior: 'smooth' })} />
            <JobListings jobs={jobs} onOpenInterviewRoomForJob={(job) => handleOpenInterviewRoom(applicants?.find((a) => a.role === job.title) || applicants?.[0])} onApplySuccess={handleApplySuccess} onPostJobClick={() => setIsJobPostModalOpen(true)} />
            <PackagesSection onSelectPackage={handleSelectPackage} />
          </>
        )}
        {activeTab === 'packages' && (<PackagesSection onSelectPackage={handleSelectPackage} />)}
        {activeTab === 'interviews' && (<InterviewSuiteTab onLaunchLiveRoom={(app) => handleOpenInterviewRoom(app)} applicants={applicants} onOpenReminder={(app) => { if (app) setInterviewCandidate(app); setIsReminderModalOpen(true); }} />)}
        {activeTab === 'employer' && (<EmployerDashboard applicants={applicants} jobs={jobs} onStartInterview={(app) => handleOpenInterviewRoom(app)} onPostJob={() => setIsJobPostModalOpen(true)} onOpenReminder={(app) => { if (app) setInterviewCandidate(app); setIsReminderModalOpen(true); }} />)}
        {activeTab === 'billing' && (<InvoicesTab transactions={transactions} ownerFinancials={ownerFinancials} onOpenOwnerFinancials={openOwnerArea} />)}
      </main>

      <Footer onNavigate={setActiveTab} />

      {isJobPostModalOpen && (<JobPostModal onClose={() => setIsJobPostModalOpen(false)} onProceedToPayment={handleJobPostSubmit} />)}
      {isPaymentModalOpen && (<PaymentModal packageToBuy={packageForPayment} onClose={() => setIsPaymentModalOpen(false)} currency={currencyForPayment} pendingJob={pendingJobPost} onPaymentSuccess={handlePaymentSuccess} />)}
      {isInterviewRoomOpen && (<OnlineInterviewRoom isOpen={isInterviewRoomOpen} onClose={() => setIsInterviewRoomOpen(false)} candidate={interviewCandidate} onSaveEvaluation={handleSaveEvaluation} />)}
      {isReminderModalOpen && (<ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} candidate={interviewCandidate} onSendReminder={() => {}} />)}
      {isOwnerFinancialsOpen && (<OwnerFinancialsModal isOpen={isOwnerFinancialsOpen} onClose={() => setIsOwnerFinancialsOpen(false)} profile={ownerFinancials} payouts={[]} onUpdateProfile={(p) => { setOwnerFinancials(p); showToast('Saved!'); }} onRequestPayout={handleRequestPayout} />)}
      {isLoginOpen && (<AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />)}
      {isAIOperationsOpen && (<AIOperationsModal isOpen={isAIOperationsOpen} onClose={() => setIsAIOperationsOpen(false)} campaigns={campaigns} supportTickets={supportTickets} />)}
      
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
