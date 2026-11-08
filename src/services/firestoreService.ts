import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirestoreEnabled } from '../config/firebase';
import { AuthUser, UserRole } from '../types/auth';

const ADMIN_EMAILS = (process.env.EXPO_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Determines role based on environment configuration or Firestore doc.
 */
export function determineUserRole(email: string | null, customRole?: UserRole): UserRole {
  if (customRole) return customRole;
  if (!email) return 'employee';
  const normalized = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) {
    return 'admin';
  }
  return 'employee';
}

/**
 * Syncs user data to Firestore under `users/{uid}`.
 * Gracefully handles permissions or offline scenarios.
 * If Firestore is disabled (default when no database is provisioned),
 * returns immediately without making network calls or emitting warnings.
 */
export async function syncUserProfile(user: AuthUser): Promise<UserRole> {
  if (!isFirestoreEnabled || !db || !user.uid) {
    return determineUserRole(user.email);
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingDoc = await getDoc(userDocRef);

    let assignedRole: UserRole = determineUserRole(user.email);

    if (existingDoc.exists()) {
      const data = existingDoc.data();
      if (data?.role) {
        assignedRole = data.role as UserRole;
      }
    }

    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        domain: user.domain,
        emailVerified: user.emailVerified,
        role: assignedRole,
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );

    return assignedRole;
  } catch (error) {
    console.warn('[Firestore] Error syncing user profile (ignoring non-fatal):', error);
    return determineUserRole(user.email);
  }
}
