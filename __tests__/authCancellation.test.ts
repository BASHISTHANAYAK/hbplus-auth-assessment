import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies
const mockSignIn = jest.fn<() => Promise<any>>();
const mockHasPlayServices = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);
const mockConfigure = jest.fn();
const mockCredential = jest.fn<(token: string) => any>().mockReturnValue({ providerId: 'google.com' });
const mockSignInWithCredential = jest.fn<(auth: any, cred: any) => Promise<any>>();

const mockAdapterSignInWithGoogle = jest.fn<() => Promise<any>>();
const mockAdapterSignOut = jest.fn<() => Promise<void>>();

jest.mock('@react-native-google-signin/google-signin', () => {
  return {
    GoogleSignin: {
      signIn: mockSignIn,
      hasPlayServices: mockHasPlayServices,
      configure: mockConfigure,
      signOut: jest.fn(),
    },
    statusCodes: {
      SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
      IN_PROGRESS: 'IN_PROGRESS',
      PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    },
    isCancelledResponse: (response: any) => response?.type === 'cancelled',
    isSuccessResponse: (response: any) => response?.type === 'success',
    isErrorWithCode: (error: any) => error != null && typeof error.code === 'string',
  };
});

jest.mock('../src/config/firebase', () => ({
  auth: { currentUser: null },
  isFirebaseConfigured: true,
  isFirestoreEnabled: false,
  db: null,
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: mockCredential,
  },
  signInWithCredential: mockSignInWithCredential,
  signOut: jest.fn(),
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('../src/services/authAdapter', () => ({
  authAdapter: {
    signInWithGoogle: () => mockAdapterSignInWithGoogle(),
    signOut: () => mockAdapterSignOut(),
  },
}));

import { authAdapter as nativeAuthAdapter } from '../src/services/authAdapter/authAdapter.native';
import { signInWithGoogleFlow } from '../src/services/authService';

describe('Google Sign-In Cancellation and Error Distinctions', () => {
  const dummyAuth = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAdapter.native.ts', () => {
    it('should distinguish user cancellation when response has type "cancelled" (isCancelledResponse)', async () => {
      // Library v13+ returns { type: 'cancelled', data: null } when user dismisses account picker
      mockSignIn.mockResolvedValueOnce({
        type: 'cancelled',
        data: null,
      });

      const result = await nativeAuthAdapter.signInWithGoogle(dummyAuth);

      expect(result.isCancelled).toBe(true);
      expect(result.firebaseUser).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should distinguish user cancellation when library throws SIGN_IN_CANCELLED error', async () => {
      const cancelError: any = new Error('User cancelled');
      cancelError.code = 'SIGN_IN_CANCELLED';
      mockSignIn.mockRejectedValueOnce(cancelError);

      const result = await nativeAuthAdapter.signInWithGoogle(dummyAuth);

      expect(result.isCancelled).toBe(true);
      expect(result.firebaseUser).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should distinguish user cancellation when library throws Android status code 12501', async () => {
      const cancelError: any = new Error('User cancelled');
      cancelError.code = '12501';
      mockSignIn.mockRejectedValueOnce(cancelError);

      const result = await nativeAuthAdapter.signInWithGoogle(dummyAuth);

      expect(result.isCancelled).toBe(true);
      expect(result.firebaseUser).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should distinguish genuine error when sign-in succeeds but no ID token was returned', async () => {
      mockSignIn.mockResolvedValueOnce({
        type: 'success',
        data: {
          idToken: null,
          user: { email: 'user@hbplus.fit', name: 'User' },
        },
      });

      const result = await nativeAuthAdapter.signInWithGoogle(dummyAuth);

      expect(result.isCancelled).toBeFalsy();
      expect(result.firebaseUser).toBeNull();
      expect(result.error).toContain('Google Sign-In succeeded, but no ID token was returned');
    });

    it('should succeed with valid ID token and exchange for Firebase credential', async () => {
      mockSignIn.mockResolvedValueOnce({
        type: 'success',
        data: {
          idToken: 'valid-google-id-token-xyz',
          user: { email: 'employee@hbplus.fit', name: 'Employee' },
        },
      });

      const mockUser = {
        uid: 'user-abc',
        email: 'employee@hbplus.fit',
        emailVerified: true,
      };

      mockSignInWithCredential.mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await nativeAuthAdapter.signInWithGoogle(dummyAuth);

      expect(result.isCancelled).toBeFalsy();
      expect(result.firebaseUser).toEqual(mockUser);
      expect(result.error).toBeUndefined();
      expect(mockCredential).toHaveBeenCalledWith('valid-google-id-token-xyz');
    });
  });

  describe('authService.ts - signInWithGoogleFlow cancellation', () => {
    it('should return isCancelled without error when auth adapter reports cancellation', async () => {
      mockAdapterSignInWithGoogle.mockResolvedValueOnce({
        firebaseUser: null,
        isCancelled: true,
      });

      const flowResult = await signInWithGoogleFlow();

      expect(flowResult.success).toBe(false);
      expect(flowResult.isCancelled).toBe(true);
      expect(flowResult.error).toBeUndefined();
    });

    it('should handle uncancelled authentication failure properly', async () => {
      mockAdapterSignInWithGoogle.mockResolvedValueOnce({
        firebaseUser: null,
        error: 'Google Sign-In succeeded, but no ID token was returned.',
      });

      const flowResult = await signInWithGoogleFlow();

      expect(flowResult.success).toBe(false);
      expect(flowResult.isCancelled).toBeFalsy();
      expect(flowResult.error).toContain('Google Sign-In succeeded, but no ID token was returned.');
    });
  });
});
