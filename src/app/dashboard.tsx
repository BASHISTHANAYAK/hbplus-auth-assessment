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
  const { user, isLoading, signOut } = useAuth();
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
            <Text style={styles.logoText}>HB</Text>
            <Text style={styles.logoPlus}>+</Text>
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
                HB+ Enterprise Health & Fitness Network
              </Text>
            </View>
          </View>

          {/* User Profile Card (Official Requirement) */}
          <UserProfileCard user={user} />

          {/* Sample Employee Dashboard Content */}
          <Text style={styles.sectionHeader}>Employee Workspace</Text>

          <View style={styles.grid}>
            {/* Widget 1: Health & Wellness Program */}
            <View style={styles.gridCard}>
              <View style={[styles.cardIconBox, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="fitness-outline" size={24} color={colors.accentDark} />
              </View>
              <Text style={styles.cardTitle}>Fitness & Wellbeing</Text>
              <Text style={styles.cardDesc}>
                Access sponsored gym memberships, health consultations, and monthly wellness stipends.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterHighlight}>Active Benefit • Tier 1</Text>
              </View>
            </View>

            {/* Widget 2: Security & Compliance */}
            <View style={styles.gridCard}>
              <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Security & Identity</Text>
              <Text style={styles.cardDesc}>
                OAuth 2.0 single sign-on with strict @hbplus.fit domain validation and token persistence.
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
              <Text style={styles.cardTitle}>Internal Directory</Text>
              <Text style={styles.cardDesc}>
                Connect with cross-functional nutritionists, trainers, engineering, and product peers.
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardFooterHighlight, { color: '#DB2777' }]}>
                  HB+ Team Access
                </Text>
              </View>
            </View>
          </View>

          {/* Assessment Prototype Note */}
          <View style={styles.prototypeCard}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.prototypeText}>
              This session is validated against the @{user.domain || 'hbplus.fit'} corporate domain policy.
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
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.button,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  logoPlus: {
    color: colors.accentLight,
    fontWeight: '900',
    fontSize: 16,
    marginLeft: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.errorBackground,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  scrollContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
    gap: spacing.lg,
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  welcomeGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    ...shadows.card,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cardFooterHighlight: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentDark,
  },
  prototypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  prototypeText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
