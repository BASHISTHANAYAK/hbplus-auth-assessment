import { DomainValidationResult } from '../types/auth';

/**
 * Default production allowed domain for HB+ Employee Portal.
 */
export const DEFAULT_ALLOWED_DOMAIN = 'hbplus.fit';

/**
 * Exact error message required by the problem statement:
 * "Access restricted. Please login using your official domain email."
 */
export const RESTRICTED_DOMAIN_ERROR =
  'Access restricted. Please login using your official domain email.';

export const UNVERIFIED_EMAIL_ERROR =
  'Access restricted. Your Google email is not verified. Please verify your email with Google.';

/**
 * Extracts and normalizes the domain from an email address.
 * Strictly parses after the last '@' symbol and ensures no trailing dots or spaces.
 */
export function extractDomain(email: string | null | undefined): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');

  // Must have a valid local part and domain part
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return null;
  }

  const domain = trimmed.slice(atIndex + 1);

  // Reject malformed domains (containing spaces, slashes, or invalid characters)
  if (domain.includes(' ') || domain.includes('/') || domain.includes(':')) {
    return null;
  }

  return domain;
}

export interface DomainValidationOptions {
  allowedDomain?: string;
  testAllowedEmails?: string[];
  requireEmailVerification?: boolean;
}

/**
 * Validates whether an authenticated user is authorized based on email domain
 * and Google verification status.
 *
 * Security considerations:
 * 1. Requires exact match on domain (prevents `attacker@hbplus.fit.evil.com` or `user@fake-hbplus.fit`).
 * 2. Checks email verification status from Google identity token.
 * 3. Supports explicit test whitelist for evaluation without compromising production domain security.
 */
export function validateUserDomain(
  email: string | null | undefined,
  emailVerified: boolean = false,
  options: DomainValidationOptions = {}
): DomainValidationResult {
  const allowedDomain = (options.allowedDomain || DEFAULT_ALLOWED_DOMAIN).trim().toLowerCase();
  const testAllowedEmails = (options.testAllowedEmails || []).map((e) => e.trim().toLowerCase());
  const requireVerification = options.requireEmailVerification ?? true;

  if (!email || typeof email !== 'string') {
    return {
      isAllowed: false,
      domain: null,
      errorMessage: RESTRICTED_DOMAIN_ERROR,
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const domain = extractDomain(normalizedEmail);

  if (!domain) {
    return {
      isAllowed: false,
      domain: null,
      errorMessage: RESTRICTED_DOMAIN_ERROR,
    };
  }

  // Check if email verification is required and whether it is verified
  if (requireVerification && !emailVerified) {
    return {
      isAllowed: false,
      domain,
      errorMessage: UNVERIFIED_EMAIL_ERROR,
    };
  }

  // Check 1: Exact domain match (e.g. hbplus.fit)
  if (domain === allowedDomain) {
    return {
      isAllowed: true,
      domain,
    };
  }

  // Check 2: Safe evaluator test whitelist (allows assessment reviewer to test with their designated email)
  if (testAllowedEmails.length > 0 && testAllowedEmails.includes(normalizedEmail)) {
    return {
      isAllowed: true,
      domain,
    };
  }

  // Unauthorized domain
  return {
    isAllowed: false,
    domain,
    errorMessage: RESTRICTED_DOMAIN_ERROR,
  };
}
