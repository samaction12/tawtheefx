import { JobPackage, JobListing, Applicant, InterviewQuestion, PaymentTransaction, InterviewReminder, OwnerFinancialProfile, PayoutRecord } from '../types';

export const PACKAGES: JobPackage[] = [
  {
    id: 'pkg-standard',
    name: 'Standard Package',
    priceSAR: 0, priceAED: 0, priceUSD: 19,
    description: 'Ideal for startups that need to post a job quickly and receive applications directly.',
    features: [
      '30-day active job posting',
      'Search engine visibility and candidate alerts',
      'Applicant Tracking System (ATS) dashboard',
      'Instant email notifications for every application',
      'Notify 500+ candidates globally'
    ],
    interviewSlots: 0, durationDays: 30, popular: false,
  },
  {
    id: 'pkg-pro-interview',
    name: 'Pro Hire Package',
    badge: 'Most Popular',
    priceSAR: 0, priceAED: 0, priceUSD: 49,
    description: 'Complete hiring solution with live and recorded digital video interviews.',
    features: [
      'Featured badge in search results',
      '15 encrypted HD digital video interview sessions',
      'Standard evaluation form with instant notes',
      'Secure recording and sharing with hiring committee',
      'Asynchronous video screening tool'
    ],
    interviewSlots: 15, durationDays: 45, popular: true,
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise Package',
    badge: 'For Large Teams',
    priceSAR: 0, priceAED: 0, priceUSD: 149,
    description: 'Unlimited package for HR departments with multiple interview rooms and dedicated support.',
    features: [
      'Unlimited monthly job postings',
      'Unlimited simultaneous video interview rooms',
      'Specialized interview question bank and custom evaluation forms',
      'Webhook integration with internal HRMS systems',
      'Dedicated account manager and 24/7 technical support'
    ],
    interviewSlots: 999, durationDays: 365, popular: false,
  }
];

export const INITIAL_JOBS: JobListing[] = [];
export const INITIAL_APPLICANTS: Applicant[] = [];
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [];
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];
export const INITIAL_REMINDERS: InterviewReminder[] = [];

export const INITIAL_OWNER_FINANCIALS: OwnerFinancialProfile = {
  ownerName: '', ownerEmail: '', merchantBusinessName: '', crNumber: '', vatNumber: '',
  bankName: '', iban: '', accountNumber: '', swiftCode: '',
  payoutSchedule: 'weekly', gatewayMode: 'live', merchantKeyId: '',
  totalEarningsSAR: 0, availableBalanceSAR: 0, totalPayoutsWithdrawnSAR: 0
};

export const INITIAL_PAYOUTS: PayoutRecord[] = [];
