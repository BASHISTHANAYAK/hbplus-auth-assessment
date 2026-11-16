import { DomainValidationResult } from '../types/auth';

/**
 * Default production allowed domain for Employee Access Portal.
 */
export const DEFAULT_ALLOWED_DOMAIN = 'outlook.com';

/**
 * Dynamic error message builder when an unauthorized domain attempts to sign in.
 */
export function getRestrictedErrorMessage(allowedDomain: string = DEFAULT_ALLOWED_DOMAIN): string {
  return `Access restricted. Please sign in using a Google account associated with an @${allowedDomain} email address. Other email domains are not permitted.`;
}

/**
 * Exact error message required when domain access is denied.
 */
export const RESTRICTED_DOMAIN_ERROR = getRestrictedErrorMessage(DEFAULT_ALLOWED_DOMAIN);

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
 * 1. Requires exact match on domain (prevents `attacker@outlook.com.evil.com` or `user@fake-outlook.com`).
 * 2. Checks email verification status from Google identity token.
 * 3. Supports explicit test whitelist for evaluation without compromising domain security.
 */
export function validateUserDomain(
  email: string | null | undefined,
  emailVerified: boolean = false,
  options: DomainValidationOptions = {}
): DomainValidationResult {
  const allowedDomain = (options.allowedDomain || DEFAULT_ALLOWED_DOMAIN).trim().toLowerCase();
  const testAllowedEmails = (options.testAllowedEmails || []).map((e) => e.trim().toLowerCase());
  const requireVerification = options.requireEmailVerification ?? true;
  const currentRestrictedError = getRestrictedErrorMessage(allowedDomain);

  if (!email || typeof email !== 'string') {
    return {
      isAllowed: false,
      domain: null,
      errorMessage: currentRestrictedError,
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const domain = extractDomain(normalizedEmail);

  if (!domain) {
    return {
      isAllowed: false,
      domain: null,
      errorMessage: currentRestrictedError,
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

  // Check 1: Exact domain match (e.g. outlook.com)
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
    errorMessage: currentRestrictedError,
  };
}
