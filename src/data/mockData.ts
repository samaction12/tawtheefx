import {
  JobPackage,
  JobListing,
  Applicant,
  InterviewQuestion,
  PaymentTransaction,
  InterviewReminder,
  OwnerFinancialProfile,
  PayoutRecord
} from '../types';

export const PACKAGES: JobPackage[] = [
  {
    id: 'pkg-standard',
    name: 'باقة النشر القياسية (Standard)',
    priceSAR: 299,
    priceAED: 299,
    priceUSD: 79,
    description: 'مثالية للشركات الناشئة التي تبحث عن نشر إعلان وظيفي سريع واستقبال طلبات التوظيف مباشرة.',
    features: [
      'نشر إعلان وظيفي نشط لمدة 30 يوماً',
      'ظهور الإعلان في محرك البحث وتنبيهات المرشحين',
      'لوحة استلام وتصفية السير الذاتية (ATS)',
      'تنبيهات فورية عبر البريد الإلكتروني عند كل تقديم',
      'إشعار 500+ مرشح بمجال التخصص عبر النشرة الوظيفية'
    ],
    interviewSlots: 0,
    durationDays: 30,
    popular: false,
  },
  {
    id: 'pkg-pro-interview',
    name: 'باقة التميز والمقابلات الرقمية (Pro Hire)',
    badge: 'الأكثر اختياراً من الشركات',
    priceSAR: 699,
    priceAED: 699,
    priceUSD: 185,
    description: 'الحل الشامل لاستقطاب الكفاءات مع حزمة مقابلات وظيفية رقمية مباشرة ومسجلة مدعومة بنظام تقييم فوري.',
    features: [
      'تمييز الإعلان في صدارة نتائج البحث (Featured Badge)',
      '15 جلسة مقابلة فيديو رقمية مشفرة بتقنية HD',
      'نموذج تقييم معياري وملاحظات فورية أثناء المقابلة',
      'تسجيل المقابلات ومشاركتها مع لجنة التوظيف بأمان',
      'أداة المقابلات المسجلة آلياً (Asynchronous Video Screening)',
      'فواتير ضريبية فورية معتمدة'
    ],
    interviewSlots: 15,
    durationDays: 45,
    popular: true,
  },
  {
    id: 'pkg-enterprise',
    name: 'باقة الشركات والمؤسسات (Enterprise)',
    badge: 'للفرق والشركات الكبرى',
    priceSAR: 1890,
    priceAED: 1890,
    priceUSD: 499,
    description: 'باقة غير محدودة لإدارات الموارد البشرية مع غرف مقابلات متعددة، ربط مخصص، ودعم فني مخصص.',
    features: [
      'نشر إعلانات وظيفية غير محدودة شهرياً',
      'غرف مقابلات فيديو إلكترونية غير محدودة ومتزامنة',
      'بنك أسئلة مقابلات تخصصي ونماذج تقييم مخصصة لكل إدارة',
      'ربط السير الذاتية وأنظمة الـ HRMS الداخلية عبر Webhook',
      'مدير حساب مخصص ودعم تقني على مدار الساعة',
      'عقد تجاري وفاتورة ضريبية سنوية مع تسهيلات دفع'
    ],
    interviewSlots: 999,
    durationDays: 365,
    popular: false,
  }
];

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-1',
    title: 'مهندس أول حلول سحابية وبرمجيات (Senior Cloud Engineer)',
    company: 'شركة حلول التقنية المتقدمة',
    location: 'الرياض، المملكة العربية السعودية (هجين)',
    type: 'دوام كامل',
    department: 'الهندسة والتقنية',
    salary: '22,000 - 28,000 ر.س / شهرياً',
    postedDate: 'منذ يومين',
    deadline: '2026-11-15',
    featured: true,
    requiresVideoInterview: true,
    description: 'نبحث عن مهندس سحابي أول لقيادة بنية السحابة وإدارة حلول Kubernetes وTerraform مع ضمان أعلى معايير الأمان والاعتمادية لمشاريعنا التحولية الكبرى.',
    requirements: [
      'خبرة لا تقل عن 5 سنوات في هندسة الحلول السحابية (AWS / GCP / Azure)',
      'إتقان إدارة الحاويات Kubernetes وDocker وCI/CD Pipelines',
      'معرفة متقدمة في البنية ككود (Terraform / Ansible)',
      'مهارات تواصل قيادية وإمكانية إجراء مقابلة فيديو تقنية مباشرة'
    ],
    benefits: [
      'تأمين صحي VIP للموظف وعائلته',
      'مكافأة سنوية مرتبطة بالأداء',
      'مرونة في العمل الهجين (يومان عن بعد أسبوعياً)',
      'ميزانية سنوية للتطوير والشهادات الاحترافية'
    ],
    applicantsCount: 24
  },
  {
    id: 'job-2',
    title: 'مدير منتج رقمي أول (Senior Product Manager)',
    company: 'منصة فنتك الابتكار المالي',
    location: 'الرياض، السعودية',
    type: 'دوام كامل',
    department: 'إدارة المنتجات',
    salary: '25,000 - 32,000 ر.س / شهرياً',
    postedDate: 'منذ 4 أيام',
    deadline: '2026-11-20',
    featured: true,
    requiresVideoInterview: true,
    description: 'قيادة خارطة طريق وتطوير تجربة الدفع الإلكتروني والخدمات المصرفية المفتوحة بالتعاون مع فرق التصميم والبيانات والامتثال المالي.',
    requirements: [
      'خبرة سابقة في قطاع الفنتك أو بوابات الدفع الإلكترونية في الخليج',
      'فهم عميق لتحليل البيانات وسلوك المستخدم (A/B Testing, Cohorts)',
      'مهارات عالية في صياغة متطلبات المنتج (PRD) وإدارة ميثودولوجيا Agile'
    ],
    benefits: [
      'حوافز وخيارات أسهم للموظفين (ESOP)',
      'بدل سكن وتأمين صحي شامل',
      'بيئة عمل رائدة ومحفزة على الابتكار السريع'
    ],
    applicantsCount: 31
  },
  {
    id: 'job-3',
    title: 'أخصائي استقطاب مواهب وتوظيف رقمي (Talent Acquisition Specialist)',
    company: 'مجموعة الاستثمار القابضة',
    location: 'دبي، الإمارات العربية المتحدة',
    type: 'هجين',
    department: 'الموارد البشرية',
    salary: '16,000 - 20,000 د.إ / شهرياً',
    postedDate: 'منذ 5 أيام',
    deadline: '2026-11-10',
    featured: false,
    requiresVideoInterview: true,
    description: 'إدارة دورة التوظيف الكاملة للوظائف التقنية والقيادية، وتنسيق مقابلات الفيديو عبر المنصة، وبناء شراكات مع أفضل الكفاءات في المنطقة.',
    requirements: [
      'خبرة لا تقل عن 3 سنوات في التوظيف الاحترافي واستخدام أدوات ATS',
      'إجادة إجراء مقابلات الكفاءات القائمة على السلوك (Behavioral Interviews)',
      'إتقان اللغتين العربية والإنجليزية بطلاقة'
    ],
    benefits: [
      'تذاكر سفر سنوية وتأمين صحي عائلي',
      'مكافآت توظيف ربع سنوية'
    ],
    applicantsCount: 42
  },
  {
    id: 'job-4',
    title: 'مطور واجهات أمامية وتجربة مستخدم (Frontend / React Lead)',
    company: 'استوديو نكست الرقمي',
    location: 'عن بُعد (عالمي أو الشرق الأوسط)',
    type: 'عن بُعد',
    department: 'الهندسة والتقنية',
    salary: '18,000 - 23,000 ر.س / شهرياً',
    postedDate: 'منذ أسبوع',
    deadline: '2026-11-25',
    featured: true,
    requiresVideoInterview: true,
    description: 'بناء واجهات ويب تفاعلية فائقة السرعة باستخدام React وTypeScript وTailwind مع التركيز على سهولة الوصول والتصميم الراقي.',
    requirements: [
      'إتقان React, Next.js, TypeScript, Tailwind CSS',
      'خبرة في تحسين أداء الواجهات وCore Web Vitals',
      'معرض أعمال ملموس ومشاريع مفتوحة المصدر أو تطبيقات حية'
    ],
    benefits: [
      'عمل عن بعد 100% وبمرونة كاملة لساعات العمل',
      'بدل معدات مكتبية ومصروف إنترنت',
      'إجازات سنوية مدفوعة 30 يوماً'
    ],
    applicantsCount: 58
  },
  {
    id: 'job-5',
    title: 'مدير حسابات مالية ومحاسب قانوني (Senior Financial Controller)',
    company: 'شركة الديار للتطوير العقاري',
    location: 'جدة، المملكة العربية السعودية',
    type: 'دوام كامل',
    department: 'المالية والمحاسبة',
    salary: '20,000 - 26,000 ر.س / شهرياً',
    postedDate: 'منذ أسبوع',
    deadline: '2026-11-30',
    featured: false,
    requiresVideoInterview: false,
    description: 'إدارة التقارير المالية وضريبة القيمة المضافة (ZATCA) والميزانيات التقديرية بالتعاون مع المراجعين الخارجيين والداخليين.',
    requirements: [
      'شهادة SOCPA أو CMA أو CPA معتمدة',
      'خبرة سابقة في أنظمة الفاتورة الإلكترونية والأنظمة المحاسبية ERP (Oracle / SAP)',
      'إلمام شامل بالأنظمة واللوائح الضريبية السعودية'
    ],
    benefits: [
      'بدل نقل وسكن وبونص أداء سنوي',
      'تغطية تأمين صحي شاملة'
    ],
    applicantsCount: 19
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    name: 'سارة عبد الله الشمري',
    email: 'sarah.alshammari@example.com',
    phone: '+966 50 123 4567',
    role: 'مهندس أول حلول سحابية وبرمجيات',
    experienceYears: 6,
    currentCompany: 'التقنية الموحدة للاتصالات',
    avatar: '/src/assets/images/avatar_candidate_talent_1791989553197.jpg',
    appliedDate: '2026-10-12',
    status: 'مؤهل للمقابلة',
    matchScore: 94,
    resumeFileName: 'CV_Sarah_Alshammari_2026.pdf',
    interviewScheduled: {
      date: 'اليوم، 11:30 صباحاً',
      time: '30 دقيقة',
      interviewType: 'مباشر',
      roomCode: 'TX-ROOM-8821',
      reminderSent: true,
      reminderSentAt: '10:30 صباحاً (قبل المقابلة بـ 60 دقيقة)'
    },
    interviewScores: {
      technical: 5,
      communication: 4,
      problemSolving: 5,
      culturalFit: 4,
      notes: 'مرشحة متميزة جداً في بنية AWS وKubernetes، لغة إنجليزية ممتازة، لديها خبرة عالية في أتمتة الـ CI/CD.'
    }
  },
  {
    id: 'app-2',
    name: 'عمر فهد القحطاني',
    email: 'omar.alqahtani@example.com',
    phone: '+966 54 987 6543',
    role: 'مدير منتج رقمي أول',
    experienceYears: 7,
    currentCompany: 'بوابة الدفع الخليجية',
    avatar: '/src/assets/images/avatar_hr_director_1791989553498.jpg',
    appliedDate: '2026-10-11',
    status: 'تمت المقابلة',
    matchScore: 91,
    resumeFileName: 'CV_Omar_Fintech_Product.pdf',
    interviewScheduled: {
      date: 'أمس، 02:00 مساءً',
      time: '45 دقيقة',
      interviewType: 'مباشر',
      roomCode: 'TX-ROOM-4412'
    },
    interviewScores: {
      technical: 4,
      communication: 5,
      problemSolving: 4,
      culturalFit: 5,
      notes: 'رؤية استراتيجية واضحة في منتجات الفنتك والالتزام بضوابط البنك المركزي السعودي SAMA.'
    }
  },
  {
    id: 'app-3',
    name: 'م. أحمد خالد النجار',
    email: 'ahmed.elnaggar@example.com',
    phone: '+971 50 882 1199',
    role: 'مطور واجهات أمامية وتجربة مستخدم',
    experienceYears: 5,
    currentCompany: 'Tech Innovators FZ',
    avatar: '/src/assets/images/avatar_candidate_talent_1791989553197.jpg',
    appliedDate: '2026-10-13',
    status: 'جديد',
    matchScore: 88,
    resumeFileName: 'Resume_Ahmed_Frontend.pdf'
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    question: 'حدثنا عن مشروع تقني معقد قدته أو شاركت فيه وما هي القرارات المعمارية التي اتخذتها؟',
    category: 'تقني',
    suggestedDuration: '4 دقائق'
  },
  {
    id: 'q2',
    question: 'كيف تتعامل مع تغيير مفاجئ في أولويات متطلبات العمل قبل موعد الإطلاق بأيام؟',
    category: 'سلوكي',
    suggestedDuration: '3 دقائق'
  },
  {
    id: 'q3',
    question: 'ما هي معاييرك لضمان جودة الأداء وأمان البيانات في الخدمات التي تبنيها؟',
    category: 'تقني',
    suggestedDuration: '4 دقائق'
  },
  {
    id: 'q4',
    question: 'كيف توفق بين وجهات النظر المختلفة داخل فريق متعدد التخصصات عند وجود خلاف فني؟',
    category: 'قيادي',
    suggestedDuration: '3 دقائق'
  },
  {
    id: 'q5',
    question: 'ما الذي يجعلك مهتماً بالانضمام لفريقنا وما هي القيمة المضافة التي تسعى لتحقيقها في أول 90 يوماً؟',
    category: 'عام',
    suggestedDuration: '3 دقائق'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];

