import { DEFAULT_ALLOWED_DOMAIN, RESTRICTED_DOMAIN_ERROR } from '../utils/domainValidation';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Authentication and Domain Restriction Configuration
 */
export const authConfig = {
  /**
   * The primary allowed corporate domain.
   * Defaults to 'outlook.com', but can be configured via environment variable.
   */
  allowedDomain: (process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || DEFAULT_ALLOWED_DOMAIN).trim().toLowerCase(),

  /**
   * Safe evaluation/test emails list.
   * Strictly disabled in production builds to prevent any accidental bypass.
   */
  testAllowedEmails: !isProduction
    ? (process.env.EXPO_PUBLIC_TEST_ALLOWED_EMAILS || '')
        .split(',')
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean)
    : [],

  /**
   * Exact required error message when domain access is denied.
   */
  restrictedErrorMessage: RESTRICTED_DOMAIN_ERROR,

  /**
   * Optional Cloud Firestore profile sync flag.
   * Disabled by default until Firestore is explicitly provisioned in Firebase.
   */
  enableFirestore:
    process.env.EXPO_PUBLIC_ENABLE_FIRESTORE === 'true' ||
    process.env.EXPO_PUBLIC_FIRESTORE_ENABLED === 'true',

  /**
   * Application display metadata.
   */
  appName: 'Employee Access Portal',
  tagline: 'Secure Single Sign-On for Authorized Personnel',
  assessmentDisclaimer: 'Portfolio Showcase',
};
