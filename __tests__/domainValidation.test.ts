import { describe, it, expect } from '@jest/globals';
import {
  extractDomain,
  validateUserDomain,
  DEFAULT_ALLOWED_DOMAIN,
  RESTRICTED_DOMAIN_ERROR,
  UNVERIFIED_EMAIL_ERROR,
} from '../src/utils/domainValidation';

describe('Domain Validation Utilities', () => {
  describe('extractDomain', () => {
    it('should extract domain correctly from valid emails', () => {
      expect(extractDomain('user@hbplus.fit')).toBe('hbplus.fit');
      expect(extractDomain('john.doe+work@hbplus.fit')).toBe('hbplus.fit');
      expect(extractDomain('USER@HBPLUS.FIT')).toBe('hbplus.fit');
      expect(extractDomain('  employee@hbplus.fit  ')).toBe('hbplus.fit');
    });

    it('should return null for invalid or malformed emails', () => {
      expect(extractDomain('')).toBeNull();
      expect(extractDomain('plainaddress')).toBeNull();
      expect(extractDomain('@hbplus.fit')).toBeNull();
      expect(extractDomain('user@')).toBeNull();
      expect(extractDomain('user@hbplus fit')).toBeNull();
      expect(extractDomain(null)).toBeNull();
      expect(extractDomain(undefined)).toBeNull();
    });
  });

  describe('validateUserDomain - Security & Authorization', () => {
    it('should grant access to verified email ending with @hbplus.fit', () => {
      const result = validateUserDomain('employee@hbplus.fit', true);
      expect(result.isAllowed).toBe(true);
      expect(result.domain).toBe('hbplus.fit');
      expect(result.errorMessage).toBeUndefined();
    });

    it('should grant access regardless of email case', () => {
      const result = validateUserDomain('EMPLOYEE@HBPLUS.FIT', true);
      expect(result.isAllowed).toBe(true);
      expect(result.domain).toBe('hbplus.fit');
    });

    it('should reject standard personal emails (e.g., someone@gmail.com) with exact error message', () => {
      const result = validateUserDomain('someone@gmail.com', true);
      expect(result.isAllowed).toBe(false);
      expect(result.domain).toBe('gmail.com');
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);
      expect(result.errorMessage).toBe(
        'Access restricted. Please login using your official domain email.'
      );
    });

    it('should reject unverified email even if domain matches @hbplus.fit', () => {
      const result = validateUserDomain('employee@hbplus.fit', false);
      expect(result.isAllowed).toBe(false);
      expect(result.errorMessage).toBe(UNVERIFIED_EMAIL_ERROR);
    });

    it('should prevent domain spoofing and subdomain prefix attacks', () => {
      // Subdomain spoofing: attacker@hbplus.fit.evil.com
      const res1 = validateUserDomain('attacker@hbplus.fit.evil.com', true);
      expect(res1.isAllowed).toBe(false);
      expect(res1.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);

      // Prefix spoofing: user@fakepretendhbplus.fit
      const res2 = validateUserDomain('user@fakepretendhbplus.fit', true);
      expect(res2.isAllowed).toBe(false);
      expect(res2.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);

      // Similar domain spoofing: user@hbplusfit.com
      const res3 = validateUserDomain('user@hbplusfit.com', true);
      expect(res3.isAllowed).toBe(false);
      expect(res3.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);
    });

    it('should reject null or undefined email', () => {
      const resNull = validateUserDomain(null, true);
      expect(resNull.isAllowed).toBe(false);
      expect(resNull.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);

      const resUndef = validateUserDomain(undefined, true);
      expect(resUndef.isAllowed).toBe(false);
    });

    describe('Safe Evaluator Test Configuration', () => {
      it('should allow evaluator email when explicitly specified in testAllowedEmails', () => {
        const result = validateUserDomain('evaluator@gmail.com', true, {
          testAllowedEmails: ['evaluator@gmail.com', 'interviewer@example.com'],
        });
        expect(result.isAllowed).toBe(true);
      });

      it('should still reject other unauthorized emails even when testAllowedEmails is set', () => {
        const result = validateUserDomain('random.stranger@gmail.com', true, {
          testAllowedEmails: ['evaluator@gmail.com'],
        });
        expect(result.isAllowed).toBe(false);
        expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);
      });

      it('should allow custom domain override when configured', () => {
        const result = validateUserDomain('admin@custom-hbplus.com', true, {
          allowedDomain: 'custom-hbplus.com',
        });
        expect(result.isAllowed).toBe(true);
      });
    });
  });
});