export const INITIAL_REMINDERS: InterviewReminder[] = [
  {
    id: 'rem-101',
    candidateId: 'app-1',
    candidateName: 'سارة عبد الله الشمري',
    candidatePhone: '+966 50 123 4567',
    candidateEmail: 'sarah.alshammari@example.com',
    jobTitle: 'مهندس أول حلول سحابية وبرمجيات',
    companyName: 'شركة حلول التقنية المتقدمة',
    roomCode: 'TX-ROOM-8821',
    scheduledTime: 'اليوم في تمام 11:30 صباحاً',
    channel: 'both',
    status: 'تم الإرسال (قبل المقابلة بساعة)',
    sentAt: 'اليوم، 10:30 صباحاً',
    smsMessage: 'تذكير من منصة TawtheefX: موعد مقابلتك الوظيفية مع شركة حلول التقنية بعد ساعة واحدة (11:30 ص). رابط الدخول لقاعة المقابلة: https://tawtheefx.sa/room/TX-ROOM-8821. نرجو تجهيز الكاميرا والميكروفون.',
    emailSubject: 'تذكير: موعد مقابلتك الوظيفية الرقمية بعد ساعة واحدة - شركة حلول التقنية المتقدمة',
    emailPreview: 'عزيزتي سارة، نود تذكيرك بأن موعد مقابلتك الوظيفية لدور مهندس أول حلول سحابية سيبدأ بعد ساعة واحدة في تمام الساعة 11:30 صباحاً. يمكنك النقر على الرابط التالي لاختبار الكاميرا والصوت ودخول القاعة المشفرة مباشرة.'
  }
];

export const INITIAL_OWNER_FINANCIALS: OwnerFinancialProfile = {
  ownerName: '', ownerEmail: '', merchantBusinessName: '', crNumber: '', vatNumber: '', bankName: '', iban: '', accountNumber: '',
  swiftCode: '', payoutSchedule: 'weekly', gatewayMode: 'live', merchantKeyId: '',
  totalEarningsSAR: 0, availableBalanceSAR: 0, totalPayoutsWithdrawnSAR: 0
};

export const INITIAL_PAYOUTS: PayoutRecord[] = [];


