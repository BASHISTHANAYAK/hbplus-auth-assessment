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
      expect(extractDomain('user@outlook.com')).toBe('outlook.com');
      expect(extractDomain('john.doe+work@outlook.com')).toBe('outlook.com');
      expect(extractDomain('USER@OUTLOOK.COM')).toBe('outlook.com');
      expect(extractDomain('  employee@outlook.com  ')).toBe('outlook.com');
    });

    it('should return null for invalid or malformed emails', () => {
      expect(extractDomain('')).toBeNull();
      expect(extractDomain('plainaddress')).toBeNull();
      expect(extractDomain('@outlook.com')).toBeNull();
      expect(extractDomain('user@')).toBeNull();
      expect(extractDomain('user@outlook com')).toBeNull();
      expect(extractDomain(null)).toBeNull();
      expect(extractDomain(undefined)).toBeNull();
    });
  });

  describe('validateUserDomain - Security & Authorization', () => {
    it('should grant access to verified email ending with @outlook.com', () => {
      const result = validateUserDomain('employee@outlook.com', true);
      expect(result.isAllowed).toBe(true);
      expect(result.domain).toBe('outlook.com');
      expect(result.errorMessage).toBeUndefined();
    });

    it('should grant access regardless of email case', () => {
      const result = validateUserDomain('EMPLOYEE@OUTLOOK.COM', true);
      expect(result.isAllowed).toBe(true);
      expect(result.domain).toBe('outlook.com');
    });

    it('should reject standard personal emails (e.g., someone@gmail.com) with exact error message', () => {
      const result = validateUserDomain('someone@gmail.com', true);
      expect(result.isAllowed).toBe(false);
      expect(result.domain).toBe('gmail.com');
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);
      expect(result.errorMessage).toContain('@outlook.com');
    });

    it('should reject unverified email even if domain matches @outlook.com', () => {
      const result = validateUserDomain('employee@outlook.com', false);
      expect(result.isAllowed).toBe(false);
      expect(result.errorMessage).toBe(UNVERIFIED_EMAIL_ERROR);
    });

    it('should prevent domain spoofing and subdomain prefix attacks', () => {
      // Subdomain spoofing: attacker@outlook.com.evil.com
      const res1 = validateUserDomain('attacker@outlook.com.evil.com', true);
      expect(res1.isAllowed).toBe(false);
      expect(res1.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);

      // Prefix spoofing: user@fakepretendoutlook.com
      const res2 = validateUserDomain('user@fakepretendoutlook.com', true);
      expect(res2.isAllowed).toBe(false);
      expect(res2.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR);

      // Similar domain spoofing: user@outlookcompany.com
      const res3 = validateUserDomain('user@outlookcompany.com', true);
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
        const result = validateUserDomain('admin@custom-company.com', true, {
          allowedDomain: 'custom-company.com',
        });
        expect(result.isAllowed).toBe(true);
      });
    });
  });
});
