export type UserRole = 'admin' | 'employee';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  domain: string | null;
  role: UserRole;
  lastLoginAt?: string;
}

export interface DomainValidationResult {
  isAllowed: boolean;
  domain: string | null;
  errorMessage?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  allowedDomain: string;
}
