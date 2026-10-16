import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from 'firebase/auth';

import { app } from './firebase';

const auth = () => getAuth(app);

// تسجيل دخول الإدارة بالبريد وكلمة المرور
export const adminSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth(), email, password);

// تسجيل دخول المستخدم العادي بجوجل (Redirect أفضل للموبايل)
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  // على الموبايل نفضل Redirect، على الديسكتوب نقدر نستخدم Popup كـ fallback
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    await signInWithRedirect(auth(), provider);
  } else {
    try {
      await signInWithPopup(auth(), provider);
    } catch (err: any) {
      // لو الـ popup انحظر، نرجع لـ redirect
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth(), provider);
      } else {
        throw err;
      }
    }
  }
};

// استدعاء هذه الدالة مرة واحدة عند تحميل التطبيق لمعالجة الرجوع من جوجل
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth());
    return result; // null لو ما في redirect
  } catch (error) {
    console.error('Google redirect error:', error);
    throw error;
  }
};

// تسجيل الخروج
export const adminSignOut = () => signOut(auth());

// التحقق من صلاحية الإدارة فقط (Custom Claim)
export function onAdminChange(cb: (isAdmin: boolean) => void) {
  return onIdTokenChanged(auth(), async (u) => {
    if (!u) return cb(false);

    try {
      const token = await u.getIdTokenResult(true); // force refresh
      cb(token.claims.admin === true);
    } catch {
      cb(false);
    }
  });
}

// إرسال طلبات الإدارة بالتوكن
export async function authedFetch(
  path: string,
  init: RequestInit = {}
) {
  const user = auth().currentUser;
  const headers = new Headers(init.headers);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (user) {
    headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  }

  return fetch(path, { ...init, headers });
}
