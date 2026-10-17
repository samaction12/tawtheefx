import React, { useState } from 'react';
import {
  Video,
  Clock,
  Sparkles,
  Play,
  Calendar,
  CheckCircle2,
  FileCheck,
  Star,
  Users,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';
import { Applicant } from '../types';
import { INTERVIEW_QUESTIONS } from '../data/mockData';

interface InterviewSuiteTabProps {
  onLaunchLiveRoom: (applicant?: Applicant) => void;
  applicants: Applicant[];
  onOpenReminder: (applicant?: Applicant) => void;
}

export const InterviewSuiteTab: React.FC<InterviewSuiteTabProps> = ({
  onLaunchLiveRoom,
  applicants,
  onOpenReminder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingAsyncVideo, setPlayingAsyncVideo] = useState(false);

  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold tracking-wide">
              <span>منظومة المقابلات الوظيفية الرقمية</span>
              <span>·</span>
              <span>تذكيرات SMS وبريد إلكتروني آلية قبل ساعة</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              حلول المقابلات الإلكترونية المباشرة والمسجلة
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              أجرِ مقابلات فيديو مشفرة، قيّم المهارات بنماذج معيارية، وفعل نظام التذكير التلقائي للمرشحين.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => onOpenReminder()}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>إرسال ومعاينة التذكيرات</span>
            </button>

            <button
              onClick={() => onLaunchLiveRoom()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span>فتح غرفة المقابلة الافتراضية</span>
            </button>
          </div>
        </div>

        {/* Feature Hero Card: Live Interview Room Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>غرف مقابلات فيديو فائقة الأمان (1080p HD)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              تجربة مقابلة تفاعلية متكاملة دون الحاجة لتحميل أي برامج
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              يدخل المُحاور والمرشح مباشرة عبر رابط متصفح مشفر، مع أدوات تقييم معيارية فورية (Technical, Communication, Culture Fit)، تدوين الملاحظات المتزامنة، ومؤقت دقيق لضمان عدالة المقابلات.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLaunchLiveRoom()}
                className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>دخول غرفة المقابلة الحية (Live Room)</span>
              </button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">المقابلة الجارية الآن:</span>
              <span className="text-emerald-400 font-mono text-[11px]">مباشر · 11:30 ص</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_candidate_talent_1791989553197.jpg"
                alt="المرشحة"
                className="w-12 h-12 rounded-full object-cover border border-indigo-500"
              />
              <div>
                <div className="text-xs font-bold text-white">سارة عبد الله الشمري</div>
                <div className="text-[11px] text-slate-400">مهندس أول حلول سحابية وبرمجيات</div>
                <div className="text-[11px] text-emerald-400 font-mono">تطابق المتطلبات: 94%</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-800/80 rounded-lg text-[11px] text-slate-300 flex items-center justify-between">
              <span>درجة التقييم التقني:</span>
              <span className="font-mono tabular-nums text-amber-400 font-bold">4.8 / 5.0</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Scheduled Interviews & Question Bank */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Scheduled Interviews (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  المقابلات الإلكترونية المجدولة اليوم
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {applicants.filter((a) => a.interviewScheduled)?.length} مقابلات
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {applicants.filter((a) => a.interviewScheduled)?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl p-4">
                  <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">لا توجد مقابلات رقمية مجدولة حالياً</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    المنصة في وضع الإنتاج جاهزة لربط المرشحين بغرف المقابلات المشفرة تلقائياً.
                  </p>
                </div>
              ) : (
                applicants
                  .filter((a) => a.interviewScheduled)
                  .map((app) => (
                  <div key={app.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.avatar}
                        alt={app.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500">{app.role}</div>
                        <div className="text-[10px] text-indigo-600 font-mono">
                          {app.interviewScheduled?.date} ({app.interviewScheduled?.time})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReminder(app)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                          app.interviewScheduled?.reminderSent
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600'
                        }`}
                        title={
                          app.interviewScheduled?.reminderSent
                            ? 'تم إرسال تذكير قبل ساعة (SMS/Mail)'
                            : 'إرسال تذكير المقابلة (قبل 1 ساعة)'
                        }
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">
                          {app.interviewScheduled?.reminderSent ? 'أُرسل التذكير' : 'تذكير'}
                        </span>
                      </button>

                      <button
                        onClick={() => onLaunchLiveRoom(app)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>انضمام للمقابلة</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


          {/* Asynchronous Video Screening Feature Box (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  المقابلات المسجلة مسبقاً (Video Screening)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">فرز أوتوماتيكي</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              وفّر أكثر من 70% من وقت لجان التوظيف! يستلم المرشح رابطاً مخصصاً لتسجيل إجابات مرئية على 3 إلى 5 أسئلة وظيفية، وتستعرض اللجنة التسجيلات والتقارير في أي وقت.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">نموذج إجابة مسجلة مرئياً:</span>
                <span className="text-slate-500 font-mono">03:42 دقيقة</span>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src="/src/assets/images/avatar_candidate_talent_1791989553197.jpg"
                  alt="تسجيل المقابلة"
                  className="w-full h-full object-cover opacity-80"
                />
                <button
                  onClick={() => setPlayingAsyncVideo(!playingAsyncVideo)}
                  className="absolute p-3 rounded-full bg-indigo-600/90 text-white hover:bg-indigo-600 transition-transform hover:scale-110 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {playingAsyncVideo && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
                  <span>جارٍ تشغيل الإجابة المرئية للسؤال التقني الثاني...</span>
                  <span className="font-mono tabular-nums text-[11px]">88% توافق</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Bank for Recruiters */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                بنك أسئلة مقابلات التوظيف المعتمد
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مجموعة أسئلة استرشادية مصنفة لتوجيه المقابلة وقياس الكفاءات بدقة
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'تقني', label: 'تقني' },
                { id: 'سلوكي', label: 'سلوكي' },
                { id: 'قيادي', label: 'قيادي' },
                { id: 'عام', label: 'عام' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-600">{q.category}</span>
                  <span className="font-mono tabular-nums">المدة المقترحة: {q.suggestedDuration}</span>
                </div>
                <div className="text-xs font-medium text-slate-800 leading-relaxed">
                  {q.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
