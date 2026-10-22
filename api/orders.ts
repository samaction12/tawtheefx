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
      type: ['fulltime', 'remote', 'hybrid', 'contract'].includes(job.type) ? job.type : 'fulltime',
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

  // Card Payment via Paddle
  await db.collection('orders').doc(id).set({ ...base, status: 'pending_payment' });
  return res.json({
    orderId: id,
    reference,
    total,
    checkoutUrl: 'https://tawtheefx-app.lahza.store/products/stander'
  });
}
