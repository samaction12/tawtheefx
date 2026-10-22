import crypto from 'node:crypto';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export const VAT_RATE = 0; // No VAT
export const CATALOG: Record<string, { name: string; price: number }> = {
  'pkg-standard': { name: 'Standard Package', price: 19 },
  'pkg-pro-interview': { name: 'Pro Hire Package', price: 49 },
  'pkg-enterprise': { name: 'Enterprise Package', price: 149 },
};

let _db: any = null;
export function getDb() {
  if (_db) return _db;
  if (!getApps().length) {
    initializeApp({
      credential: process.env.FIREBASE_SERVICE_ACCOUNT
        ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
        : applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  _db = process.env.FIRESTORE_DATABASE_ID ? getFirestore(process.env.FIRESTORE_DATABASE_ID) : getFirestore();
  return _db;
}
export const getAdminAuth = () => getAuth();
export { FieldValue };

export const str = (v: unknown, max: number) => typeof v === 'string' ? v.trim().slice(0, max) : '';
export const safeEq = (a: string, b: string) => {
  const h = (s: string) => crypto.createHash('sha256').update(s).digest();
  return crypto.timingSafeEqual(h(a), h(b));
};

export async function requireAdmin(req: any, res: any): Promise<boolean> {
  try {
    const t = (req.headers.authorization || '').replace(/^Bearer /, '');
    const dec = await getAdminAuth().verifyIdToken(t);
    if (dec.admin !== true) { res.status(403).json({ error: 'forbidden' }); return false; }
    (req as any).uid = dec.uid;
    return true;
  } catch { res.status(401).json({ error: 'unauthorized' }); return false; }
}

export async function markPaid(orderId: string, method: string, ref: string) {
  const db = getDb();
  await db.runTransaction(async (tx: any) => {
    const oRef = db.collection('orders').doc(orderId);
    const cRef = db.collection('counters').doc('invoices');
    const [o, c] = await Promise.all([tx.get(oRef), tx.get(cRef)]);
    if (!o.exists || o.data()!.status === 'paid') return;
    const n = ((c.data()?.n as number) || 0) + 1;
    const d = o.data()!;
    tx.set(cRef, { n });
    tx.set(db.collection('invoices').doc(orderId), {
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(n).padStart(6, '0'),
      orderId, customerName: d.company, email: d.email, packageName: d.packageName, packageId: d.packageId,
      amount: d.amount, vatAmount: 0, totalWithVat: d.total,
      currency: 'USD', paymentMethod: method, paymentRef: ref,
      status: 'completed', date: new Date().toISOString().slice(0, 10),
    });
    tx.update(oRef, { status: 'paid', paidAt: FieldValue.serverTimestamp(), paymentMethod: method });
  });
}
