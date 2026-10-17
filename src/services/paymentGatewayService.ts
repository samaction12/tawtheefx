/** Gateway status for the owner dashboard. All credentials live on the server (.env); nothing secret is bundled here. */
import { OwnerFinancialProfile } from '../types';
import { authedFetch } from './auth';

export interface PaymentGatewayConfig {
  gatewayProvider: string; merchantId: string; ownerName: string; ownerEmail: string; merchantBusinessName: string;
  crNumber: string; vatNumber: string; bankName: string; iban: string; accountNumber: string; swiftCode: string;
  apiKeyLive: string; apiSecretLive: string; webhookEndpoint: string; webhookSecret: string;
  environment: 'live' | 'sandbox'; settlementCurrency: 'SAR'; payoutSchedule: 'instant' | 'daily' | 'weekly' | 'monthly';
  autoDisburseToIban: boolean; commissionFeePercent: number;
}

export const DEFAULT_OWNER_GATEWAY_CONFIG: PaymentGatewayConfig = {
  gatewayProvider: 'Moyasar', merchantId: '', ownerName: '', ownerEmail: '', merchantBusinessName: '', crNumber: '', vatNumber: '',
  bankName: '', iban: '', accountNumber: '', swiftCode: '', apiKeyLive: '', apiSecretLive: '', webhookEndpoint: '/api/webhooks/moyasar',
  webhookSecret: '', environment: 'live', settlementCurrency: 'SAR', payoutSchedule: 'weekly', autoDisburseToIban: false, commissionFeePercent: 0,
};

export interface GatewayPingResult {
  status: 'connected' | 'error'; latencyMs: number; environment: string; merchantId: string; ownerBeneficiary: string;
  ownerEmail: string; ibanMasked: string; bankName: string; paymentRails: string[]; zatcaCompliance: boolean; lastChecked: string;
}

export async function testGatewayConnection(config: PaymentGatewayConfig): Promise<GatewayPingResult> {
  const t0 = Date.now();
  let s: any = {};
  try { s = await (await authedFetch('/api/admin/gateway-status')).json(); } catch { /* reported as error below */ }
  const rails = [s.card && 'بطاقة ائتمان (مدى / Visa / Mastercard)', s.bank && 'حوالة بنكية'].filter(Boolean) as string[];
  return {
    status: rails.length ? 'connected' : 'error', latencyMs: Date.now() - t0, environment: 'مفاتيح الخادم',
    merchantId: s.card ? 'مضبوط' : 'غير مضبوط', ownerBeneficiary: config.ownerName, ownerEmail: config.ownerEmail,
    ibanMasked: s?.ibanMasked || '—', bankName: s.bankName || '—', paymentRails: rails,
    zatcaCompliance: false, lastChecked: new Date().toLocaleTimeString('ar-SA'),
  };
}

export function getBackendIntegrationCode(_c: PaymentGatewayConfig) {
  const note = '// التكامل منفّذ في server.ts (إنشاء الطلب، الفاتورة، التحقق من webhook). المفاتيح في ملف .env على الخادم فقط.';
  return { nodejs: note, webhook: note, curl: '# لا حاجة لاستدعاءات يدوية؛ راجع README.md' };
}

export function profileToGatewayConfig(p: OwnerFinancialProfile): PaymentGatewayConfig {
  return { ...DEFAULT_OWNER_GATEWAY_CONFIG, ownerName: p.ownerName, ownerEmail: p.ownerEmail, merchantBusinessName: p.merchantBusinessName,
    crNumber: p.crNumber, vatNumber: p.vatNumber, bankName: p.bankName, iban: p?.iban, accountNumber: p.accountNumber, swiftCode: p?.swiftCode,
    payoutSchedule: p.payoutSchedule, environment: p.gatewayMode, merchantId: p.merchantKeyId };
}
