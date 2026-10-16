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
import { onAdminChange, googleSignIn, handleGoogleRedirectResult } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AIOperationsModal } from './components/AIOperationsModal';
import { FloatingSupportBot } from './components/FloatingSupportBot';
import { BrowserNotificationBanner } from './components/BrowserNotificationBanner';
import { Footer } from './components/Footer';
import {
  BrowserPushPayload,
  dispatchBrowserNotification,
  playNotificationSound,
  requestBrowserNotificationPermission,
} from './services/notificationService';

import {
  INITIAL_JOBS,
  INITIAL_APPLICANTS,
  INITIAL_TRANSACTIONS,
  INITIAL_REMINDERS,
  INITIAL_OWNER_FINANCIALS,
  INITIAL_PAYOUTS,
  PACKAGES
} from './data/mockData';
import {
  Currency,
  JobListing,
  JobPackage,
  Applicant,
  PaymentTransaction,
  InterviewReminder,
  OwnerFinancialProfile,
  PayoutRecord,
  MarketingCampaign,
  SupportTicket
} from './types';
import {
  app,
  syncJobToCloud,
  loadJobsFromCloud,
  syncApplicantToCloud,
  loadApplicantsFromCloud,
  syncTransactionToCloud,
  loadTransactionsFromCloud,
  syncOwnerFinancialsToCloud,
  loadOwnerFinancialsFromCloud,
  syncMarketingCampaignToCloud,
  loadMarketingCampaignsFromCloud,
  syncSupportTicketToCloud,
  loadSupportTicketsFromCloud,
  testFirebaseConnection,
  loadSiteSettings
} from './services/firebase';
import { CheckCircle2, Video, CreditCard, Sparkles, Bell, Wallet, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'packages' | 'interviews' | 'employer' | 'billing'>('jobs');
  const [isCleanSlateActive, setIsCleanSlateActive] = useState<boolean>(true);

  // Data States
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [reminders, setReminders] = useState<InterviewReminder[]>([]);
  const [ownerFinancials, setOwnerFinancials] = useState<OwnerFinancialProfile>(INITIAL_OWNER_FINANCIALS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: 'mkt-sample-1',
      title: 'حملة إطلاق باقات المقابلات الرقمية (LinkedIn)',
      platform: 'linkedin',
      targetAudience: 'مدراء الموارد البشرية ومسؤولي التوظيف في الرياض وجدة',
      objective: 'packages_sales',
      adContent: `🚀 هل ما زلت تقضي أسابيع في فرز السير الذاتية وتنسيق المقابلات؟\n\nمع منصة توظيف إكسبرتس TawtheefX أعدنا ابتكار التوظيف الذكي في المملكة:\n✅ نشر الوظائف والوصول لآلاف المهنيين في دقائق.\n✅ قاعات فيديو رقمية مشفرة بدون تحميل تطبيقات.\n✅ تذكيرات آلية للمرشحين قبل الموعد بـ 60 دقيقة.\n✅ فواتير ضريبية فورية معتمدة وفق متطلبات ZATCA.`,
      suggestedVisualPrompt: 'لوحة قيادة توظيف حديثة بالألوان الكحلية والزمردية مع رسومات تفاعلية لكاميرا المقابلة',
      hashtags: ['#الموارد_البشرية', '#توظيف_السعودية', '#مقابلات_رقمية', '#رؤية_2030'],
      cta: 'اختر باقة التوظيف المناسبة واطلق إعلانك اليوم',
      status: 'نشطة',
      estimatedReach: '28,000 ظهور نوعي لمسؤولي HR',
      projectedRoi: '4.8x عوائد مبيعات باقات',
      createdAt: new Date().toISOString().split('T')[0]
    }
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt-init-1',
      userEmail: 'hr@advtech.sa',
      userName: 'سلطان القحطاني',
      userRole: 'شركة / صاحب عمل',
      issueCategory: 'interview_audio_video',
      message: 'الكاميرا لم تفتح في قاعة المقابلة أثناء اختبار الاتصال',
      aiSolution: `مرحباً سلطان، تم فحص الاتصال وتطبيق الحل التلقائي:\n1. تم إرشاد المتصفح لإعادة طلب أذونات الكاميرا والميكروفون بنجاح.\n2. تم التأكد من عدم استخدام الكاميرا بواسطة برامج أخرى (Zoom/Teams).\n3. قاعة المقابلة الآن جاهزة للبث عالي الدقة HD.`,
      status: 'تم الحل آلياً بواسطة البوت',
      diagnosticStepsTaken: ['فحص إذن الكاميرا بالمستعرض', 'التحقق من توفر مسار الصوت WebRTC', 'إعادة تهيئة مدخلات الأجهزة'],
      createdAt: 'اليوم، 10:15 صباحاً',
      resolvedAt: 'اليوم، 10:15 صباحاً'
    }
  ]);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [packageForPayment, setPackageForPayment] = useState<JobPackage>(PACKAGES[1]);
  const [currencyForPayment, setCurrencyForPayment] = useState<Currency>('SAR');
  const [pendingJobPost, setPendingJobPost] = useState<Partial<JobListing> | null>(null);

  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isInterviewRoomOpen, setIsInterviewRoomOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isOwnerFinancialsOpen, setIsOwnerFinancialsOpen] = useState(false);
  const [isAIOperationsOpen, setIsAIOperationsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminToolsOpen, setIsAdminToolsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [interviewCandidate, setInterviewCandidate] = useState<Applicant | undefined>(undefined);

  // Browser Notifications
  const [browserNotification, setBrowserNotification] = useState<BrowserPushPayload | null>(null);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openOwnerArea = () => (isAdmin ? setIsOwnerFinancialsOpen(true) : setIsLoginOpen(true));

  // ===== Google Login =====
  const handleGoogleLogin = async () => {
    showToast('جارٍ فتح تسجيل الدخول بجوجل...');
    try {
      await googleSignIn();
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showToast(`خطأ Google: ${error?.message || String(error)}`);
    }
  };

  // ===== Effects =====
  useEffect(() => onAdminChange(setIsAdmin), []);

  useEffect(() => {
    return onAuthStateChanged(getAuth(app), (user) => {
      setUserEmail(user?.email ?? null);
    });
  }, []);

  // Handle Google Redirect result
  useEffect(() => {
    handleGoogleRedirectResult()
      .then((result) => {
        if (result?.user) {
          showToast('تم تسجيل الدخول بجوجل بنجاح');
        }
      })
      .catch((err) => {
        console.error('Redirect result error:', err);
        if (err?.code !== 'auth/no-auth-event') {
          showToast(`خطأ في تسجيل الدخول: ${err?.message || err}`);
        }
      });
  }, []);

  // Public data + return from hosted card checkout
  useEffect(() => {
    (async () => {
      const cloudJobs = await loadJobsFromCloud();
      if (cloudJobs.length > 0) {
        setJobs(cloudJobs);
        setIsCleanSlateActive(false);
      }
      setAnnouncement((await loadSiteSettings())?.announcement || '');

      const orderId = new URLSearchParams(window.location.search).get('order');
      if (!orderId) return;

      window.history.replaceState({}, '', window.location.pathname);

      for (let i = 0; i < 10; i++) {
        const s = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`)
          .then((r) => r.json())
          .catch(() => null);

        if (s?.status === 'paid') {
          showToast('تم استلام الدفع بنجاح، شكراً لك!');
          setJobs(await loadJobsFromCloud());
          return;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      showToast('لم يصلنا تأكيد الدفع بعد؛ سيصلك إشعار على بريدك فور اكتماله.');
    })();
  }, []);

  // Private data only after admin login
  useEffect(() => {
    if (!isAdmin) return;

    (async () => {
      const [apps, camps, tix, inv, owner] = await Promise.all([
        loadApplicantsFromCloud(),
        loadMarketingCampaignsFromCloud(),
        loadSupportTicketsFromCloud(),
        loadTransactionsFromCloud(),
        loadOwnerFinancialsFromCloud()
      ]);

      setApplicants(apps);
      setCampaigns(camps);
      setSupportTickets(tix);
      setTransactions(
        inv.map((i: any) => ({
          ...i,
          id: i.orderId || i.id,
          companyName: i.customerName
        })) as PaymentTransaction[]
      );

      const earned = inv.reduce((n: number, i: any) => n + (i.amount || 0), 0);
      const base = owner || INITIAL_OWNER_FINANCIALS;
      setOwnerFinancials({
        ...base,
        totalEarningsSAR: earned,
        availableBalanceSAR: Math.max(0, earned - (base.totalPayoutsWithdrawnSAR || 0))
      });
    })();
  }, [isAdmin]);

  // ===== Helpers =====
  const triggerBrowserPush = (
    title: string,
    body: string,
    type: 'application' | 'interview' | 'payment',
    onAction?: () => void
  ) => {
    playNotificationSound();
    dispatchBrowserNotification(title, { body, onClick: onAction });

    const payload: BrowserPushPayload = {
      id: `push-${Date.now()}`,
      title,
      body,
      type,
      timestamp: 'الآن',
      actionText:
        type === 'interview'
          ? 'دخول قاعة المقابلة'
          : type === 'payment'
          ? 'عرض حساب المالك'
          : 'عرض المرشح',
      onAction
    };
    setBrowserNotification(payload);
  };

  const handleRequestBrowserPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      triggerBrowserPush(
        'تم تفعيل تنبيهات المتصفح بنجاح!',
        'ستتلقى إشعارات سطح المكتب الفورية فور تلقي أي طلب توظيف جديد أو حلول موعد مقابلة.',
        'application'
      );
    } else {
      showToast('يرجى السماح بالإشعارات من إعدادات المتصفح.');
    }
  };

  const handleSelectPackage = (pkg: JobPackage, currency: Currency) => {
    setPackageForPayment(pkg);
    setCurrencyForPayment(currency);
    setPendingJobPost(null);
    setIsPaymentModalOpen(true);
  };

  const handleJobPostSubmit = (jobData: Partial<JobListing>, selectedPkg: JobPackage) => {
    setPendingJobPost(jobData);
    setPackageForPayment(selectedPkg);
    setCurrencyForPayment('SAR');
    setIsJobPostModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleSendReminder = (reminder: InterviewReminder) => {
    setReminders((prev) => [reminder, ...prev]);
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === reminder.candidateId
          ? {
              ...app,
              interviewScheduled: app.interviewScheduled
                ? {
                    ...app.interviewScheduled,
                    reminderSent: true,
                    reminderSentAt: reminder.sentAt
                  }
                : undefined
            }
          : app
      )
    );

    triggerBrowserPush(
      `اقتراب موعد المقابلة: ${reminder.candidateName}`,
      `موعد المقابلة الرقمية بعد ساعة واحدة في القاعة (${reminder.roomCode}).`,
      'interview',
      () => {
        const app = applicants.find((a) => a.id === reminder.candidateId);
        handleOpenInterviewRoom(app);
      }
    );

    showToast(`تم إرسال تذكير المقابلة للمرشح ${reminder.candidateName}`);
  };

  const handlePaymentSuccess = async () => {
    setPendingJobPost(null);
    setJobs(await loadJobsFromCloud());
    showToast('تم تأكيد الدفع وإصدار الفاتورة.');
  };

  const handleRequestPayout = (_amount: number) => {
    showToast('تحويل الأرباح يتم من حسابك البنكي مباشرة.');
  };

  const handleApplySuccess = async (jobId: string, candidateData: any) => {
    const job = jobs.find((j) => j.id === jobId);
    const newApplicant: Applicant = {
      id: `app-${Date.now()}`,
      name: candidateData.name || 'مرشح جديد',
      email: candidateData.email || 'applicant@example.com',
      phone: candidateData.phone || '+966 50 000 0000',
      role: job ? job.title : 'متقدم وظيفي',
      experienceYears: 4,
      currentCompany: 'مستقل / باحث عن فرصة',
      avatar: '/src/assets/images/avatar_candidate_talent_1791989553197.jpg',
      appliedDate: new Date().toISOString().split('T')[0],
      status: job?.requiresVideoInterview ? 'مؤهل للمقابلة' : 'جديد',
      matchScore: Math.floor(85 + Math.random() * 12),
      resumeFileName: candidateData.resumeFileName,
      interviewScheduled: job?.requiresVideoInterview
        ? {
            date: 'غداً، 10:00 صباحاً',
            time: '30 دقيقة',
            interviewType: 'مباشر',
            roomCode: `TX-ROOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            reminderSent: false
          }
        : undefined
    };

    setApplicants((prev) => [newApplicant, ...prev]);
    await syncApplicantToCloud(newApplicant);

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    triggerBrowserPush(
      'طلب توظيف جديد وارد!',
      `تلقيت طلب تقديم من ${candidateData.name} لدور "${job ? job.title : 'شاغر'}".`,
      'application',
      () => setActiveTab('employer')
    );

    showToast(`تم استلام طلب تقديم ${candidateData.name}`);
  };

  const handleOpenInterviewRoom = (applicant?: Applicant) => {
    setInterviewCandidate(applicant || applicants[0]);
    setIsInterviewRoomOpen(true);
  };

  const handleSaveEvaluation = (candidateId: string, scores: any) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === candidateId
          ? { ...app, status: 'تمت المقابلة', interviewScores: scores }
          : app
      )
    );
    showToast('تم حفظ تقرير تقييم المقابلة بنجاح');
  };

  const handleCleanSlateLaunch = () => {
    setJobs([]);
    setApplicants([]);
    setIsCleanSlateActive(true);
    showToast('تم تفريغ البيانات للبدء النظيف');
  };

  const handleRestoreDemoData = () => {
    setJobs(INITIAL_JOBS);
    setApplicants(INITIAL_APPLICANTS);
    setReminders(INITIAL_REMINDERS);
    setIsCleanSlateActive(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenJobPost={() => setIsJobPostModalOpen(true)}
        onOpenReminders={() => setIsReminderModalOpen(true)}
        onGoogleLogin={handleGoogleLogin}
        userEmail={userEmail}
        remindersCount={reminders.length}
        onOpenOwnerFinancials={openOwnerArea}
        ownerFinancials={ownerFinancials}
        onOpenAIOperations={() => setIsAIOperationsOpen(true)}
        isCleanSlateActive={isCleanSlateActive}
      />

      {announcement && (
        <div className="bg-indigo-600 text-white text-center text-xs py-2 px-4">
          {announcement}
        </div>
      )}

      {/* Clean Slate Banner */}
      {isAdmin && isCleanSlateActive && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-4 py-2.5 text-xs border-b border-indigo-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-300">وضع الإطلاق النظيف مفعل:</span>
            <span className="text-slate-300">
              بيانات الوظائف والمرشحين مفرغة، وحساب المالك ({ownerFinancials.ownerEmail}) محمي.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIOperationsOpen(true)}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>إدارة الوكيل</span>
            </button>
            <button
              onClick={handleRestoreDemoData}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              عرض البيانات التجريبية
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection
              onPostJobClick={() => setIsJobPostModalOpen(true)}
              onOpenInterviewRoom={() => handleOpenInterviewRoom()}
              onExploreJobs={() => {
                document.getElementById('job-listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <JobListings
              jobs={jobs}
              onOpenInterviewRoomForJob={(job) => {
                const candidateForJob = applicants.find((a) => a.role === job.title) || applicants[0];
                handleOpenInterviewRoom(candidateForJob);
              }}
              onApplySuccess={handleApplySuccess}
              onPostJobClick={() => setIsJobPostModalOpen(true)}
            />
            <PackagesSection onSelectPackage={handleSelectPackage} />
          </>
        )}

        {activeTab === 'packages' && (
          <PackagesSection onSelectPackage={handleSelectPackage} />
        )}

        {activeTab === 'interviews' && (
          <InterviewSuiteTab
            onLaunchLiveRoom={(app) => handleOpenInterviewRoom(app)}
            applicants={applicants}
            onOpenReminder={(app) => {
              if (app) setInterviewCandidate(app);
              setIsReminderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'employer' && (
          <EmployerDashboard
            applicants={applicants}
            jobs={jobs}
            onStartInterview={(app) => handleOpenInterviewRoom(app)}
            onPostJob={() => setIsJobPostModalOpen(true)}
            onOpenReminder={(app) => {
              if (app) setInterviewCandidate(app);
              setIsReminderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'billing' && (
          <InvoicesTab
            transactions={transactions}
            ownerFinancials={ownerFinancials}
            onOpenOwnerFinancials={openOwnerArea}
          />
        )}
      </main>

      <Footer onNavigate={setActiveTab} />

      {/* Modals */}
      {isJobPostModalOpen && (
        <JobPostModal
          onClose={() => setIsJobPostModalOpen(false)}
          onProceedToPayment={handleJobPostSubmit}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          selectedPackage={packageForPayment}
          currency={currencyForPayment}
          pendingJob={pendingJobPost}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {isInterviewRoomOpen && (
        <OnlineInterviewRoom
          isOpen={isInterviewRoomOpen}
          onClose={() => setIsInterviewRoomOpen(false)}
          candidate={interviewCandidate}
          onSaveEvaluation={handleSaveEvaluation}
        />
      )}

      {isReminderModalOpen && (
        <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          candidate={interviewCandidate}
          onSendReminder={handleSendReminder}
        />
      )}

      {isOwnerFinancialsOpen && (
        <OwnerFinancialsModal
          isOpen={isOwnerFinancialsOpen}
          onClose={() => setIsOwnerFinancialsOpen(false)}
          financials={ownerFinancials}
          onRequestPayout={handleRequestPayout}
        />
      )}

      {isAdmin && isAdminToolsOpen && (
        <AdminToolsModal
          isOpen={isAdminToolsOpen}
          onClose={() => setIsAdminToolsOpen(false)}
        />
      )}

      {isLoginOpen && (
        <AdminLoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={() => setIsAdmin(true)}
        />
      )}

      {isAIOperationsOpen && (
        <AIOperationsModal
          isOpen={isAIOperationsOpen}
          onClose={() => setIsAIOperationsOpen(false)}
          campaigns={campaigns}
          supportTickets={supportTickets}
        />
      )}

      {browserNotification && (
        <BrowserNotificationBanner
          notification={browserNotification}
          onClose={() => setBrowserNotification(null)}
          onRequestPermission={handleRequestBrowserPermission}
          permission={browserPermission}
        />
      )}

      <FloatingSupportBot />
    </div>
  );
}
