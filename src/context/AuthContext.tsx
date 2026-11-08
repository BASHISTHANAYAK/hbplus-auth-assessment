import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, AuthContextType } from '../types/auth';
import {
  signInWithGoogleFlow,
  signOutUser,
  subscribeToAuthState,
} from '../services/authService';
import { authConfig } from '../config/authConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser, errorMsg) => {
      setUser(currentUser);
      if (errorMsg) {
        setAuthError(errorMsg);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    clearError();
    setIsAuthenticating(true);
    try {
      const result = await signInWithGoogleFlow();
      if (result.success && result.user) {
        setUser(result.user);
        setAuthError(null);
        return true;
      } else if (result.isCancelled) {
        // User cancelled authentication (dismissed account picker or popup)
        // Safely return to the login screen, clear loading state, do not display an error
        setAuthError(null);
        return false;
      } else {
        setAuthError(result.error || authConfig.restrictedErrorMessage);
        setUser(null);
        return false;
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected authentication error occurred.');
      setUser(null);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [clearError]);

  const signOut = useCallback(async () => {
    clearError();
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign out.');
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        authError,
        signInWithGoogle,
        signOut,
        clearError,
        allowedDomain: authConfig.allowedDomain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
