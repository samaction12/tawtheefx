import { JobPackage, JobListing, Applicant, InterviewQuestion, PaymentTransaction, InterviewReminder, OwnerFinancialProfile, PayoutRecord } from '../types';

export const PACKAGES: JobPackage[] = [
  {
    id: 'pkg-standard',
    name: 'Standard Package',
    priceSAR: 0, priceAED: 0, priceUSD: 19,
    description: 'Ideal for startups that need to post a job quickly and receive applications directly.',
    features: ['30-day active job posting', 'Search engine visibility', 'ATS dashboard', 'Email notifications', 'Reach 500+ global candidates'],
    interviewSlots: 0, durationDays: 30, popular: false,
  },
  {
    id: 'pkg-pro-interview',
    name: 'Pro Hire Package',
    badge: 'MOST POPULAR',
    priceSAR: 0, priceAED: 0, priceUSD: 49,
    description: 'Complete hiring solution with live and recorded digital video interviews.',
    features: ['Featured badge', '15 HD video interviews', 'Standard evaluation forms', 'Secure recording', 'Asynchronous screening'],
    interviewSlots: 15, durationDays: 45, popular: true,
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise Package',
    badge: 'FOR LARGE TEAMS',
    priceSAR: 0, priceAED: 0, priceUSD: 149,
    description: 'Unlimited power for global HR departments and agencies.',
    features: ['Unlimited job postings', 'Unlimited interview rooms', 'Custom HRMS integration', 'AI Candidate Matching', 'Dedicated manager'],
    interviewSlots: 999, durationDays: 365, popular: false,
  }
];
export const INITIAL_JOBS: JobListing[] = [];
export const INITIAL_APPLICANTS: Applicant[] = [];
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [];
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];
export const INITIAL_REMINDERS: InterviewReminder[] = [];
export const INITIAL_OWNER_FINANCIALS: OwnerFinancialProfile = {
  ownerName: '', ownerEmail: '', merchantBusinessName: '', crNumber: '', vatNumber: '', bankName: '', iban: '', accountNumber: '', swiftCode: '', payoutSchedule: 'weekly', gatewayMode: 'live', merchantKeyId: '', totalEarningsSAR: 0, availableBalanceSAR: 0, totalPayoutsWithdrawnSAR: 0
};
export const INITIAL_PAYOUTS: PayoutRecord[] = [];
