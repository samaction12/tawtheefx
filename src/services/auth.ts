import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onIdTokenChanged, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from './firebase';

const auth = () => getAuth(app);

export const googleSignIn = async () => {
  const authInstance = auth();
  await setPersistence(authInstance, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(authInstance, provider);
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(authInstance, provider);
    } else {
      throw error;
    }
  }
};

export const handleGoogleRedirectResult = async () => {
  try { return await getRedirectResult(auth()); } catch (error) { throw error; }
};

export const adminSignOut = () => signOut(auth());

export function onAdminChange(cb: (isAdmin: boolean) => void) {
  return onIdTokenChanged(auth(), async (u) => {
    if (!u) return cb(false);
    try {
      const token = await u.getIdTokenResult(true);
      cb(token.claims.admin === true);
    } catch { cb(false); }
  });
}

export const adminSignIn = (email: string, password: string) => {
  console.log("Admin login not fully implemented");
};

// الدالة المفقودة اللي بتعمل المشكلة
export async function authedFetch(path: string, init: RequestInit = {}) {
  const user = auth().currentUser;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (user) headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  return fetch(path, { ...init, headers });
}
