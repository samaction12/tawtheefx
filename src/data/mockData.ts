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
export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-cloud-lead',
    title: 'مهندس أول حلول سحابية وDevOps',
    company: 'سحابة المستقبل للتقنية (CloudFuture)',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'الرياض / عن بُعد (Global)',
    type: 'عن بُعد',
    department: 'الهندسة والتقنية',
    salary: '$6,500 - $8,500 / شهرياً',
    postedDate: 'منذ يومين',
    deadline: '2026-11-30',
    featured: true,
    requiresVideoInterview: true,
    description: 'قيادة تصميم وتوسيع البنية التحتية السحابية الموزعة بالاعتماد على Kubernetes وAWS وTerraform مع تطبيق أعلى معايير الأمان.',
    requirements: ['خبرة 5+ سنوات في بنية السحابة وإدارة الحاويات', 'معرفة متقدمة في CI/CD وأتمتة النشر', 'إتقان مراقبة النظم وحل المشكلات المعقدة'],
    benefits: ['عمل مرن عن بُعد 100%', 'تأمين طبي عائلي متميز', 'ميزانية سنوية للأجهزة والتعليم'],
    applicantsCount: 18
  },
  {
    id: 'job-fullstack-ai',
    title: 'مطور واجهات ومصمم نظم React & AI',
    company: 'نيكسوس للحلول الذكية (Nexus AI)',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    location: 'دبي / هجين',
    type: 'هجين',
    department: 'الهندسة والتقنية',
    salary: '$5,000 - $7,000 / شهرياً',
    postedDate: 'منذ 4 أيام',
    deadline: '2026-12-15',
    featured: true,
    requiresVideoInterview: true,
    description: 'تطوير تجارب مستخدم تفاعلية من الجيل الجديد ودمج واجهات برمجية ونماذج الذكاء الاصطناعي التوليدي.',
    requirements: ['إتقان React 19، TypeScript وTailwind CSS', 'خبرة في ربط واجهات LLMs وتقنيات البث الصوتي/المرئي', 'شغف بتصميم واجهات جذابة وسلسة'],
    benefits: ['مكافآت أداء ربع سنوية', 'بدل سفر وتنقل', 'ساعات عمل مرنة'],
    applicantsCount: 24
  },
  {
    id: 'job-product-manager',
    title: 'مدير منتجات رقمية أول (Senior PM)',
    company: 'فينتك المبتكرة (InnoFintech)',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    location: 'الرياض، السعودية',
    type: 'دوام كامل',
    department: 'المنتج والتصميم',
    salary: '$7,000 - $9,500 / شهرياً',
    postedDate: 'منذ 5 أيام',
    deadline: '2026-11-20',
    featured: false,
    requiresVideoInterview: true,
    description: 'قيادة استراتيجية المنتجات المالية وتوجيه فرق التطوير والتسويق لتقديم حلول دفع متطورة وسلسة.',
    requirements: ['خبرة 4+ سنوات في قيادة المنتجات في قطاع Fintech أو SaaS', 'مهارات استثنائية في تحليل البيانات واختبارات A/B', 'قدرة قيادية وتواصل ممتاز'],
    benefits: ['حوافز ملكية وأسهم', 'تغطية طبية شاملة', 'إجازات سنوية مدفوعة 30 يوماً'],
    applicantsCount: 12
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-sarah',
    name: 'سارة الشمري',
    email: 'sarah.alshammari@example.com',
    phone: '+966 50 123 4567',
    role: 'مهندس أول حلول سحابية وDevOps',
    experienceYears: 6,
    currentCompany: 'التقنية الموحدة للاتصالات',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    appliedDate: '2026-10-18',
    status: 'مؤهل للمقابلة',
    matchScore: 96,
    interviewScheduled: {
      date: '2026-10-22',
      time: '14:00',
      interviewType: 'مباشر',
      roomCode: 'THAKI-ROOM-882'
    },
    interviewScores: {
      technical: 9.8,
      communication: 9.5,
      problemSolving: 9.6,
      culturalFit: 9.4,
      notes: 'مرشحة متميزة للغاية، فهم عميق لمعمارية السحابة وأسلوب تواصل قيادي راقٍ.'
    }
  },
  {
    id: 'app-tariq',
    name: 'طارق عبد العزيز',
    email: 'tariq.aziz@example.com',
    phone: '+971 52 987 6543',
    role: 'مطور واجهات ومصمم نظم React & AI',
    experienceYears: 4,
    currentCompany: 'ديجيتال ماتريكس',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    appliedDate: '2026-10-17',
    status: 'جديد',
    matchScore: 91
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'q1', question: 'حدثنا عن أعقد مشروع بنيته وما التحديات المعمارية التي واجهتك؟', category: 'تقني', suggestedDuration: '3 دقائق' },
  { id: 'q2', question: 'كيف تدير تضارب الأولويات والمواعيد الضيقة بين أصحاب المصلحة؟', category: 'سلوكي', suggestedDuration: '2 دقيقة' },
  { id: 'q3', question: 'صف موقفاً قمت فيه بتحسين أداء تطبيق بنسبة ملحوظة وما الأدوات المستعملة؟', category: 'تقني', suggestedDuration: '3 دقائق' }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    invoiceNumber: 'INV-2026-001',
    date: '2026-10-19',
    customerName: 'فيصل المطيري',
    companyName: 'سحابة المستقبل للتقنية',
    email: 'hr@cloudfuture.io',
    packageName: 'باقة التميز والمقابلات الرقمية (Pro Hire)',
    packageId: 'pkg-pro-interview',
    amount: 49,
    currency: 'USD',
    vatAmount: 7.35,
    totalWithVat: 56.35,
    paymentMethod: 'visa',
    cardLast4: '4242',
    status: 'مكتمل'
  }
];

export const INITIAL_REMINDERS: InterviewReminder[] = [];
export const INITIAL_OWNER_FINANCIALS: OwnerFinancialProfile = {
  ownerName: '',
  ownerEmail: '',
  merchantBusinessName: '',
  crNumber: '',
  vatNumber: '',
  bankName: '',
  iban: '',
  accountNumber: '',
  swiftCode: '',
  payoutSchedule: 'weekly',
  gatewayMode: 'live',
  merchantKeyId: '',
  totalEarningsSAR: 0,
  availableBalanceSAR: 0,
  totalPayoutsWithdrawnSAR: 0
};
export const INITIAL_PAYOUTS: PayoutRecord[] = [];

