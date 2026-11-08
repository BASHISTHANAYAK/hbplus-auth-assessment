import { Auth, User as FirebaseUser } from 'firebase/auth';

export interface PlatformSignInResult {
  firebaseUser: FirebaseUser | null;
  error?: string;
  isCancelled?: boolean;
}

export interface IAuthAdapter {
  signInWithGoogle(auth: Auth): Promise<PlatformSignInResult>;
  signOut(auth: Auth): Promise<void>;
}
