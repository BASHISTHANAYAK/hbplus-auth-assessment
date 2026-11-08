import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, isFirestoreEnabled } from '../config/firebase';
import { authConfig } from '../config/authConfig';
import { validateUserDomain, extractDomain } from '../utils/domainValidation';
import { AuthUser, UserRole } from '../types/auth';
import { syncUserProfile, determineUserRole } from './firestoreService';
import { authAdapter } from './authAdapter';

/**
 * Maps a Firebase user to application AuthUser model.
 */
export function mapFirebaseUser(user: FirebaseUser, role: UserRole = 'employee'): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    domain: extractDomain(user.email),
    role,
    lastLoginAt: new Date().toISOString(),
  };
}

export interface SignInResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  isCancelled?: boolean;
}

/**
 * Initiates Google OAuth Sign-in flow.
 * Works seamlessly on Web using Firebase Popup, and integrates on native via OAuth Credential.
 */
export async function signInWithGoogleFlow(): Promise<SignInResult> {
  if (!isFirebaseConfigured || !auth) {
    return {
      success: false,
      error:
        'Firebase is not configured. Please supply EXPO_PUBLIC_FIREBASE_* environment variables.',
    };
  }

  try {
    const adapterResult = await authAdapter.signInWithGoogle(auth);

    if (adapterResult.isCancelled) {
      return {
        success: false,
        isCancelled: true,
      };
    }

    if (adapterResult.error || !adapterResult.firebaseUser) {
      return {
        success: false,
        error: adapterResult.error || 'Authentication failed. Please try again.',
      };
    }

    const firebaseUser = adapterResult.firebaseUser;

    // Strict Domain & Email Verification Enforcement
    const validation = validateUserDomain(
      firebaseUser.email,
      firebaseUser.emailVerified,
      {
        allowedDomain: authConfig.allowedDomain,
        testAllowedEmails: authConfig.testAllowedEmails,
      }
    );

    if (!validation.isAllowed) {
      // Immediately revoke unauthorized session from client
      await firebaseSignOut(auth);
      return {
        success: false,
        error: validation.errorMessage || authConfig.restrictedErrorMessage,
      };
    }

    // Role determination & optional Firestore sync
    const initialRole = determineUserRole(firebaseUser.email);
    const authUser = mapFirebaseUser(firebaseUser, initialRole);

    if (isFirestoreEnabled) {
      try {
        const syncedRole = await syncUserProfile(authUser);
        authUser.role = syncedRole;
      } catch {
        // Sync errors are non-blocking
      }
    }

    return {
      success: true,
      user: authUser,
    };
  } catch (error: any) {
    // Handle user popup closure / cancellation gracefully
    if (
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      return {
        success: false,
        isCancelled: true,
      };
    }

    if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
      };
    }

    if (error.code === 'auth/unauthorized-domain') {
      return {
        success: false,
        error:
          'Firebase Auth domain unauthorized. Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.',
      };
    }

    return {
      success: false,
      error: error.message || 'Authentication failed. Please try again.',
    };
  }
}

/**
 * Signs out the authenticated user.
 */
export async function signOutUser(): Promise<void> {
  if (auth) {
    await authAdapter.signOut(auth);
  }
}

/**
 * Subscribes to Firebase auth state changes with domain verification guard.
 */
export function subscribeToAuthState(
  onUserChanged: (user: AuthUser | null, error?: string) => void
): () => void {
  const currentAuth = auth;
  if (!currentAuth) {
    onUserChanged(null);
    return () => {};
  }

  return onAuthStateChanged(currentAuth, async (firebaseUser) => {
    if (!firebaseUser) {
      onUserChanged(null);
      return;
    }

    // Validate domain on session restoration
    const validation = validateUserDomain(
      firebaseUser.email,
      firebaseUser.emailVerified,
      {
        allowedDomain: authConfig.allowedDomain,
        testAllowedEmails: authConfig.testAllowedEmails,
      }
    );

    if (!validation.isAllowed) {
      await firebaseSignOut(currentAuth);
      onUserChanged(null, validation.errorMessage || authConfig.restrictedErrorMessage);
      return;
    }

    const role = determineUserRole(firebaseUser.email);
    const authUser = mapFirebaseUser(firebaseUser, role);
    onUserChanged(authUser);
  });
}
