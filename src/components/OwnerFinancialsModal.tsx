import React, { useState } from 'react';
import {
  Wallet,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowDownLeft,
  X,
  Lock,
  Clock,
  Save,
  Check,
  ExternalLink,
  Code2,
  Copy,
  Terminal,
  Activity,
  Zap,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { OwnerFinancialProfile, PayoutRecord } from '../types';
import {
  testGatewayConnection,
  GatewayPingResult,
  getBackendIntegrationCode,
  profileToGatewayConfig,
  PaymentGatewayConfig
} from '../services/paymentGatewayService';

interface OwnerFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OwnerFinancialProfile;
  payouts: PayoutRecord[];
  onUpdateProfile: (updated: OwnerFinancialProfile) => void;
  onRequestPayout: (amount: number) => void;
  onSimulateInboundPayment?: (amount: number, clientName: string) => void;
}

export const OwnerFinancialsModal: React.FC<OwnerFinancialsModalProps> = ({
  isOpen,
  onClose,
  profile,
  payouts,
  onUpdateProfile,
  onRequestPayout,
  onSimulateInboundPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'gateway' | 'code' | 'payouts'>('bank');

  // Form states
  const [ownerName, setOwnerName] = useState(profile?.ownerName || "");
  const [ownerEmail, setOwnerEmail] = useState(profile?.ownerEmail);
  const [merchantBusinessName, setMerchantBusinessName] = useState(profile?.merchantBusinessName);
  const [crNumber, setCrNumber] = useState(profile?.crNumber);
  const [vatNumber, setVatNumber] = useState(profile?.vatNumber);
  const [bankName, setBankName] = useState(profile?.bankName);
  const [iban, setIban] = useState(profile?.iban);
  const [accountNumber, setAccountNumber] = useState(profile?.accountNumber);
  const [swiftCode, setSwiftCode] = useState(profile?.swiftCode || '');
  const [payoutSchedule, setPayoutSchedule] = useState<'daily' | 'weekly' | 'monthly'>(profile?.payoutSchedule);
  const [gatewayMode, setGatewayMode] = useState<'live' | 'sandbox'>(profile?.gatewayMode);
  const [merchantKeyId, setMerchantKeyId] = useState(profile?.merchantKeyId || 'MID-TAWTHEEFX-994821094');

  // Payout request simulation state
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Gateway Ping / Test State
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<GatewayPingResult | null>(null);

  // Code Tab state
  const [codeLanguage, setCodeLanguage] = useState<'nodejs' | 'webhook' | 'curl'>('nodejs');
  const [copiedCode, setCopiedCode] = useState(false);

  // Inbound Payment Simulation
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [paymentSimulatedSuccess, setPaymentSimulatedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentConfig: PaymentGatewayConfig = profileToGatewayConfig({
    ...profile,
    ownerName,
    ownerEmail,
    merchantBusinessName,
    crNumber,
    vatNumber,
    bankName,
    iban,
    accountNumber,
    swiftCode,
    payoutSchedule,
    gatewayMode,
    merchantKeyId,
  });

  const codeSnippets = getBackendIntegrationCode(currentConfig);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      ownerName,
      ownerEmail,
      merchantBusinessName,
      crNumber,
      vatNumber,
      bankName,
      iban,
      accountNumber,
      swiftCode,
      payoutSchedule,
      gatewayMode,
      merchantKeyId,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleInstantPayout = () => {
    if (profile?.availableBalanceSAR <= 0) return;
    setIsTransferring(true);
    setTimeout(() => {
      onRequestPayout(profile?.availableBalanceSAR);
      setIsTransferring(false);
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
    }, 1200);
  };

  const handlePingGateway = async () => {
    setIsPinging(true);
    const res = await testGatewayConnection(currentConfig);
    setPingResult(res);
    setIsPinging(false);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTriggerSimulatedPayment = () => {
    if (!onSimulateInboundPayment) return;
    setIsSimulatingPayment(true);
    setTimeout(() => {
      onSimulateInboundPayment(699, 'شركة الابتكار الرقمي المحدودة');
      setIsSimulatingPayment(false);
      setPaymentSimulatedSuccess(true);
      setTimeout(() => setPaymentSimulatedSuccess(false), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-inner">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  برمجة وربط البيانات المالية للمالك في بوابة الدفع
                </h3>
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>المالك: {ownerEmail}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تخصيص حساب التحصيل البنكي للمالك وبرمجة مفاتيح الربط البرمجي (Gateway API) لتحويل مبيعات الاشتراكات لآيبانك مباشرة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Earnings & Payout Strip */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>إجمالي الإيرادات المحققة</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">100% للمالك</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {profile?.totalEarningsSAR.toLocaleString('en-US', { minimumFractionDigits: 2 })} ر.س
            </div>
            <div className="text-[10px] text-slate-400 font-mono">شامل كافة مبيعات الباقات وإعلانات التوظيف</div>
          </div>

          <div className="p-4 bg-white rounded-xl border-2 border-indigo-600/30 shadow-xs space-y-1">
            <div className="text-xs text-indigo-700 font-semibold flex items-center justify-between">
              <span>الرصيد المتاح للتحويل فوراً</span>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">جاهز للصرف</span>
            </div>
            <div className="text-2xl font-bold text-indigo-700 font-mono tabular-nums">
              {profile?.availableBalanceSAR.toLocaleString('en-US', { minimumFractionDigits: 2 })} ر.س
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              سيتم التحويل للآيبان: {iban?.slice(0, 4)} **** {iban?.slice(-4)}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleInstantPayout}
              disabled={isTransferring || profile?.availableBalanceSAR <= 0}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>
                {isTransferring ? 'جارٍ التحويل عبر نظام سريع...' : 'تحويل الرصيد لحسابي البنكي الآن'}
              </span>
            </button>

            {transferSuccess && (
              <div className="text-[11px] text-emerald-700 font-semibold text-center flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded">
                <Check className="w-3.5 h-3.5" />
                <span>تم إرسال أمر التحويل بنجاح لحسابك البنكي!</span>
              </div>
            )}

            <button
              onClick={handleTriggerSimulatedPayment}
              disabled={isSimulatingPayment}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-300"
              title="محاكاة اشتراك عميل وإيداع فوري في حسابك المربوط"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {isSimulatingPayment ? 'جارٍ تحصيل اشتراك تجريبي...' : 'تجربة استقبال دفعة عميل جديدة (+699 ر.س)'}
              </span>
            </button>

            {paymentSimulatedSuccess && (
              <div className="text-[10px] text-indigo-700 font-semibold text-center bg-indigo-50 py-0.5 rounded">
                تم استقبال 699 ر.س بنجاح وأضيفت لرصيدك المربوط!
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'bank'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>بيانات الحساب البنكي والمالك</span>
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'gateway'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>إعدادات بوابة الدفع (Gateway Config)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>كود البرمجة والربط (API & Webhooks)</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'payouts'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>سجل التحويلات البنكية للمالك ({payouts?.length})</span>
          </button>
        </div>

        {/* Tab 1: Bank & Business Entity Details */}
        {activeTab === 'bank' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-5 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-slate-700">
              <div className="font-bold text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>حساب التحصيل المالي المباشر للمالك (المستفيد الأول):</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                هذه البيانات المالية يتم برمجتها في خوارزمية بوابة الدفع، بحيث تُحوَّل كافة مبالغ المشتركين تلقائياً إلى رقم الآيبان المدون أدناه، وتظهر هذه البيانات الضريبية على الفواتير الرسمية الصادرة للعملاء المتوافقة مع هيئة الزكاة والضريبة والجمارك (ZATCA).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اسم المستفيد المالي (المالك) *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  البريد الإلكتروني المالي للمالك *
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-emerald-50/30"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  البريد المستخدم لإشعارات إيداعات الدفع وأوامر التسوية اليومية
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اسم المنشأة التجارية / الكيان التجاري *
                </label>
                <input
                  type="text"
                  required
                  value={merchantBusinessName}
                  onChange={(e) => setMerchantBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رقم السجل التجاري (CR Number) *
                </label>
                <input
                  type="text"
                  required
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  الرقم الضريبي للمنشأة (VAT ID) *
                </label>
                <input
                  type="text"
                  required
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اسم البنك المعتمد للتحصيل *
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  رقم الآيبان البنكي للتحويل المباشر (IBAN) *
                </label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="Enter Global IBAN (e.g. PS00...)"
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 uppercase tracking-wider font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رقم الحساب الداخلي (Account Number)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رمز السويفت (SWIFT / BIC Code)
                </label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {saveSuccess ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم حفظ وربط بيانات المالك المالية بنجاح داخل كود بوابة الدفع!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>البيانات مشفرة ومحمية وفق أعلى معايير الأمان العالمية</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتحديث بيانات المالك</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Payment Gateway Programming & Configurations */}
        {activeTab === 'gateway' && (
          <div className="p-6 space-y-5 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">حالة الربط والبرمجة الحية:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    بوابة الدفع موصولة بحساب المالك <span className="font-mono font-bold text-slate-700">{ownerEmail}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>متصل حي (Live Connected)</span>
                  </span>

                  <button
                    onClick={handlePingGateway}
                    disabled={isPinging}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="فحص سرعة استجابة البوابة والاتصال بالبنك"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>{isPinging ? 'جارٍ الفحص...' : 'فحص الاتصال (Ping)'}</span>
                  </button>
                </div>
              </div>

              {pingResult && (
                <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-900 space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      استجابة الخادم: 200 OK (سرعة الاستجابة: {pingResult.latencyMs}ms)
                    </span>
                    <span className="text-slate-400">آخر فحص: {pingResult.lastChecked}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    تم التحقق من ربط المستفيد: <span className="font-semibold text-slate-800">{pingResult.ownerBeneficiary}</span> | حساب الإيداع: <span className="font-mono font-semibold">{pingResult?.ibanMasked}</span> ({pingResult.bankName})
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  بيئة البوابة البرمجية (Gateway Environment)
                </label>
                <select
                  value={gatewayMode}
                  onChange={(e) => setGatewayMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white font-medium"
                >
                  <option value="live">الوضع المباشر الحي (Live Production - SAMA)</option>
                  <option value="sandbox">الوضع التجريبي (Sandbox Testing Mode)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  دورية التحويل التلقائي للأرباح إلى آيبانك
                </label>
                <select
                  value={payoutSchedule}
                  onChange={(e) => setPayoutSchedule(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white font-medium"
                >
                  <option value="daily">تحويل يومي تلقائي إلى الآيبان (نهاية كل يوم)</option>
                  <option value="weekly">تحويل أسبوعي (كل يوم خميس)</option>
                  <option value="monthly">تحويل شهري (نهاية الشهر الميلادي)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  معرّف التاجر المالي المخصص للمالك (Merchant ID - MID)
                </label>
                <input
                  type="text"
                  readOnly
                  value={merchantKeyId}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    المفتاح العام للبوابة (Public API Key)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="pk_live_tawtheefx_8839021948201"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    المفتاح السري المشفر (Secret Key)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      readOnly
                      value="••••••••  (محفوظ على الخادم فقط)"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رابط إشعار العمليات الفورية (Webhook Notification Endpoint)
                </label>
                <input
                  type="text"
                  readOnly
                  value="https://tawtheefx.sa/api/payments/webhook"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  حسابك البنكي لدى <span className="font-bold">{bankName}</span> مربوط برمجياً بنجاح لاستقبال دفعات العملاء (مدى، فيزا، ماستركارد، Apple Pay، stc pay).
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Programming Code Snippets */}
        {activeTab === 'code' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>كود البرمجة لربط بوابة الدفع وحساب المالك المالي</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  أكواد تشغيلية جاهزة للواجهة الخلفية (Backend) تبيّن كيفية توجيه المبالغ لحسابك المعتمد
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setCodeLanguage('nodejs')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    codeLanguage === 'nodejs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Node.js / Express
                </button>
                <button
                  onClick={() => setCodeLanguage('webhook')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    codeLanguage === 'webhook' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Webhook Receiver
                </button>
                <button
                  onClick={() => setCodeLanguage('curl')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    codeLanguage === 'curl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  cURL Test
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 text-slate-200 border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono">
                  {codeLanguage === 'nodejs'
                    ? 'server/payments/gatewayInitializer.ts'
                    : codeLanguage === 'webhook'
                    ? 'server/routes/paymentWebhook.ts'
                    : 'terminal-curl-charge.sh'}
                </span>

                <button
                  onClick={() =>
                    handleCopyCode(
                      codeLanguage === 'nodejs'
                        ? codeSnippets.nodejs
                        : codeLanguage === 'webhook'
                        ? codeSnippets.webhook
                        : codeSnippets.curl
                    )
                  }
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-[11px]"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <pre className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-left" dir="ltr">
                <code>
                  {codeLanguage === 'nodejs'
                    ? codeSnippets.nodejs
                    : codeLanguage === 'webhook'
                    ? codeSnippets.webhook
                    : codeSnippets.curl}
                </code>
              </pre>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 flex items-center justify-between">
              <span>
                💡 تم إدراج بريدك <span className="font-mono font-bold">{ownerEmail}</span> ورقم الآيبان <span className="font-mono font-bold">{iban}</span> ديناميكياً داخل الكود لضمان صحة التحويلات.
              </span>
            </div>
          </div>
        )}

        {/* Tab 4: Payout History */}
        {activeTab === 'payouts' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-slate-500">
              سجل التحويلات المالية التي تم إرسالها إلى حسابك البنكي عبر نظام المدفوعات السريعة (سريع):
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">رقم الحوالة</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                    <th className="py-2.5 px-3">المبلغ المحول</th>
                    <th className="py-2.5 px-3">الحساب المستلم</th>
                    <th className="py-2.5 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-indigo-600">{po.referenceNumber}</td>
                      <td className="py-3 px-3 text-slate-600">{po.date}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {po.amountSAR.toLocaleString('en-US', { minimumFractionDigits: 2 })} ر.س
                      </td>
                      <td className="py-3 px-3 text-slate-500">{po?.ibanMasked} ({po.bankName})</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                          <span>{po.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
