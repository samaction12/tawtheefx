import { getDb, safeEq, markPaid } from '../_lib';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const db = getDb();

  const secret = process.env.MOYASAR_WEBHOOK_SECRET;
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (!secret || !safeEq(String(body?.secret_token || ''), secret)) return res.status(401).end();

  const paymentId = body?.data?.id || body?.id;
  if (!paymentId) return res.status(400).end();

  const r = await fetch('https://api.moyasar.com/v1/payments/' + encodeURIComponent(paymentId), {
    headers: { Authorization: 'Basic ' + Buffer.from(process.env.MOYASAR_SECRET_KEY + ':').toString('base64') },
  });
  if (!r.ok) return res.status(502).end();
  const p: any = await r.json();

  let orderId: string | undefined = p.metadata?.orderId;
  if (!orderId && p.invoice_id) {
    const q = await db.collection('orders').where('invoiceId', '==', p.invoice_id).limit(1).get();
    orderId = q.docs[0]?.id;
  }
  if (orderId && p.status === 'paid') {
    const o = await db.collection('orders').doc(orderId).get();
    if (o.exists && Math.round(o.data()!.total * 100) === p.amount && p.currency === 'SAR') {
      await markPaid(orderId, 'card', p.id);
    }
  }
  res.json({ ok: true });
}
