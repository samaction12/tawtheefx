import { JobPackage, SeededJob, Applicant, InterviewQuestion, PaymentTransaction, InterviewReminder, OwnerFinancialProfile, PayoutRecord } from '../types';

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
export const INITIAL_JOBS: SeededJob[] = [
  {
    id: 'job-cloud-lead',
    titleKey: 'seed_job_cloud_lead_title',
    companyKey: 'seed_job_cloud_lead_company',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    locationKey: 'seed_job_cloud_lead_location',
    type: 'remote',
    departmentKey: 'seed_job_cloud_lead_department',
    salaryKey: 'seed_job_cloud_lead_salary',
    postedDateKey: 'seed_job_cloud_lead_posted',
    deadline: '2026-11-30',
    featured: true,
    requiresVideoInterview: true,
    descriptionKey: 'seed_job_cloud_lead_description',
    requirementKeys: ['seed_job_cloud_lead_req1', 'seed_job_cloud_lead_req2', 'seed_job_cloud_lead_req3'],
    benefitKeys: ['seed_job_cloud_lead_ben1', 'seed_job_cloud_lead_ben2', 'seed_job_cloud_lead_ben3'],
    applicantsCount: 18
  },
  {
    id: 'job-fullstack-ai',
    titleKey: 'seed_job_fullstack_ai_title',
    companyKey: 'seed_job_fullstack_ai_company',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    locationKey: 'seed_job_fullstack_ai_location',
    type: 'hybrid',
    departmentKey: 'seed_job_fullstack_ai_department',
    salaryKey: 'seed_job_fullstack_ai_salary',
    postedDateKey: 'seed_job_fullstack_ai_posted',
    deadline: '2026-12-15',
    featured: true,
    requiresVideoInterview: true,
    descriptionKey: 'seed_job_fullstack_ai_description',
    requirementKeys: ['seed_job_fullstack_ai_req1', 'seed_job_fullstack_ai_req2', 'seed_job_fullstack_ai_req3'],
    benefitKeys: ['seed_job_fullstack_ai_ben1', 'seed_job_fullstack_ai_ben2', 'seed_job_fullstack_ai_ben3'],
    applicantsCount: 24
  },
  {
    id: 'job-product-manager',
    titleKey: 'seed_job_product_manager_title',
    companyKey: 'seed_job_product_manager_company',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    locationKey: 'seed_job_product_manager_location',
    type: 'fulltime',
    departmentKey: 'seed_job_product_manager_department',
    salaryKey: 'seed_job_product_manager_salary',
    postedDateKey: 'seed_job_product_manager_posted',
    deadline: '2026-11-20',
    featured: false,
    requiresVideoInterview: true,
    descriptionKey: 'seed_job_product_manager_description',
    requirementKeys: ['seed_job_product_manager_req1', 'seed_job_product_manager_req2', 'seed_job_product_manager_req3'],
    benefitKeys: ['seed_job_product_manager_ben1', 'seed_job_product_manager_ben2', 'seed_job_product_manager_ben3'],
    applicantsCount: 12
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-sarah',
    name: 'سارة الشمري',
    email: 'sarah.alshammari@example.com',
    phone: '+966 50 123 4567',
    roleKey: 'seed_job_cloud_lead_title',
    experienceYears: 6,
    currentCompanyKey: 'seed_app_sarah_company',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    appliedDate: '2026-10-18',
    status: 'qualified',
    matchScore: 96,
    interviewScheduled: {
      date: '2026-10-22',
      time: '14:00',
      interviewType: 'live',
      roomCode: 'THAKI-ROOM-882'
    },
    interviewScores: {
      technical: 9.8,
      communication: 9.5,
      problemSolving: 9.6,
      culturalFit: 9.4,
      notesKey: 'seed_app_sarah_notes'
    }
  },
  {
    id: 'app-tariq',
    name: 'طارق عبد العزيز',
    email: 'tariq.aziz@example.com',
    phone: '+971 52 987 6543',
    roleKey: 'seed_job_fullstack_ai_title',
    experienceYears: 4,
    currentCompanyKey: 'seed_app_tariq_company',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    appliedDate: '2026-10-17',
    status: 'new',
    matchScore: 91
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'q1', questionKey: 'its_q1_question', category: 'technical', suggestedMinutes: 3 },
  { id: 'q2', questionKey: 'its_q2_question', category: 'behavioral', suggestedMinutes: 2 },
  { id: 'q3', questionKey: 'its_q3_question', category: 'technical', suggestedMinutes: 3 }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    invoiceNumber: 'INV-2026-001',
    date: '2026-10-19',
    customerName: 'فيصل المطيري',
    companyName: 'CloudFuture Technology',
    email: 'hr@cloudfuture.io',
    packageName: 'Pro Hire Package',
    packageId: 'pkg-pro-interview',
    amount: 49,
    currency: 'USD',
    vatAmount: 7.35,
    totalWithVat: 56.35,
    paymentMethod: 'visa',
    cardLast4: '4242',
    status: 'completed'
  }
];

export const INITIAL_REMINDERS: InterviewReminder[] = [];
export const INITIAL_OWNER_FINANCIALS: any = {};
export const INITIAL_PAYOUTS: PayoutRecord[] = [];

