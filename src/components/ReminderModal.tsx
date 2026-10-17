import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  CheckCircle2,
  Send,
  Video,
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Applicant, InterviewReminder } from '../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  reminders: InterviewReminder[];
  onSendReminder: (reminder: InterviewReminder) => void;
  onLaunchRoom: (applicant: Applicant) => void;
  browserPermission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<void>;
  onTriggerPush: (title: string, body: string, type: 'application' | 'interview', onClick?: () => void) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  applicants,
  reminders,
  onSendReminder,
  onLaunchRoom,
  browserPermission,
  onRequestPermission,
  onTriggerPush,
}) => {
  const scheduledApplicants = applicants.filter((a) => a.interviewScheduled);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(
    scheduledApplicants[0]?.id || applicants[0]?.id || ''
  );
  const [activePreviewTab, setActivePreviewTab] = useState<'sms' | 'email' | 'history' | 'push'>('sms');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [autoReminderEnabled, setAutoReminderEnabled] = useState(true);

  if (!isOpen) return null;

  const currentApplicant = applicants.find((a) => a.id === selectedApplicantId) || applicants[0];
  const interviewTime = currentApplicant?.interviewScheduled?.date || 'اليوم، 11:30 صباحاً';
  const roomCode = currentApplicant?.interviewScheduled?.roomCode || 'TX-ROOM-8821';
  const meetingLink = `https://tawtheefx.sa/room/${roomCode}`;

  const smsText = `تذكير موعد المقابلة (منصة TawtheefX): عزيزي/عزيزتي ${currentApplicant?.name}، نود تذكيرك بأن موعد مقابلتك الوظيفية مع جهة العمل سيبدأ بعد ساعة واحدة (${interviewTime}).\nرابط الدخول المباشر: ${meetingLink}\nيرجى التواجد في مكان هادئ والتأكد من عمل الكاميرا والصوت.`;

  const emailSubjectText = `تذكير: موعد مقابلتك الوظيفية الرقمية بعد ساعة واحدة - ${currentApplicant?.role}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTriggerSend = () => {
    setIsSending(true);
    setTimeout(() => {
      const newReminder: InterviewReminder = {
        id: `rem-${Date.now()}`,
        candidateId: currentApplicant.id,
        candidateName: currentApplicant.name,
        candidatePhone: currentApplicant.phone,
        candidateEmail: currentApplicant.email,
        jobTitle: currentApplicant.role,
        companyName: currentApplicant.currentCompany || 'منصة توظيف إكسبرتس',
        roomCode,
        scheduledTime: interviewTime,
        channel: 'both',
        status: 'تم الإرسال (قبل المقابلة بساعة)',
        sentAt: 'الآن (تلقائي قبل 60 دقيقة)',
        smsMessage: smsText,
        emailSubject: emailSubjectText,
        emailPreview: `تذكير رسمي بموعد المقابلة بعد 60 دقيقة للمرشح ${currentApplicant.name}`
      };

      onSendReminder(newReminder);
      setIsSending(false);
      setActivePreviewTab('history');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>نظام التذكيرات الآلي للمقابلات الإلكترونية</span>
                <span className="text-[11px] font-mono font-normal bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded">
                  تذكير قبل 1 ساعة
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                إرسال تنبيهات SMS وبريد إلكتروني تلقائية للمرشحين قبل موعد المقابلة بـ 60 دقيقة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Selector & Automation Status */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              المرشح المستهدف:
            </label>
            <select
              value={selectedApplicantId}
              onChange={(e) => setSelectedApplicantId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 font-medium text-slate-900"
            >
              {applicants.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} ({app.role}) {app.interviewScheduled ? '— موعد مجدول' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Reminder Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReminderEnabled}
                onChange={(e) => setAutoReminderEnabled(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 font-medium">
                تفعيل الإرسال الآلي التلقائي قبل المقابلة بساعة
              </span>
            </label>
          </div>
        </div>

        {/* View Tabs: SMS vs Email vs Log */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActivePreviewTab('sms')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activePreviewTab === 'sms'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>رسالة SMS النصية</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('email')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activePreviewTab === 'email'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>البريد الإلكتروني التذكيري</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('push')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activePreviewTab === 'push'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>تنبيهات المتصفح (Web Push)</span>
          </button>

          <button
            onClick={() => setActivePreviewTab('history')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activePreviewTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>سجل التذكيرات المرسلة ({reminders?.length})</span>
          </button>
        </div>

        {/* Tab 1: Simulated SMS View */}
        {activePreviewTab === 'sms' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Phone Screen Mockup */}
            <div className="md:col-span-7 flex justify-center">
              <div className="w-full max-w-sm rounded-[32px] bg-slate-900 p-3 shadow-xl border-4 border-slate-800">
                <div className="bg-slate-100 rounded-[24px] p-4 text-xs min-h-[340px] flex flex-col justify-between">
                  {/* Phone Top Notch & Header */}
                  <div>
                    <div className="w-20 h-3 bg-slate-300 rounded-full mx-auto mb-3"></div>
                    <div className="text-center pb-2 border-b border-slate-200">
                      <div className="font-bold text-slate-900">TawtheefX Alert</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        مرسل عبر شبكة الاتصالات السعودية المعتمدة
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center my-3 text-[10px] text-slate-400 font-mono tabular-nums">
                      اليوم · قبل المقابلة بـ 60 دقيقة
                    </div>

                    {/* SMS Message Bubble */}
                    <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed space-y-2">
                      <p className="text-xs">{smsText}</p>
                      <div className="text-[10px] text-indigo-200 text-left font-mono">
                        تم التسليم ✓✓
                      </div>
                    </div>
                  </div>

                  {/* Message Input Simulation */}
                  <div className="mt-4 p-2 bg-white rounded-full border border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>رسالة نظام آلية موثقة</span>
                    <span className="font-mono text-indigo-600">SMS-GATEWAY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info & Action Controls */}
            <div className="md:col-span-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900">بيانات الإرسال للمرشح:</div>
                <div className="flex justify-between text-slate-600">
                  <span>الاسم:</span>
                  <span className="font-semibold text-slate-900">{currentApplicant?.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رقم الجوال:</span>
                  <span className="font-mono text-slate-900">{currentApplicant?.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>موعد المقابلة:</span>
                  <span className="font-semibold text-indigo-700">{interviewTime}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رابط القاعة:</span>
                  <span className="font-mono text-[11px] text-slate-700 truncate max-w-[120px]">
                    {roomCode}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleTriggerSend}
                  disabled={isSending}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSending
                      ? 'جارٍ إرسال التذكير عبر SMS والبريد...'
                      : 'إرسال تذكير الآن (قبل المقابلة بساعة)'}
                  </span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم نسخ رابط المقابلة' : 'نسخ رابط غرفة المقابلة'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Simulated Corporate Email View */}
        {activePreviewTab === 'email' && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-white border border-slate-300 rounded-xl shadow-sm text-xs space-y-4">
              {/* Email Envelope Header */}
              <div className="border-b border-slate-200 pb-3 space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">المُرسل:</span>{' '}
                    <span>إدارة التوظيف الرقمي (interviews@tawtheefx.sa)</span>
                  </div>
                  <div className="font-mono tabular-nums text-slate-400 text-[11px]">
                    اليوم، قبل المقابلة بـ 60 دقيقة
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">إلى:</span>{' '}
                  <span className="font-mono">{currentApplicant?.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">الموضوع:</span>{' '}
                  <span className="font-bold text-slate-900">{emailSubjectText}</span>
                </div>
              </div>

              {/* Email Body Template */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-4 text-slate-700">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-indigo-700">
                    منصة توظيف إكسبرتس | TawtheefX
                  </div>
                  <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    تذكير رسمي آلي
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">
                    مرحباً {currentApplicant?.name}،
                  </p>
                  <p className="leading-relaxed">
                    نود تذكيرك بأن موعد مقابلتك الوظيفية الإلكترونية لدور{' '}
                    <span className="font-bold text-slate-900">{currentApplicant?.role}</span> سيبدأ
                    بعد <span className="font-bold text-indigo-700">ساعة واحدة فقط</span> في تمام{' '}
                    <span className="font-bold text-slate-900">{interviewTime}</span>.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    رابط الجلسة المباشرة المشفرة:
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {meetingLink}
                  </div>
                  <button
                    onClick={() => onLaunchRoom(currentApplicant)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>دخول غرفة المقابلة الافتراضية واختبار الصوت والكاميرا</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-200 pt-3">
                  <div className="font-semibold text-slate-700">إرشادات هامة للمقابلة:</div>
                  <div>1. يرجى استخدام متصفح حديث (Chrome / Edge / Safari).</div>
                  <div>2. التأكد من منح الإذن لاستخدام الكاميرا والميكروفون عند الدخول.</div>
                  <div>3. التواجد في مكان ذي إضاءة جيدة واتصال إنترنت مستقر.</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleTriggerSend}
                disabled={isSending}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>إرسال هذا التذكير فوراً</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Dispatched Reminders History */}
        {activePreviewTab === 'history' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-slate-500">
              سجل التنبيهات والتذكيرات التي تم توليدها وإرسالها للمرشحين قبل ساعة من موعد المقابلات:
            </div>

            <div className="space-y-3">
              {reminders?.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-400">
                  لا توجد تذكيرات مرسلة حتى الآن.
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">{rem.candidateName}</span>
                        <span className="text-slate-400">({rem.jobTitle})</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                        {rem.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                      <div>وقت الإرسال: {rem.sentAt}</div>
                      <div>القنوات: SMS + البريد الإلكتروني</div>
                      <div>الجوال: {rem.candidatePhone}</div>
                      <div>البريد: {rem.candidateEmail}</div>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                      {rem.smsMessage}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Browser Push Notifications Panel */}
        {activePreviewTab === 'push' && (
          <div className="p-6 space-y-6">
            {/* Permission Status Box */}
            <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border-slate-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    browserPermission === 'granted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : browserPermission === 'denied'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>حالة إذن تنبيهات المتصفح (Web Notifications):</span>
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                        browserPermission === 'granted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : browserPermission === 'denied'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {browserPermission === 'granted'
                        ? 'مُفعلة ومصرح بها (Granted)'
                        : browserPermission === 'denied'
                        ? 'محظورة محلياً (Denied)'
                        : 'بانتظار إذن الوصول (Pending)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {browserPermission === 'granted'
                      ? 'ستظهر التنبيهات على سطح المكتب وزاوية الشاشة حتى في حال تصفح مواقع أخرى أو تصغير النافذة.'
                      : 'اضغط على الزر لمنح الإذن للمتصفح بإرسال إشعارات سطح المكتب الفورية.'}
                  </p>
                </div>
              </div>

              {browserPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow-sm shrink-0"
                >
                  طلب إذن المتصفح الآن
                </button>
              )}
            </div>

            {/* Test Push Scenarios Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Scenario 1: New Job Application */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>تنبيه تلقي طلب تقديم جديد</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يتم إرسال هذا التنبيه آلياً لمسؤولي التوظيف فور قيام أي باحث عن عمل بإرسال سيرته الذاتية عبر المنصة.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onTriggerPush(
                      'طلب توظيف جديد وارد!',
                      `قدّمت المرشحة ريم أحمد الفهد على وظيفة ${currentApplicant?.role || 'مهندس برمجيات'} مع إرفاق السيرة الذاتية.`,
                      'application'
                    )
                  }
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تجربة إرسال تنبيه طلب تقديم</span>
                </button>
              </div>

              {/* Scenario 2: Interview Time Arrival */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>تنبيه وصول موعد مقابلة</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تنبيه عاجل يظهر على شاشة المُحاور والمرشح فور حلول موعد الجلسة الرقمية أو قبلها بساعة مع زر دخول فوري.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onTriggerPush(
                      'حان موعد مقابلتك الوظيفية الآن!',
                      `جلسة المقابلة الرقمية مع ${currentApplicant?.name} جارية الآن في القاعة ${roomCode}. انقر للدخول الفوري.`,
                      'interview',
                      () => onLaunchRoom(currentApplicant)
                    )
                  }
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تجربة تنبيه موعد المقابلة الآن</span>
                </button>
              </div>
            </div>

            {/* Technical API compliance notes */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">المعايير التقنية المطبقة:</div>
              <div>• دعم كامل لمعيار W3C Web Notifications API متوافق مع كافة المتصفحات الحديثة (Chrome, Safari, Edge, Firefox).</div>
              <div>• نغمة تنبيه صوتية مدمجة عبر Web Audio API دون الحاجة لتحميل ملفات خارجية.</div>
              <div>• واجهة إشعار متصفح داخلية بديلة تعمل بسلاسة حتى في حال تشغيل المنصة داخل بيئات الـ iFrame المقيدة.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

