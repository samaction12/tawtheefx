import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import {
  JobListing,
  Applicant,
  PaymentTransaction,
  InterviewReminder,
  OwnerFinancialProfile,
  MarketingCampaign,
  SupportTicket,
  PayoutRecord
} from '../types';

let app: FirebaseApp;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigJson);
  const dbId = (firebaseConfigJson as any).firestoreDatabaseId || undefined;
  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

export { app, db };

// Connection Verification Test as per Firebase guidelines
export async function testFirebaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    if (!db) return { connected: false, message: 'قاعدة البيانات غير مهيأة' };
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true, message: 'تم الاتصال بقاعدة بيانات Firebase بنجاح' };
  } catch (error: any) {
    if (error?.message && error.message.includes('the client is offline')) {
      console.warn('Firebase is running in offline mode.');
      return { connected: false, message: 'العميل غير متصل بالإنترنت حالياً' };
    }
    // Any other response still confirms we reached or tested the firestore endpoint
    return { connected: false, message: 'تعذّر التحقق من قاعدة البيانات' };
  }
}

// -------------------------------------------------------------
// Cloud Sync API - Owner Financials (Protected and Persistent)
// -------------------------------------------------------------
export async function syncOwnerFinancialsToCloud(profile: OwnerFinancialProfile): Promise<void> {
  if (!db) return;
  try {
    const ref = doc(db, 'owner_settings', 'financials');
    await setDoc(ref, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.error('Error saving owner financials to Firestore:', e);
  }
}

export async function loadOwnerFinancialsFromCloud(): Promise<OwnerFinancialProfile | null> {
  if (!db) return null;
  try {
    const ref = doc(db, 'owner_settings', 'financials');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as OwnerFinancialProfile;
    }
  } catch (e) {
    console.error('Error reading owner financials from Firestore:', e);
  }
  return null;
}

// -------------------------------------------------------------
// Cloud Sync API - Jobs
// -------------------------------------------------------------
export async function syncJobToCloud(job: JobListing): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, 'jobs', job.id), {
      ...job,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error syncing job to Firestore:', e);
  }
}

export async function loadJobsFromCloud(): Promise<JobListing[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'jobs'));
    const jobs: JobListing[] = [];
    snap.forEach((d) => {
      jobs.push(d.data() as JobListing);
    });
    return jobs;
  } catch (e) {
    console.error('Error loading jobs from Firestore:', e);
    return [];
  }
}

// -------------------------------------------------------------
// Cloud Sync API - Applicants
// -------------------------------------------------------------
export async function syncApplicantToCloud(applicant: Applicant): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, 'applications', applicant.id), {
      ...applicant,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error syncing applicant to Firestore:', e);
  }
}

export async function loadApplicantsFromCloud(): Promise<Applicant[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'applications'));
    const list: Applicant[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Applicant);
    });
    return list;
  } catch (e) {
    console.error('Error loading applications from Firestore:', e);
    return [];
  }
}

// -------------------------------------------------------------
// Cloud Sync API - Transactions / Invoices
// -------------------------------------------------------------
export async function syncTransactionToCloud(tx: PaymentTransaction): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, 'invoices', tx.id), {
      ...tx,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error syncing transaction to Firestore:', e);
  }
}

export async function loadTransactionsFromCloud(): Promise<PaymentTransaction[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'invoices'));
    const list: PaymentTransaction[] = [];
    snap.forEach((d) => {
      list.push(d.data() as PaymentTransaction);
    });
    return list;
  } catch (e) {
    console.error('Error loading invoices from Firestore:', e);
    return [];
  }
}

// -------------------------------------------------------------
// Cloud Sync API - AI Marketing Campaigns
// -------------------------------------------------------------
export async function syncMarketingCampaignToCloud(campaign: MarketingCampaign): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, 'marketing_campaigns', campaign.id), {
      ...campaign,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error syncing marketing campaign to Firestore:', e);
  }
}

export async function loadMarketingCampaignsFromCloud(): Promise<MarketingCampaign[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'marketing_campaigns'));
    const list: MarketingCampaign[] = [];
    snap.forEach((d) => {
      list.push(d.data() as MarketingCampaign);
    });
    return list;
  } catch (e) {
    console.error('Error loading marketing campaigns from Firestore:', e);
    return [];
  }
}

// -------------------------------------------------------------
// Cloud Sync API - Support & Troubleshooting Tickets
// -------------------------------------------------------------
export async function syncSupportTicketToCloud(ticket: SupportTicket): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, 'support_tickets', ticket.id), {
      ...ticket,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error syncing support ticket to Firestore:', e);
  }
}

export async function loadSupportTicketsFromCloud(): Promise<SupportTicket[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'support_tickets'));
    const list: SupportTicket[] = [];
    snap.forEach((d) => {
      list.push(d.data() as SupportTicket);
    });
    return list;
  } catch (e) {
    console.error('Error loading support tickets from Firestore:', e);
    return [];
  }
}

// -------------------------------------------------------------
// Clean Slate Mode: Clears Mock Jobs & Applicants
// CRITICAL: NEVER clears or deletes owner financial settings or merchant payment profile!
// -------------------------------------------------------------
export async function clearOperationalDataFromCloud(): Promise<void> {
  if (!db) return;
  try {
    // Delete jobs
    const jobsSnap = await getDocs(collection(db, 'jobs'));
    const deleteJobs = jobsSnap.docs.map((d) => deleteDoc(d.ref));

    // Delete applications
    const appsSnap = await getDocs(collection(db, 'applications'));
    const deleteApps = appsSnap.docs.map((d) => deleteDoc(d.ref));

    await Promise.all([...deleteJobs, ...deleteApps]);
  } catch (e) {
    console.error('Error clearing operational data:', e);
  }
}

export async function loadSiteSettings(): Promise<{ announcement?: string } | null> {
  if (!db) return null;
  try { const s = await getDoc(doc(db, 'site_settings', 'main')); return s.exists() ? (s.data() as { announcement?: string }) : null; }
  catch { return null; }
}
