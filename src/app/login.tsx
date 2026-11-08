import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { BrandHeader } from '../components/BrandHeader';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { AlertBanner } from '../components/AlertBanner';
import { colors, spacing, borderRadius, shadows } from '../theme';

export default function LoginScreen() {
  const { user, isAuthenticating, authError, signInWithGoogle, clearError, allowedDomain } =
    useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    const success = await signInWithGoogle();
    if (success) {
      router.replace('/dashboard');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, spacing.lg), paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          <BrandHeader />

          {/* Error Banner */}
          {authError ? (
            <AlertBanner
              message={authError}
              type="error"
              onDismiss={clearError}
            />
          ) : null}

          {/* Login Card */}
          <View style={styles.authBox}>
            <Text style={styles.authTitle}>Sign in to your account</Text>
            <Text style={styles.authDescription}>
              Use your corporate Google identity to access internal fitness, nutrition, and organizational resources.
            </Text>

            <View style={styles.buttonWrapper}>
              <GoogleSignInButton
                onPress={handleSignIn}
                isLoading={isAuthenticating}
                disabled={isAuthenticating}
              />
            </View>

            {/* Domain Policy Notice */}
            <View style={styles.policyBox}>
              <Text style={styles.policyTitle}>Domain Restriction Policy</Text>
              <Text style={styles.policyText}>
                Access is restricted strictly to active accounts ending in{' '}
                <Text style={styles.domainHighlight}>@{allowedDomain}</Text>. Unverified accounts or personal Gmail accounts will be denied entry.
              </Text>
            </View>
          </View>

          {/* Prototype Evaluation Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              HB+ Technology Assessment Prototype • OAuth 2.0 & Firebase Auth
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  authBox: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.card,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  authDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  policyBox: {
    width: '100%',
    backgroundColor: colors.badgeBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  policyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  policyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  domainHighlight: {
    fontWeight: '700',
    color: colors.accentDark,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
