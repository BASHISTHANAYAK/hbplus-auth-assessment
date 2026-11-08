import { describe, it, expect, jest } from '@jest/globals';

const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: mockDoc,
  getDoc: mockGetDoc,
  setDoc: mockSetDoc,
  serverTimestamp: jest.fn(),
  getFirestore: jest.fn(),
}));

import { determineUserRole, syncUserProfile } from '../src/services/firestoreService';
import { db, isFirestoreEnabled } from '../src/config/firebase';
import { AuthUser } from '../src/types/auth';

describe('Firestore Service & Configuration Guard', () => {
  const mockUser: AuthUser = {
    uid: 'test-user-123',
    email: 'employee@hbplus.fit',
    displayName: 'Test Employee',
    photoURL: 'https://example.com/avatar.jpg',
    emailVerified: true,
    domain: 'hbplus.fit',
    role: 'employee',
  };

  describe('isFirestoreEnabled default configuration', () => {
    it('should have Firestore disabled by default in test/standard environment', () => {
      expect(isFirestoreEnabled).toBe(false);
      expect(db).toBeNull();
    });
  });

  describe('determineUserRole', () => {
    it('should return employee for standard email', () => {
      expect(determineUserRole('john.doe@hbplus.fit')).toBe('employee');
    });

    it('should return employee if email is null', () => {
      expect(determineUserRole(null)).toBe('employee');
    });

    it('should return customRole if provided', () => {
      expect(determineUserRole('user@hbplus.fit', 'admin')).toBe('admin');
      expect(determineUserRole('user@hbplus.fit', 'employee')).toBe('employee');
    });
  });

  describe('syncUserProfile when Firestore is disabled', () => {
    it('should immediately return determined role without calling Firestore doc/getDoc/setDoc', async () => {
      mockDoc.mockClear();
      mockGetDoc.mockClear();
      mockSetDoc.mockClear();

      const role = await syncUserProfile(mockUser);

      expect(role).toBe('employee');
      expect(mockDoc).not.toHaveBeenCalled();
      expect(mockGetDoc).not.toHaveBeenCalled();
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should handle user without UID safely', async () => {
      const userWithoutUid = { ...mockUser, uid: '' };
      const role = await syncUserProfile(userWithoutUid);
      expect(role).toBe('employee');
      expect(mockDoc).not.toHaveBeenCalled();
    });
  });
});
