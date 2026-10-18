import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onIdTokenChanged } from 'firebase/auth';
import { app } from './firebase';

const auth = () => getAuth(app);

export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(auth(), provider);
};

export const handleGoogleRedirectResult = async () => {
  try {
    return await getRedirectResult(auth());
  } catch (error) {
    console.error('Google redirect error:', error);
    throw error;
  }
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
  console.log("Admin login not fully implemented yet");
};
