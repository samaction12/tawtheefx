import type { TranslationKey } from './locales/translations';

export type Currency = 'USD';

export interface JobPackage {
  id: string;
  name: string;
  badge?: string;
  priceSAR: number;
  priceAED: number;
  priceUSD: number;
  description: string;
  features: string[];
  interviewSlots: number;
  durationDays: number;
  popular?: boolean;
}

/** Neutral identifiers for the employment type (labels live in the dictionaries). */
export type JobType = 'fulltime' | 'remote' | 'hybrid' | 'contract';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: JobType;
  department: string;
  salary: string;
  postedDate: string;
  deadline: string;
  featured: boolean;
  requiresVideoInterview: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  applicantsCount: number;
}

/**
 * Seeded job entries keep their copy as translation keys so the data layer
 * stays language neutral; `localizeJob` resolves them into a `JobListing`.
 */
export interface SeededJob {
  id: string;
  titleKey: TranslationKey;
  companyKey: TranslationKey;
  companyLogo?: string;
  locationKey: TranslationKey;
  type: JobType;
  departmentKey: TranslationKey;
  salaryKey: TranslationKey;
  postedDateKey: TranslationKey;
  deadline: string;
  featured: boolean;
  requiresVideoInterview: boolean;
  descriptionKey: TranslationKey;
  requirementKeys: TranslationKey[];
  benefitKeys: TranslationKey[];
  applicantsCount: number;
}

/** Neutral identifiers for the candidate pipeline stages. */
export type ApplicantStatus = 'new' | 'qualified' | 'interviewed' | 'accepted' | 'rejected';

/** Neutral identifiers for the interview format. */
export type InterviewType = 'live' | 'recorded';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Key of the localized role title stored in the translation dictionaries. */
  roleKey: TranslationKey;
  experienceYears: number;
  /** Key of the localized previous employer stored in the translation dictionaries. */
  currentCompanyKey: TranslationKey;
  avatar: string;
  appliedDate: string;
  status: ApplicantStatus;
  matchScore: number;
  resumeFileName?: string;
  interviewScheduled?: {
    date: string;
    time: string;
    interviewType: InterviewType;
    roomCode: string;
    reminderSent?: boolean;
    reminderSentAt?: string;
  };
  interviewScores?: {
    technical: number;
    communication: number;
    problemSolving: number;
    culturalFit: number;
    /** Key of the localized evaluator notes stored in the translation dictionaries. */
    notesKey: TranslationKey;
  };
}

export interface InterviewReminder {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePhone: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  roomCode: string;
  scheduledTime: string;
  channel: 'both' | 'sms' | 'email';
  status: 'تم الإرسال (قبل المقابلة بساعة)' | 'مجدول للإرسال' | 'تم التسليم';
  sentAt: string;
  smsMessage: string;
  emailSubject: string;
  emailPreview: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  companyName: string;
  email: string;
  packageName: string;
  packageId: string;
  amount: number;
  currency: 'USD';
  vatAmount: number;
  totalWithVat: number;
  paymentMethod: 'mada' | 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  cardLast4?: string;
  status: 'completed' | 'processing' | 'refunded';
  receiptUrl?: string;
}

export type InterviewCategory = 'general' | 'technical' | 'behavioral' | 'leadership';

export interface InterviewQuestion {
  id: string;
  /** Key of the localized question text stored in the translation dictionaries. */
  questionKey: TranslationKey;
  category: InterviewCategory;
  suggestedMinutes: number;
}

export interface OwnerFinancialProfile {
  ownerName: string;
  ownerEmail: string;
  merchantBusinessName: string;
  crNumber: string;
  vatNumber: string;
  bankName: string;
  iban: string;
  accountNumber: string;
  swiftCode: string;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  gatewayMode: 'live' | 'sandbox';
  merchantKeyId: string;
  totalEarningsSAR: number;
  availableBalanceSAR: number;
  totalPayoutsWithdrawnSAR: number;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amountSAR: number;
  bankName: string;
  ibanMasked: string;
  referenceNumber: string;
  status: 'تم التحويل لحسابك' | 'قيد المعالجة السريعة' | 'مكتمل';
}

export interface MarketingCampaign {
  id: string;
  title: string;
  platform: 'x' | 'linkedin' | 'instagram' | 'google_ads';
  targetAudience: string;
  objective: 'packages_sales' | 'enterprise_lead' | 'job_promotion' | 'brand_awareness';
  adContent: string;
  suggestedVisualPrompt?: string;
  hashtags: string[];
  cta: string;
  status: 'مسودة' | 'نشطة' | 'مجدولة';
  estimatedReach: string;
  projectedRoi: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  userRole: 'مرشح وظيفي' | 'شركة / صاحب عمل' | 'زائر';
  issueCategory: 'payment' | 'interview_audio_video' | 'job_post' | 'refund' | 'general';
  issueType?: 'payment' | 'interview_audio_video' | 'job_post' | 'refund' | 'general';
  message: string;
  aiSolution: string;
  status: 'تم الحل آلياً بواسطة البوت' | 'تم التصعيد لمالك المنصة' | 'قيد المتابعة';
  diagnosticStepsTaken?: string[];
  createdAt: string;
  resolvedAt?: string;
}

