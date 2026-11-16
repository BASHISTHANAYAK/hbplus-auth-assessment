import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { UserProfileCard } from '../components/UserProfileCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { colors, spacing, borderRadius, shadows } from '../theme';

export default function DashboardScreen() {
  const { user, isLoading, signOut, allowedDomain } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Route Guard: redirect unauthenticated or unauthorized users to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <LoadingScreen message="Verifying session authorization..." />;
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={[styles.navbar, { paddingTop: Math.max(insets.top, spacing.md) }]}>
        <View style={styles.navBrand}>
          <View style={styles.logoBadge}>
            <Ionicons name="business-outline" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.navTitle}>Employee Portal</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, spacing.xl) },
        ]}
      >
        <View style={styles.contentWrapper}>
          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <View>
              <Text style={styles.welcomeGreeting}>
                Welcome back, {user.displayName?.split(' ')[0] || 'Employee'}!
              </Text>
              <Text style={styles.welcomeSubtext}>
                Enterprise Workspace & Identity Portal
              </Text>
            </View>
          </View>

          {/* User Profile Card */}
          <UserProfileCard user={user} />

          {/* Sample Employee Dashboard Content */}
          <Text style={styles.sectionHeader}>Employee Workspace</Text>

          <View style={styles.grid}>
            {/* Widget 1: Workplace Resources */}
            <View style={styles.gridCard}>
              <View style={[styles.cardIconBox, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="briefcase-outline" size={24} color={colors.accentDark} />
              </View>
              <Text style={styles.cardTitle}>Workplace Resources</Text>
              <Text style={styles.cardDesc}>
                Access internal productivity tools, project workspaces, and professional development resources.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterHighlight}>Active Workspace</Text>
              </View>
            </View>

            {/* Widget 2: Security & Identity */}
            <View style={styles.gridCard}>
              <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Security & Identity</Text>
              <Text style={styles.cardDesc}>
                OAuth 2.0 single sign-on with strict @{allowedDomain || 'outlook.com'} domain validation and token persistence.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardFooterHighlight, { color: '#2563EB' }]}>
                  Verified Identity
                </Text>
              </View>
            </View>

            {/* Widget 3: Organization Directory */}
            <View style={styles.gridCard}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FDF2F8' }]}>
                <Ionicons name="people-outline" size={24} color="#DB2777" />
              </View>
              <Text style={styles.cardTitle}>Team Directory</Text>
              <Text style={styles.cardDesc}>
                Connect with cross-functional engineering, operations, and product team peers.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardFooterHighlight, { color: '#DB2777' }]}>
                  Enterprise Directory
                </Text>
              </View>
            </View>
          </View>

          {/* Session Policy Card */}
          <View style={styles.prototypeCard}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.prototypeText}>
              This session is validated against the @{user.domain || allowedDomain || 'outlook.com'} corporate domain policy.
              Sign out to clear your authenticated token session.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    ...shadows.button,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    gap: spacing.xs,
  },
  logoutText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 13,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 720,
  },
  welcomeBanner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.accentLight,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  gridCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    ...shadows.card,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.sm,
  },
  cardFooterHighlight: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentDark,
  },
  prototypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  prototypeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
