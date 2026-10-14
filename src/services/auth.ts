import { getAuth, signInWithEmailAndPassword, signOut, onIdTokenChanged } from 'firebase/auth';
import { app } from './firebase';

const auth = () => getAuth(app);
export const adminSignIn = (email: string, password: string) => signInWithEmailAndPassword(auth(), email, password);
export const adminSignOut = () => signOut(auth());

export function onAdminChange(cb: (isAdmin: boolean) => void) {
  return onIdTokenChanged(auth(), async (u) => {
    if (!u) return cb(false);
    cb((await u.getIdTokenResult()).claims.admin === true);
  });
}

export async function authedFetch(path: string, init: RequestInit = {}) {
  const token = await auth().currentUser?.getIdToken();
  return fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers || {}), Authorization: `Bearer ${token}` } });
}
