import React, { useState } from 'react';
import { JobListing } from '../types';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Video,
  CheckCircle2,
  DollarSign,
  Send,
  X,
  FileUp,
  UserCheck
} from 'lucide-react';

interface JobListingsProps {
  jobs: JobListing[];
  onOpenInterviewRoomForJob: (job: JobListing) => void;
  onApplySuccess: (jobId: string, candidateData: any) => void;
  onPostJobClick?: () => void;
}

export const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  onOpenInterviewRoomForJob,
  onApplySuccess,
  onPostJobClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modal for quick applying
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Expanded details drawer
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const departments = [
    { id: 'all', label: 'كافة التخصصات' },
    { id: 'الهندسة والتقنية', label: 'الهندسة والتقنية' },
    { id: 'إدارة المنتجات', label: 'إدارة المنتجات' },
    { id: 'الموارد البشرية', label: 'الموارد البشرية' },
    { id: 'المالية والمحاسبة', label: 'المالية والمحاسبة' },
  ];

  const types = [
    { id: 'all', label: 'كافة أنماط العمل' },
    { id: 'دوام كامل', label: 'دوام كامل' },
    { id: 'عن بُعد', label: 'عن بُعد' },
    { id: 'هجين', label: 'هجين' },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || job.department === selectedDept;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesDept && matchesType;
  });

  const handleQuickApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    onApplySuccess(applyingJob.id, {
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      resumeFileName: uploadedFileName || 'Resume_Applicant.pdf'
    });
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setApplyingJob(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setUploadedFileName('');
    }, 1800);
  };

  return (
    <section id="job-listings" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              الفرص الوظيفية المتاحة
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              أحدث الشواغر وإعلانات التوظيف النشطة
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              استكشف الشواغر الوظيفية المعتمدة وقدّم سيرتك الذاتية أو احجز مقابلتك الرقمية فوراً.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            إجمالي الشواغر: <span className="font-bold text-slate-900">{filteredJobs?.length}</span> وظيفة
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بمسمى الوظيفة، اسم الشركة، أو المهارات التقنية المطلوبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Department & Type Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
            {/* Department buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium ml-2">التخصص:</span>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedDept === dept.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Work Type buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium ml-2">نمط العمل:</span>
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedType === t.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs?.length === 0 ? (
            <div className="p-12 text-center bg-white border border-dashed border-indigo-200 rounded-2xl shadow-xs space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  وضع الإنتاج جاهز · لا توجد وظائف معلنة حالياً
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تم تفريغ البيانات الافتراضية بنجاح. المنصة جاهزة لاستقبال ونشر وظائف حقيقية واستقبال المرشحين وتفعيل المقابلات الإلكترونية بالفيديو.
                </p>
              </div>
              {onPostJobClick && (
                <button
                  onClick={onPostJobClick}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>نشر أول وظيفة الآن</span>
                </button>
              )}
            </div>
          ) : filteredJobs?.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد وظائف مطابقة لبحثك حالياً</h3>
              <p className="text-xs text-slate-500 mt-1">جرّب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('all');
                  setSelectedType('all');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`border rounded-xl transition-all ${
                    job.featured
                      ? 'border-indigo-200 bg-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Card Main Row */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Zero-Pill Metadata Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">{job.company}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{job.postedDate}</span>
                        {job.requiresVideoInterview && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-indigo-600 font-semibold flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 inline" />
                              <span>تتطلب مقابلة فيديو رقمية</span>
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <div className="text-xs text-slate-600 font-mono tabular-nums">
                        الراتب المتوقع: <span className="font-semibold text-slate-900">{job.salary}</span>
                        <span className="mr-3 text-slate-400">· {job.applicantsCount} متقدم</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        {isExpanded ? 'إخفاء التفاصيل' : 'التفاصيل والشروط'}
                      </button>

                      {job.requiresVideoInterview && (
                        <button
                          onClick={() => onOpenInterviewRoomForJob(job)}
                          className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="تجربة بيئة المقابلة المباشرة للوظيفة"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>غرفة المقابلة</span>
                        </button>
                      )}

                      <button
                        onClick={() => setApplyingJob(job)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                      >
                        تقديم سريع
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs text-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">الوصف الوظيفي:</h4>
                        <p className="leading-relaxed text-slate-600">{job.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">المتطلبات والمهارات:</h4>
                          <ul className="space-y-1.5">
                            {job.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <span className="text-indigo-600 font-bold">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 mb-2">المزايا والحوافز:</h4>
                          <ul className="space-y-1.5">
                            {job.benefits.map((ben, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200">
                        <span>آخر موعد للتقديم: {job.deadline}</span>
                        <span>رمز الوظيفة: TX-{job.id}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  تقديم طلب التوظيف للوظيفة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {applyingJob.title} · {applyingJob.company}
                </p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">تم إرسال طلبك وسيرتك الذاتية بنجاح!</h4>
                <p className="text-xs text-slate-500">
                  سيصلك رابط المقابلة الإلكترونية والتحديثات عبر البريد الإلكتروني.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الاسم الكامل للمرشح
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ريم أحمد الفهد"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="reem@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+966 5x xxx xxxx"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    إرفاق السيرة الذاتية (CV / Resume)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFileName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-slate-700 block">
                      {uploadedFileName || 'انقر لاختيار ملف السيرة الذاتية (PDF, Word)'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      أقصى حجم للملف: 15 ميجابايت
                    </span>
                  </div>
                </div>

                {applyingJob.requiresVideoInterview && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 text-xs text-indigo-900">
                    <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      تتطلب هذه الوظيفة مقابلة فيديو إلكترونية مباشرة مدتها 30 دقيقة. سيتم تحديد الموعد تلقائياً بعد مراجعة الـ CV.
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال طلب التوظيف</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
