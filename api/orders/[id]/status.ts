import { getDb } from '../../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const db = getDb();
  const s = await db.collection('orders').doc(String(req.query.id)).get();
  res.json({ status: s.exists ? s.data()!.status : 'not_found' });
}
