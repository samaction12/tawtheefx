import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { JobListings } from './components/JobListings';
import { PaymentModal } from './components/PaymentModal';
import { ReminderModal } from './components/ReminderModal';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PACKAGES } from './data/mockData';

function AppContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [pkgForPayment, setPkgForPayment] = useState(PACKAGES[0]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="w-full bg-slate-900 py-2 px-4 flex justify-center"><LanguageSwitcher /></div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenJobPost={() => {}} onOpenReminders={() => setIsReminderOpen(true)} onGoogleLogin={() => {}} userEmail={null} remindersCount={0} onOpenOwnerFinancials={() => {}} onOpenAIOperations={() => {}} isCleanSlateActive={false} />
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <>
            <HeroSection onPostJobClick={() => {}} onOpenInterviewRoom={() => {}} onExploreJobs={() => {}} />
            <JobListings jobs={jobs} onOpenInterviewRoomForJob={() => {}} onApplySuccess={() => {}} onPostJobClick={() => {}} />
            <PackagesSection onSelectPackage={(pkg) => { setPkgForPayment(pkg); setIsPaymentOpen(true); }} />
          </>
        )}
      </main>
      <Footer onNavigate={setActiveTab} />
      <PaymentModal packageToBuy={pkgForPayment} onClose={() => setIsPaymentOpen(false)} onPaymentSuccess={() => {}} />
      <ReminderModal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} />
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}
