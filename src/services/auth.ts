
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { app } from './firebase';

const auth = () => getAuth(app);

// تسجيل دخول الإدارة بالبريد وكلمة المرور
export const adminSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth(), email, password);

// تسجيل دخول المستخدم العادي بجوجل
export const googleSignIn = () =>
  signInWithPopup(auth(), new GoogleAuthProvider());

// تسجيل الخروج
export const adminSignOut = () => signOut(auth());

// التحقق من صلاحية الإدارة فقط
export function onAdminChange(cb: (isAdmin: boolean) => void) {
  return onIdTokenChanged(auth(), async (u) => {
    if (!u) return cb(false);

    const token = await u.getIdTokenResult();
    cb(token.claims.admin === true);
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
