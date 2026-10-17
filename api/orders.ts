import crypto from 'node:crypto';
import { getDb, CATALOG, VAT_RATE, str } from './_lib.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const db = getDb();
  const { packageId, method, email, company, job } = req.body || {};
  const pkg = CATALOG[packageId as string];
  if (!pkg) return res.status(400).json({ error: 'invalid_package' });
  if (!['card', 'bank_transfer'].includes(method)) return res.status(400).json({ error: 'invalid_method' });

  const mail = str(email, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return res.status(400).json({ error: 'invalid_email' });
  const comp = str(company, 120);
  if (comp.length < 2) return res.status(400).json({ error: 'invalid_company' });

  let cleanJob: Record<string, unknown> | null = null;
  if (job && typeof job === 'object') {
    cleanJob = {
      title: str(job.title, 120),
      company: comp,
      location: str(job.location, 80),
      type: ['دوام كامل', 'عن بُعد', 'هجين', 'عقد'].includes(job.type) ? job.type : 'دوام كامل',
      description: str(job.description, 4000),
      requirements: Array.isArray(job.requirements)
        ? job.requirements.slice(0, 20).map((r: unknown) => str(r, 200))
        : [],
    };
    if (!cleanJob.title) cleanJob = null;
  }

  const id = crypto.randomUUID();
  const vat = Math.round(pkg.price * VAT_RATE * 100) / 100;
  const total = Math.round((pkg.price + vat) * 100) / 100;
  const reference = 'TX-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  const base = {
    email: mail, company: comp, packageId, packageName: pkg.name,
    amount: pkg.price, vat, total, method, reference, job: cleanJob,
    createdAt: FieldValue.serverTimestamp(),
  };

  if (method === 'bank_transfer') {
    await db.collection('orders').doc(id).set({ ...base, status: 'awaiting_transfer' });
    return res.json({
      orderId: id, reference, total,
      bank: {
        name: process.env.BANK_NAME || '',
        accountName: process.env.BANK_ACCOUNT_NAME || '',
        iban: process.env.BANK_IBAN || '',
      },
    });
  }

  const key = process.env.MOYASAR_SECRET_KEY;
  if (!key) return res.status(503).json({ error: 'card_payments_not_configured' });

  const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const r = await fetch('https://api.moyasar.com/v1/invoices', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(total * 100),
      currency: 'SAR',
      description: pkg.name + ' - ' + reference,
      callback_url: publicUrl + '/api/webhooks/moyasar',
      success_url: publicUrl + '/?order=' + id,
      back_url: publicUrl,
      metadata: { orderId: id },
    }),
  });

  if (!r.ok) {
    console.error('moyasar', r.status, await r.text());
    return res.status(502).json({ error: 'gateway_error' });
  }
  const inv: any = await r.json();
  await db.collection('orders').doc(id).set({ ...base, status: 'pending_payment', invoiceId: inv.id });
  res.json({ orderId: id, reference, total, checkoutUrl: 'https://tawtheefx-app.paddle.com/checkout?_ptxn=pri_01m54pby61c5yn0svcqpp5dw21' });
}
