import React from 'react';
import { Video, ShieldCheck, ArrowLeft, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onPostJobClick: () => void;
  onOpenInterviewRoom: () => void;
  onExploreJobs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPostJobClick,
  onOpenInterviewRoom,
  onExploreJobs,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Text and Actions (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
              <span>منصة التوظيف الذكية للشركات ورواد الأعمال</span>
              <span aria-hidden="true">·</span>
              <span>بوابات دفع معتمدة</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight" style={{ textWrap: 'balance' }}>
              منظومة متكاملة لنشر إعلانات الوظائف وإجراء المقابلات الرقمية
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              ساعد مؤسستك في استقطاب الكفاءات الاستثنائية بكل سلاسة. انشر وظائفك لتصل إلى آلاف المحترفين المؤهلين، وأجرِ مقابلات فيديو حية ومسجلة مدعومة بنماذج تقييم معيارية ونظام دفع آمن وفواتير ضريبية فورية.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onPostJobClick}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
              >
                <span>نشر إعلان وظيفي الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenInterviewRoom}
                className="px-5 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>تجربة غرفة المقابلات الرقمية</span>
              </button>

              <button
                onClick={onExploreJobs}
                className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
              >
                تصفح أحدث الوظائف
              </button>
            </div>

            {/* Trust and compliance reassurance */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>دفع إلكتروني آمن 100% متوافق مع معايير PCI-DSS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>فواتير ضريبية معتمدة من هيئة الزكاة والضريبة والجمارك</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 aspect-[4/3] lg:aspect-auto lg:h-full">
              <img
                src="/src/assets/images/hero_recruitment_workspace_1791989553228.jpg"
                alt="مركز إدارة التوظيف والمقابلات الرقمية"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span>منظومة المقابلات المتزامنة</span>
                  <span className="font-mono tabular-nums">TX-LIVE-HD</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  جلسات فيديو مشفرة بتقنية WebRTC عالية الدقة
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  تقييم كفاءات المرشحين، تدوين الملاحظات التفاعلية، وتصدير تقارير التوظيف فور انتهاء المقابلة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Quantitative Proof Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              +48,500
            </div>
            <div className="text-xs text-slate-500 font-medium">
              مرشح محترف مسجل في قاعدة المواهب
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
              94.8%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              نسبة دقة مطابقة الكفاءات للشاغر الوظيفي
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              15 دقيقة
            </div>
            <div className="text-xs text-slate-500 font-medium">
              متوسط جدولة وانطلاق المقابلة الإلكترونية
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              معاملات بنكية مشفرة (مدى، فيزا، Apple Pay)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
