import React, { useState } from 'react';
import { Applicant, JobListing } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Users,
  Video,
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Building,
  Check,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';

interface EmployerDashboardProps {
  applicants: Applicant[];
  jobs: JobListing[];
  onStartInterview: (applicant: Applicant) => void;
  onPostJob: () => void;
  onOpenReminder: (applicant?: Applicant) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  applicants,
  jobs,
  onStartInterview,
  onPostJob,
  onOpenReminder,
}) => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header of Employer Portal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>بوابة إدارة التوظيف</span>
              <span>/</span>
              <span>مركز المقابلات والمرشحين</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              لوحة تحكم جهة العمل واستقطاب الكفاءات
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              متابعة طلبات التوظيف الواردة، إدارة جداول المقابلات الرقمية، واعتماد تقارير اللجان.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenReminder()}
              className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>نظام التذكيرات (SMS/Email)</span>
            </button>

            <button
              onClick={onPostJob}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>نشر شاغر وظيفي جديد</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500 font-medium">الوظائف النشطة حالياً</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {jobs?.length}
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500 font-medium">إجمالي المتقدمين الجدد</div>
            <div className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
              {applicants?.length}
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500 font-medium">مقابلات رقمية مجدولة</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
              {applicants.filter((a) => a.interviewScheduled)?.length}
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500 font-medium">تذكيرات أُرسلت (قبل ساعة)</div>
            <div className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
              {applicants.filter((a) => a.interviewScheduled?.reminderSent)?.length}
            </div>
          </div>
        </div>

        {/* ATS Candidates Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: t.app_filter_all },
                { id: 'qualified', label: t.app_status_qualified },
                { id: 'interviewed', label: t.app_status_interviewed },
                { id: 'new', label: t.app_status_new }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-mono tabular-nums">
              عدد النتائج: {filteredApplicants?.length}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">اسم المرشح</th>
                  <th className="py-3 px-4">الوظيفة المتقدم لها</th>
                  <th className="py-3 px-4">نسبة التطابق</th>
                  <th className="py-3 px-4">حالة المقابلة والتذكير</th>
                  <th className="py-3 px-4">التقييم المعياري</th>
                  <th className="py-3 px-4 text-center">الإجراء الفوري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate Name & Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.avatar}
                          alt={app.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{app.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">{t[app.roleKey]}</div>
                      <div className="text-[11px] text-slate-400">{app.experienceYears} سنوات خبرة</div>
                    </td>

                    {/* Match Score */}
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      <span className="font-bold text-emerald-600 text-sm">{app.matchScore}%</span>
                    </td>

                    {/* Interview Status & Reminder Badge */}
                    <td className="py-3.5 px-4">
                      {app.interviewScheduled ? (
                        <div className="space-y-1">
                          <div className="text-slate-900 font-medium">
                            {app.interviewScheduled.date}
                          </div>
                          <div className="text-[11px] text-indigo-600 font-mono">
                            {app.interviewScheduled.roomCode}
                          </div>
                          {app.interviewScheduled.reminderSent ? (
                            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>أُرسل تذكير قبل ساعة (SMS/Mail)</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onOpenReminder(app)}
                              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 underline underline-offset-2"
                            >
                              <Bell className="w-3 h-3" />
                              <span>إرسال تذكير المقابلة</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">بانتظار الجدولة</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      {app.interviewScores ? (
                        <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>
                            {(
                              (app.interviewScores.technical +
                                app.interviewScores.communication +
                                app.interviewScores.problemSolving +
                                app.interviewScores.culturalFit) /
                              4
                            )?.toFixed(1)}{' '}
                            / 5.0
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">لم يتم التقييم</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onStartInterview(app)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>دخول المقابلة</span>
                        </button>

                        <button
                          onClick={() => onOpenReminder(app)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="إرسال أو استعراض تذكير المقابلة"
                        >
                          <Bell className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="عرض ملف السيرة الذاتية والملاحظات"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredApplicants?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 bg-slate-50/50">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Users className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-800">
                          لا يوجد مرشحون حالياً في هذه القائمة
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          المنصة مهيأة لاستقبال طلبات التوظيف الحقيقية. فور تقديم أي مرشح، ستتلقى تنبيهاً فورياً وتُحدث هذه القائمة لحظياً.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Applicant Details Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedApplicant.avatar}
                    alt={selectedApplicant.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedApplicant.name}</h3>
                    <p className="text-xs text-slate-500">{t[selectedApplicant.roleKey]}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
                >
                  إغلاق
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">سنوات الخبرة:</span>
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      {selectedApplicant.experienceYears} سنوات
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">جهة العمل السابقة:</span>
                    <span className="font-semibold text-slate-900">{t[selectedApplicant.currentCompanyKey]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">البريد الإلكتروني:</span>
                    <span className="font-mono text-slate-900">{selectedApplicant.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ملف الـ CV:</span>
                    <span className="font-semibold text-indigo-600">
                      {selectedApplicant.resumeFileName || 'Resume.pdf'}
                    </span>
                  </div>
                </div>

                {selectedApplicant.interviewScores && (
                  <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-2">
                    <h4 className="font-bold text-amber-900 text-xs">تقييم وملاحظات المقابلة:</h4>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {t[selectedApplicant.interviewScores.notesKey]}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const target = selectedApplicant;
                    setSelectedApplicant(null);
                    onStartInterview(target);
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>بدء جلسة مقابلة فيديو الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
