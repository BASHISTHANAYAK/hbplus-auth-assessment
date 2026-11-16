import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface BrandHeaderProps {
  subtitle?: string;
  isCompact?: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  subtitle = 'Secure Single Sign-On for Authorized Personnel',
  isCompact = false,
}) => {
  return (
    <View style={[styles.container, isCompact && styles.compactContainer]}>
      {/* Brand Badge */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="business-outline" size={18} color="#FFFFFF" style={styles.badgeIcon} />
          <Text style={styles.logoText}>ENTERPRISE</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>SSO PORTAL</Text>
        </View>
      </View>

      <Text style={[styles.title, isCompact && styles.compactTitle]}>
        Employee Access Portal
      </Text>

      {subtitle ? (
        <Text style={[styles.subtitle, isCompact && styles.compactSubtitle]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  compactContainer: {
    marginBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
  },
  badgeIcon: {
    marginRight: spacing.xs,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  tagBadge: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  compactTitle: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  compactSubtitle: {
    fontSize: 12,
  },
});
