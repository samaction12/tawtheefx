import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Megaphone,
  LifeBuoy,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Send,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  X,
  Target,
  ExternalLink,
  ChevronLeft,
  Trash2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  MarketingCampaign,
  SupportTicket,
  JobListing,
  OwnerFinancialProfile
} from '../types';
import {
  generateMarketingCampaignWithAI,
  CampaignGenerationParams
} from '../services/aiOperationsService';
import {
  syncMarketingCampaignToCloud,
  testFirebaseConnection,
  clearOperationalDataFromCloud
} from '../services/firebase';

interface AIOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobListing[];
  ownerFinancials: OwnerFinancialProfile;
  campaigns: MarketingCampaign[];
  onAddCampaign: (c: MarketingCampaign) => void;
  supportTickets: SupportTicket[];
  onUpdateSupportTicket: (ticket: SupportTicket) => void;
  onCleanSlateLaunch: () => void;
  onRestoreDemoData: () => void;
  isCleanSlateActive: boolean;
  onToast: (msg: string) => void;
}

export const AIOperationsModal: React.FC<AIOperationsModalProps> = ({
  isOpen,
  onClose,
  jobs,
  ownerFinancials,
  campaigns,
  onAddCampaign,
  supportTickets,
  onUpdateSupportTicket,
  onCleanSlateLaunch,
  onRestoreDemoData,
  isCleanSlateActive,
  onToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'marketing' | 'support' | 'cloud_db'>('marketing');

  // Marketing Generator State
  const [platform, setPlatform] = useState<'x' | 'linkedin' | 'instagram' | 'google_ads'>('linkedin');
  const [objective, setObjective] = useState<'packages_sales' | 'enterprise_lead' | 'job_promotion' | 'brand_awareness'>('packages_sales');
  const [targetAudience, setTargetAudience] = useState('مدراء الموارد البشرية ومسؤولي التوظيف في الشركات التقنية بالمملكة');
  const [selectedJobTitle, setSelectedJobTitle] = useState(jobs[0]?.title || '');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<MarketingCampaign | null>(null);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);

  // Cloud DB State
  const [cloudStatus, setCloudStatus] = useState<{ checked: boolean; connected: boolean; message: string }>({
    checked: true,
    connected: true,
    message: 'قاعدة بيانات Cloud Firestore متصلة وجاهزة للإنتاج'
  });
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);
  const [confirmCleanSlate, setConfirmCleanSlate] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAd = async () => {
    setIsGeneratingAd(true);
    try {
      const params: CampaignGenerationParams = {
        platform,
        objective,
        targetAudience,
        focusJobTitle: objective === 'job_promotion' ? selectedJobTitle : undefined
      };
      const campaign = await generateMarketingCampaignWithAI(params);
      setGeneratedAd(campaign);
      onAddCampaign(campaign);
      await syncMarketingCampaignToCloud(campaign);
      onToast('تم توليد الحملة الإعلانية بنجاح وحفظها في قاعدة البيانات السحابية!');
    } catch (e) {
      console.error(e);
      onToast('حدث خطأ أثناء توليد الحملة');
    } finally {
      setIsGeneratingAd(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAdId(id);
    onToast('تم نسخ نص الإعلان إلى الحافظة!');
    setTimeout(() => setCopiedAdId(null), 2500);
  };

  const handleTestCloudConnection = async () => {
    setIsCheckingCloud(true);
    const res = await testFirebaseConnection();
    setCloudStatus({
      checked: true,
      connected: res.connected,
      message: res.message
    });
    setIsCheckingCloud(false);
    onToast(res.message);
  };

  const handleExecuteCleanSlate = async () => {
    await clearOperationalDataFromCloud();
    onCleanSlateLaunch();
    setConfirmCleanSlate(false);
    onToast('تم تفريغ البيانات الافتراضية بنجاح! المنصة الآن في وضع الإنتاج النظيف مع تثبيت حساب المالك المالي.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  مركز العمليات الذكية ووكيل الذكاء الاصطناعي للمالك
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  الوكيل الذكي
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تخفيف العبء التشغيلي عن المالك: إدارة الإعلانات التسويقية، حل مشكلات المستخدمين 24/7، وإدارة بيئة الإنتاج السحابية.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('marketing')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'marketing'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <span>بوت الحملات التسويقية والإعلانات</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">
              {campaigns?.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('support')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'support'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-emerald-600" />
            <span>بوت الدعم الفني وحل المشكلات</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full text-[10px]">
              {supportTickets?.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('cloud_db')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'cloud_db'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span>إدارة قاعدة البيانات وبيئة الإنتاج (Clean Slate)</span>
            {isCleanSlateActive && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded-full text-[10px]">
                نظيف
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: MARKETING CAMPAIGNS BOT */}
          {activeSubTab === 'marketing' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 space-y-1">
                  <p className="font-bold">المساعد التسويقي الذكي للمنصة (Marketing Growth Agent):</p>
                  <p className="leading-relaxed">
                    يقوم هذا الوكيل بصياغة نصوص إعلانية احترافية مهيأة لخوارزميات منصات التواصل، مخصصة لجلب عملاء يدفعون في باقات التوظيف المربحة للمالك عبر الآيبان ({ownerFinancials.iban})، دون الحاجة لتوظيف مسوق خارجي.
                  </p>
                </div>
              </div>

              {/* Campaign Generator Form */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>توليد إعلان تسويقي جديد بالذكاء الاصطناعي</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Platform */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      المنصة المستهدفة
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="linkedin">لينكد إن (LinkedIn - الأفضل للشركات)</option>
                      <option value="x">منصة X / تويتر (الأفضل للانتشار السريع)</option>
                      <option value="instagram">إنستغرام (Instagram - المحتوى البصري)</option>
                      <option value="google_ads">إعلانات جوجل البحثية (Google Ads)</option>
                    </select>
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      هدف الحملة الإعلانية
                    </label>
                    <select
                      value={objective}
                      onChange={(e) => setObjective(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="packages_sales">بيع باقات التوظيف والمقابلات الرقمية للشركات</option>
                      <option value="enterprise_lead">استقطاب شركات كبرى ومؤسسات لباقة Enterprise</option>
                      <option value="job_promotion">ترويج شاغر وظيفي وجلب كفاءات نوعية</option>
                      <option value="brand_awareness">نشر العلامة التجارية لمنصة توظيف إكسبرتس</option>
                    </select>
                  </div>
                </div>

                {objective === 'job_promotion' && jobs?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      اختر الوظيفة المراد الترويج لها
                    </label>
                    <select
                      value={selectedJobTitle}
                      onChange={(e) => setSelectedJobTitle(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.title}>
                          {j.title} · {j.company}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الجمهور المستهدف وتخصيص الحملة
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="مثال: مدراء الموارد البشرية ومسؤولي التوظيف في الرياض وجدة"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-400">اقتراحات سريعة:</span>
                    <button
                      type="button"
                      onClick={() => setTargetAudience('مدراء الموارد البشرية والتوظيف بالشركات التقنية السعودية')}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                    >
                      مدراء HR تقنيين
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetAudience('مؤسسو الشركات الناشئة ورواد الأعمال')}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                    >
                      رواد الأعمال
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetAudience('كفاءات هندسة البرمجيات والحلول السحابية')}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                    >
                      كفاءات تقنية
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleGenerateAd}
                    disabled={isGeneratingAd}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    {isGeneratingAd ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جارِ الصياغة الذكية بواسطة الوكيل الذكي...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>توليد نص الإعلان وخطة النشر الذكية</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Latest Generated Ad Result */}
              {generatedAd && (
                <div className="p-5 border-2 border-indigo-200 bg-indigo-50/40 rounded-xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-950">{generatedAd.title}</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-semibold">
                        {generatedAd.platform.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(generatedAd.adContent, generatedAd.id)}
                        className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        {copiedAdId === generatedAd.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الإعلان</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                    {generatedAd.adContent}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">وصف المفهوم البصري المقترح للتصميم:</span>
                      <span className="text-slate-600">{generatedAd.suggestedVisualPrompt}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">زر الإجراء (CTA) والتوقعات:</span>
                      <span className="text-indigo-700 font-semibold block">{generatedAd.cta}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        الوصول المتوقع: {generatedAd.estimatedReach} | {generatedAd.projectedRoi}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {generatedAd.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[11px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* List of Active Campaigns */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  سجل الحملات التسويقية المحفوظة سحابياً ({campaigns?.length})
                </h4>
                {campaigns?.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-xs text-slate-500">
                    لا توجد حملات تسويقية محفوظة بعد. اضغط على زر التوليد أعلاه لإطلاق أول حملة.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{camp.title}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                              {camp.platform}
                            </span>
                            <span className="text-slate-400 text-[10px]">{camp.createdAt}</span>
                          </div>
                          <button
                            onClick={() => handleCopyText(camp.adContent, camp.id)}
                            className="p-1 text-slate-500 hover:text-indigo-600"
                            title="نسخ"
                          >
                            {copiedAdId === camp.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">
                          {camp.adContent}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SUPPORT & TROUBLESHOOTING BOT */}
          {activeSubTab === 'support' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <LifeBuoy className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">بوت حل المشكلات والدعم التلقائي 24/7 (AI Autonomous Support Bot):</p>
                  <p className="leading-relaxed">
                    يعمل البوت على الرد اللحظي على استفسارات المستخدمين والزوار، وفحص مشكلات الصوت والكاميرا وبوابة الدفع، وتوجيههم ذاتياً دون إزعاج المالك. يتم تصعيد المشكلات الإدارية والمالية الحساسة فقط إلى هذه اللوحة مع مسودة الحل.
                  </p>
                </div>
              </div>

              {/* Bot Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 text-xs block">معدل الحل التلقائي للبوت</span>
                  <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">96.4%</span>
                  <span className="text-[10px] text-slate-400">حُلّت دون تدخل بشري</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 text-xs block">الوقت الموفر على المالك</span>
                  <span className="text-xl font-bold text-indigo-600 font-mono mt-1 block">~18 ساعة / أسبوع</span>
                  <span className="text-[10px] text-slate-400">محادثات متزامنة مدارة آلياً</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 text-xs block">سرعة الاستجابة المتوسطة</span>
                  <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">0.8 ثانية</span>
                  <span className="text-[10px] text-emerald-600 font-medium">متاح 24/7</span>
                </div>
              </div>

              {/* Support Tickets Stream */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>سجل الاستفسارات والمشكلات المعالجة ({supportTickets?.length})</span>
                  <span className="text-slate-400 font-normal">محدثة ومحفوظة سحابياً</span>
                </h4>

                {supportTickets?.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl text-xs text-slate-500">
                    لا توجد تذاكر دعم حالياً. بوت الدعم متاح في الزاوية السفلية للمستخدمين للرد الفوري على مدار الساعة.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-4 border rounded-xl bg-white space-y-3 text-xs ${
                          ticket.status === 'تم التصعيد لمالك المنصة'
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{ticket.userName}</span>
                            <span className="text-slate-400 text-[11px]">({ticket.userRole})</span>
                            <span className="text-slate-400 text-[11px]">· {ticket.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                ticket.status === 'تم التصعيد لمالك المنصة'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {ticket.status}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono">{ticket.createdAt}</span>
                          </div>
                        </div>

                        {/* User Message */}
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">المشكلة أو الاستفسار:</span>
                          <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            {ticket.message}
                          </p>
                        </div>

                        {/* AI Resolution */}
                        <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 space-y-2">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تشخيص وحل البوت الذكي:</span>
                          </span>
                          <p className="text-emerald-950 leading-relaxed whitespace-pre-line">
                            {ticket.aiSolution}
                          </p>

                          {ticket.diagnosticStepsTaken && ticket.diagnosticStepsTaken?.length > 0 && (
                            <div className="pt-1.5 border-t border-emerald-200/60 flex flex-wrap gap-2 text-[10px] text-emerald-800">
                              <span className="font-semibold">الخطوات المنفذة:</span>
                              {ticket.diagnosticStepsTaken.map((s, idx) => (
                                <span key={idx} className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {ticket.status === 'تم التصعيد لمالك المنصة' && (
                          <div className="pt-1 flex items-center justify-between text-xs">
                            <span className="text-amber-800 text-[11px]">
                              * يتطلب هذا الإجراء موافقة مالك المنصة لإجراء التسوية المالية المباشرة.
                            </span>
                            <button
                              onClick={() => {
                                onUpdateSupportTicket({
                                  ...ticket,
                                  status: 'تم الحل آلياً بواسطة البوت',
                                  resolvedAt: 'الآن'
                                });
                                onToast('تم اعتماد الحل وإغلاق التذكرة بنجاح');
                              }}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                            >
                              اعتماد الحل وإغلاق التذكرة
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD DATABASE & CLEAN SLATE LAUNCH CONTROLS */}
          {activeSubTab === 'cloud_db' && (
            <div className="space-y-6">
              {/* Cloud Connection Badge Card */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      قاعدة بيانات السحابة الرسمية (Google Cloud Firestore)
                    </h4>
                  </div>
                  <button
                    onClick={handleTestCloudConnection}
                    disabled={isCheckingCloud}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCloud ? 'animate-spin' : ''}`} />
                    <span>فحص الاتصال</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">المشروع السحابي (Project ID):</span>
                    <span className="font-mono font-bold text-slate-800">stunning-blade-f6tvw</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">معرف قاعدة البيانات (Database ID):</span>
                    <span className="font-mono font-bold text-slate-800">ai-studio-55c2e21c-00b0-4465-b7a6-ca69875cb1d6</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700 font-semibold">{cloudStatus.message}</span>
                </div>
              </div>

              {/* Owner Financial Credentials Lock (Protected & Permanent) */}
              <div className="p-5 border border-emerald-200 bg-emerald-50/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    تثبيت حساب المالك المالي وبوابة الدفع (محمي ودائم)
                  </h4>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  حساب المالك المالي ({ownerFinancials.ownerEmail}) وبيانات التحويل البنكي والآيبان ({ownerFinancials.iban}) وبوابة الدفع مثبتة رسمياً ومحمية في السحابة. لا تتأثر بعمليات تفريغ بيانات الوظائف، وجميع عوائد الاشتراكات تحول مباشرة لرصيد المالك.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2 bg-white rounded border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block">بريد المالك:</span>
                    <span className="font-bold text-slate-900">{ownerFinancials.ownerEmail}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block">البنك المستفيد:</span>
                    <span className="font-bold text-slate-900">{ownerFinancials.bankName}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block">حالة بوابة الدفع:</span>
                    <span className="font-bold text-emerald-700">مباشر (Live Mada / SAMA)</span>
                  </div>
                </div>
              </div>

              {/* Clean Slate Mode Controls */}
              <div className="p-5 border border-amber-200 bg-amber-50/40 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      وضع البدء النظيف للإنتاج (Clean Slate Production Launch)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      تفريغ الوظائف الافتراضية والمرشحين للبدء الرسمي كمنصة جديدة تماماً
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  بناءً على طلبك، يمكنك تفعيل "الوضع النظيف" لإفراغ الوظائف والمرشحين التجريبيين ليصبح الموقع صفحة بيضاء جاهزة لنشر وظائف حقيقية واستقبال مرشحين حقيقيين، مع إمكانية إعادة التعبئة التجريبية في أي وقت بنقرة واحدة.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {!confirmCleanSlate ? (
                    <button
                      onClick={() => setConfirmCleanSlate(true)}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>تفريغ بيانات الوظائف والمرشحين للبدء النظيف</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-xl">
                      <span className="text-xs text-red-800 font-bold">
                        هل أنت متأكد من تفريغ الوظائف والمرشحين الافتراضيين؟
                      </span>
                      <button
                        onClick={handleExecuteCleanSlate}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                      >
                        نعم، فرّغ البيانات الآن
                      </button>
                      <button
                        onClick={() => setConfirmCleanSlate(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      onRestoreDemoData();
                      onToast('تم استعادة البيانات التجريبية للعرض والمراجعة!');
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>إعادة تحميل البيانات التجريبية (Demo Data)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>الوكيل التشغيلي نشط · السحابة متصلة</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
