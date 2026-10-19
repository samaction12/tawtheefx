import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { JobListings } from './components/JobListings';
import { PaymentModal } from './components/PaymentModal';
import { ReminderModal } from './components/ReminderModal';
import { JobPostModal } from './components/JobPostModal';
import { OwnerFinancialsModal } from './components/OwnerFinancialsModal';
import { EmployerDashboard } from './components/EmployerDashboard';
import { OnlineInterviewRoom } from './components/OnlineInterviewRoom';
import { FloatingSupportBot } from './components/FloatingSupportBot';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PACKAGES, INITIAL_OWNER_FINANCIALS, INITIAL_JOBS, INITIAL_APPLICANTS } from './data/mockData';
import { JobListing, Applicant } from './types';
import { googleSignIn, handleGoogleRedirectResult, adminSignOut } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './services/firebase';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ownerFinancials, setOwnerFinancials] = useState<any>(INITIAL_OWNER_FINANCIALS);
  
  // States for Modals & Interactive Rooms
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isJobPostOpen, setIsJobPostOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isInterviewRoomOpen, setIsInterviewRoomOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);
  
  const [pkgForPayment, setPkgForPayment] = useState(PACKAGES[0]);

  const showToast = (msg: string) => { 
    setToastMessage(msg); 
    setTimeout(() => setToastMessage(null), 4000); 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setUserEmail(user?.email  ?  null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleGoogleRedirectResult().catch((err) => {
      if (err.code !== 'auth/no-auth-event') console.error(err);
    });
  }, []);

  const handleJobPostSubmit = (jobData: Partial<JobListing>, selectedPkg: any) => {
    const newJob: JobListing = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'وظيفة جديدة',
      company: jobData.company || 'شركة عالمية',
      location: jobData.location || 'عن بُعد',
      type: jobData.type || 'دوام كامل',
      department: jobData.department || 'الهندسة والتقنية',
      salary: jobData.salary || 'Competitive',
      postedDate: 'الآن',
      deadline: jobData.deadline || '2026-12-31',
      featured: selectedPkg?.popular || false,
      requiresVideoInterview: jobData.requiresVideoInterview  ?  true,
      description: jobData.description || '',
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      applicantsCount: 0,
      ...jobData,
    };
    setJobs((prev) => [newJob, ...prev]);
    setIsJobPostOpen(false);
    setPkgForPayment(selectedPkg);
    setIsPaymentOpen(true);
    showToast('تم حفظ مسودة الوظيفة بنجاح، جاري المتابعة للدفع والتفعيل');
  };

  const handleOpenInterview = (candidate?: Applicant) => {
    setSelectedCandidate(candidate || applicants[0] || null);
    setIsInterviewRoomOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Language Switcher */}
      <div className="w-full bg-slate-950 py-1.5 px-4 flex justify-between items-center text-xs text-slate-400 border-b border-slate-800">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>منظومة التوظيف الرقمية العالمية الموثقة v2.5</span>
        </div>
        <div className="mx-auto sm:mx-0">
          <LanguageSwitcher />
        </div>
      </div>
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenJobPost={() => setIsJobPostOpen(true)} 
        onOpenReminders={() => setIsReminderOpen(true)} 
        onGoogleLogin={() => googleSignIn().catch(console.error)} 
        onLogout={() => adminSignOut().then(() => showToast('تم تسجيل الخروج بنجاح'))} 
        userEmail={userEmail} 
        remindersCount={0} 
        onOpenOwnerFinancials={() => setIsOwnerFinancialsOpen(true)} 
      />
      
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection 
              onPostJobClick={() => setIsJobPostOpen(true)} 
              onOpenInterviewRoom={() => handleOpenInterview()} 
              onExploreJobs={() => {
                const el = document.getElementById('job-listings');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />
            <JobListings 
              jobs={jobs} 
              onOpenInterviewRoomForJob={() => handleOpenInterview()} 
              onApplySuccess={() => showToast('تم إرسال طلب تقديمك بنجاح!')} 
              onPostJobClick={() => setIsJobPostOpen(true)} 
            />
            <PackagesSection 
              onSelectPackage={(pkg) => { 
                setPkgForPayment(pkg); 
                setIsPaymentOpen(true); 
              }} 
            />
          </>
        )}

        {activeTab === 'packages' && (
          <PackagesSection 
            onSelectPackage={(pkg) => { 
              setPkgForPayment(pkg); 
              setIsPaymentOpen(true); 
            }} 
          />
        )}

        {activeTab === 'interviews' && (
          <div className="py-12 bg-slate-900 min-h-[700px] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <OnlineInterviewRoom 
                candidate={selectedCandidate || applicants[0]} 
                onClose={() => setActiveTab('jobs')} 
                onSaveEvaluation={() => {
                  showToast('تم حفظ تقرير المقابلة وتقييم المرشح بنجاح!');
                  setActiveTab('jobs');
                }} 
              />
            </div>
          </div>
        )}

        {activeTab === 'employer' && (
          <EmployerDashboard 
            applicants={applicants}
            jobs={jobs}
            onStartInterview={(cand) => handleOpenInterview(cand)}
            onPostJob={() => setIsJobPostOpen(true)}
            onOpenReminder={() => setIsReminderOpen(true)}
          />
        )}
      </main>
      
      <Footer onNavigate={setActiveTab} />
      <FloatingSupportBot />
      
      {/* --- Modals --- */}
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
          onUpdateProfile={(updated: any) => { 
            setOwnerFinancials(updated); 
            showToast('تم حفظ البيانات المالية بنجاح!'); 
          }} 
          onRequestPayout={() => showToast('تم رفع طلب السحب للمعالجة السريعة')} 
        />
      )}

      {isPaymentOpen && (
        <PaymentModal 
          packageToBuy={pkgForPayment} 
          onClose={() => setIsPaymentOpen(false)} 
          onPaymentSuccess={() => {
            setIsPaymentOpen(false);
            showToast('تمت عملية الدفع بنجاح وتفعيل الباقة!');
          }} 
        />
      )}

      {isReminderOpen && (
        <ReminderModal 
          isOpen={isReminderOpen} 
          onClose={() => setIsReminderOpen(false)} 
        />
      )}

      {isInterviewRoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
            <OnlineInterviewRoom 
              candidate={selectedCandidate || applicants[0]} 
              onClose={() => setIsInterviewRoomOpen(false)} 
              onSaveEvaluation={() => {
                showToast('تم حفظ تقييم المقابلة بنجاح!');
                setIsInterviewRoomOpen(false);
              }} 
            />
          </div>
        </div>
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
