import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { IAuthAdapter, PlatformSignInResult } from './types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Web-specific authentication adapter using Firebase Popup.
 */
export const authAdapter: IAuthAdapter = {
  async signInWithGoogle(auth: Auth): Promise<PlatformSignInResult> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        firebaseUser: result.user,
      };
    } catch (error: any) {
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        return {
          firebaseUser: null,
          isCancelled: true,
        };
      }

      if (error.code === 'auth/network-request-failed') {
        return {
          firebaseUser: null,
          error: 'Network error. Please check your internet connection.',
        };
      }

      if (error.code === 'auth/unauthorized-domain') {
        return {
          firebaseUser: null,
          error:
            'Firebase Auth domain unauthorized. Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.',
        };
      }

      return {
        firebaseUser: null,
        error: error.message || 'Authentication failed. Please try again.',
      };
    }
  },

  async signOut(auth: Auth): Promise<void> {
    await firebaseSignOut(auth);
  },
};
