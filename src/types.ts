export type Currency = 'SAR' | 'AED' | 'USD';

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

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'دوام كامل' | 'عن بُعد' | 'هجين' | 'عقد';
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

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experienceYears: number;
  currentCompany: string;
  avatar: string;
  appliedDate: string;
  status: 'جديد' | 'مؤهل للمقابلة' | 'تمت المقابلة' | 'مقبول' | 'مرفوض';
  matchScore: number;
  resumeFileName?: string;
  interviewScheduled?: {
    date: string;
    time: string;
    interviewType: 'مباشر' | 'مسجل مسبقاً';
    roomCode: string;
    reminderSent?: boolean;
    reminderSentAt?: string;
  };
  interviewScores?: {
    technical: number;
    communication: number;
    problemSolving: number;
    culturalFit: number;
    notes: string;
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
  currency: Currency;
  vatAmount: number;
  totalWithVat: number;
  paymentMethod: 'mada' | 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  cardLast4?: string;
  status: 'مكتمل' | 'قيد المعالجة' | 'مسترجع';
  receiptUrl?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'عام' | 'تقني' | 'سلوكي' | 'قيادي';
  suggestedDuration: string;
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

