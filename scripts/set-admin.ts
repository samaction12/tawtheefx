// Usage: npx tsx scripts/set-admin.ts owner@example.com
import 'dotenv/config';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() });
const u = await getAuth().getUserByEmail(process.argv[2]);
await getAuth().setCustomUserClaims(u.uid, { admin: true });
console.log('Admin claim set for', u.email, '- sign out and in again.');
