import {
  GoogleSignin,
  statusCodes,
  isCancelledResponse,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import {
  Auth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { IAuthAdapter, PlatformSignInResult } from './types';

// The Web Client ID from Firebase / Google Cloud project is passed to GoogleSignin
// so that the generated ID token is targeted at and verifiable by Firebase Auth.
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

let isConfigured = false;

function ensureConfigured() {
  if (!isConfigured) {
    GoogleSignin.configure({
      webClientId: webClientId || undefined,
      scopes: ['profile', 'email'],
    });
    isConfigured = true;
  }
}

/**
 * Native mobile authentication adapter for Android and iOS using Google Play Services / GoogleSignIn SDK.
 */
export const authAdapter: IAuthAdapter = {
  async signInWithGoogle(auth: Auth): Promise<PlatformSignInResult> {
    try {
      ensureConfigured();

      // Check if Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Initiate native Google authentication sheet/dialog
      const response = await GoogleSignin.signIn();

      // 1. Check for user cancellation via supported response helper & response type
      if (isCancelledResponse(response) || (response as any)?.type === 'cancelled') {
        return {
          firebaseUser: null,
          isCancelled: true,
        };
      }

      // 2. Extract ID token for successful sign-in
      let idToken: string | null = null;
      if (isSuccessResponse(response) && response.data?.idToken) {
        idToken = response.data.idToken;
      } else if (response && 'data' in response && response.data?.idToken) {
        idToken = response.data.idToken;
      } else if (response && 'idToken' in (response as any)) {
        idToken = (response as any).idToken;
      }

      // 3. Genuine failure: Sign-in was not cancelled, but no valid ID token was returned
      if (!idToken) {
        return {
          firebaseUser: null,
          error:
            'Google Sign-In succeeded, but no ID token was returned. Please verify EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID configuration.',
        };
      }

      // Exchange Google ID token for Firebase Auth credential
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      return {
        firebaseUser: userCredential.user,
      };
    } catch (error: any) {
      if (
        (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) ||
        error.code === statusCodes.SIGN_IN_CANCELLED ||
        error.code === '12501'
      ) {
        return {
          firebaseUser: null,
          isCancelled: true,
        };
      }

      if (
        (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) ||
        error.code === statusCodes.IN_PROGRESS
      ) {
        return {
          firebaseUser: null,
          error: 'Sign in is already in progress.',
        };
      }

      if (
        (isErrorWithCode(error) && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) ||
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        return {
          firebaseUser: null,
          error: 'Google Play Services is not available or outdated on this device.',
        };
      }

      return {
        firebaseUser: null,
        error: error.message || 'Native Google authentication failed. Check credentials and SHA-1 setup.',
      };
    }
  },

  async signOut(auth: Auth): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignore if native google session was not initialized
    }
    await firebaseSignOut(auth);
  },
};
